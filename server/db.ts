import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import fs from "fs";
import path from "path";
import { InsertUser, User, users, studentProfiles } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _dbInitChecked = false;

// Persistent local file store fallback for development when MySQL is not running
const DATA_DIR = path.resolve(process.cwd(), ".data");
const LOCAL_DB_FILE = path.join(DATA_DIR, "db.json");

interface LocalDbState {
  users: Array<User & { passwordHash?: string | null }>;
  studentProfiles: Array<{
    id: number;
    userId: number;
    institution: string;
    department?: string | null;
    graduationYear?: number | null;
    bio?: string | null;
    contactEmail?: string | null;
    discordHandle?: string | null;
    telegramHandle?: string | null;
    linkedinUrl?: string | null;
    visibility: "campus_only" | "public" | "department_only";
    createdAt: string;
    updatedAt: string;
  }>;
}

function getLocalDbState(): LocalDbState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const content = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("[LocalDb] Failed to read local db file:", err);
  }
  return { users: [], studentProfiles: [] };
}

function saveLocalDbState(state: LocalDbState) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("[LocalDb] Failed to save local db file:", err);
  }
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
      if (!_dbInitChecked) {
        _dbInitChecked = true;
        console.log("[Database] Connected to MySQL via Drizzle ORM");
      }
    } catch (error) {
      console.warn("[Database] Failed to connect to MySQL:", error);
      _db = null;
    }
  }
  return _db;
}

export async function getUserByEmail(email: string): Promise<(User & { passwordHash?: string | null }) | undefined> {
  const normalizedEmail = email.toLowerCase().trim();
  const db = await getDb();
  if (db) {
    try {
      const result = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
      if (result.length > 0) return result[0];
    } catch (error) {
      console.warn("[Database] MySQL getUserByEmail error, falling back to local store:", error);
    }
  }

  const localState = getLocalDbState();
  const match = localState.users.find(u => u.email?.toLowerCase().trim() === normalizedEmail);
  return match;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDb();
  if (db) {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (result.length > 0) return result[0];
    } catch (error) {
      console.warn("[Database] MySQL getUserById error, falling back to local store:", error);
    }
  }

  const localState = getLocalDbState();
  return localState.users.find(u => u.id === id);
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (db) {
    try {
      const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
      if (result.length > 0) return result[0];
    } catch (error) {
      console.warn("[Database] MySQL getUserByOpenId error, falling back to local store:", error);
    }
  }

  const localState = getLocalDbState();
  const match = localState.users.find(u => u.openId === openId);
  return match;
}

export async function createUser(data: {
  openId: string;
  name: string;
  email: string;
  passwordHash: string;
  loginMethod?: string;
  role?: "user" | "admin";
}): Promise<User> {
  const db = await getDb();
  const now = new Date();

  if (db) {
    try {
      const [insertResult] = await db.insert(users).values({
        openId: data.openId,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        loginMethod: data.loginMethod || "email",
        role: data.role || "user",
        createdAt: now,
        updatedAt: now,
        lastSignedIn: now,
      });

      const newId = insertResult ? Number(insertResult.insertId) : 1;
      const createdUser = await getUserById(newId);
      if (createdUser) return createdUser;
    } catch (error) {
      console.warn("[Database] MySQL createUser error, persisting to local store:", error);
    }
  }

  // Local fallback
  const localState = getLocalDbState();
  const nextId = localState.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const newUser: User & { passwordHash: string } = {
    id: nextId,
    openId: data.openId,
    name: data.name,
    email: data.email.toLowerCase().trim(),
    passwordHash: data.passwordHash,
    loginMethod: data.loginMethod || "email",
    role: data.role || (data.openId === ENV.ownerOpenId ? "admin" : "user"),
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };

  localState.users.push(newUser);
  saveLocalDbState(localState);
  return newUser;
}

export async function updateUserLastSignedIn(openId: string): Promise<void> {
  const now = new Date();
  const db = await getDb();
  if (db) {
    try {
      await db.update(users).set({ lastSignedIn: now }).where(eq(users.openId, openId));
    } catch (error) {
      console.warn("[Database] MySQL updateUserLastSignedIn error:", error);
    }
  }

  const localState = getLocalDbState();
  const user = localState.users.find(u => u.openId === openId);
  if (user) {
    user.lastSignedIn = now;
    saveLocalDbState(localState);
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  const now = new Date();

  if (db) {
    try {
      const values: InsertUser = {
        openId: user.openId,
      };
      const updateSet: Record<string, unknown> = {};

      const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;
      type TextField = (typeof textFields)[number];

      const assignNullable = (field: TextField) => {
        const value = user[field];
        if (value === undefined) return;
        const normalized = value ?? null;
        values[field] = normalized;
        updateSet[field] = normalized;
      };

      textFields.forEach(assignNullable);

      if (user.lastSignedIn !== undefined) {
        values.lastSignedIn = user.lastSignedIn;
        updateSet.lastSignedIn = user.lastSignedIn;
      }
      if (user.role !== undefined) {
        values.role = user.role;
        updateSet.role = user.role;
      } else if (user.openId === ENV.ownerOpenId) {
        values.role = "admin";
        updateSet.role = "admin";
      }

      if (!values.lastSignedIn) {
        values.lastSignedIn = now;
      }

      if (Object.keys(updateSet).length === 0) {
        updateSet.lastSignedIn = now;
      }

      await db.insert(users).values(values).onDuplicateKeyUpdate({
        set: updateSet,
      });
      return;
    } catch (error) {
      console.warn("[Database] MySQL upsertUser error, falling back to local store:", error);
    }
  }

  const localState = getLocalDbState();
  const existing = localState.users.find(u => u.openId === user.openId);
  if (existing) {
    if (user.name !== undefined) existing.name = user.name;
    if (user.email !== undefined) existing.email = user.email;
    if (user.passwordHash !== undefined) existing.passwordHash = user.passwordHash;
    if (user.loginMethod !== undefined) existing.loginMethod = user.loginMethod;
    if (user.role !== undefined) existing.role = user.role;
    existing.lastSignedIn = user.lastSignedIn || now;
    existing.updatedAt = now;
  } else {
    const nextId = localState.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
    localState.users.push({
      id: nextId,
      openId: user.openId,
      name: user.name ?? null,
      email: user.email ?? null,
      passwordHash: user.passwordHash ?? null,
      loginMethod: user.loginMethod ?? "email",
      role: user.role || (user.openId === ENV.ownerOpenId ? "admin" : "user"),
      createdAt: now,
      updatedAt: now,
      lastSignedIn: user.lastSignedIn || now,
    });
  }
  saveLocalDbState(localState);
}

export async function createStudentProfile(data: {
  userId: number;
  institution?: string;
  department?: string;
  bio?: string;
}): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.insert(studentProfiles).values({
        userId: data.userId,
        institution: data.institution || "Northbridge University",
        department: data.department || "Computer Science",
        bio: data.bio || null,
        visibility: "campus_only",
      });
      return;
    } catch (error) {
      console.warn("[Database] MySQL createStudentProfile error:", error);
    }
  }

  const localState = getLocalDbState();
  const nextId = localState.studentProfiles.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  localState.studentProfiles.push({
    id: nextId,
    userId: data.userId,
    institution: data.institution || "Northbridge University",
    department: data.department || "Computer Science",
    bio: data.bio || null,
    visibility: "campus_only",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  saveLocalDbState(localState);
}

export async function getStudentProfileByUserId(userId: number) {
  const db = await getDb();
  if (db) {
    try {
      const result = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1);
      if (result.length > 0) return result[0];
    } catch (error) {
      console.warn("[Database] MySQL getStudentProfileByUserId error:", error);
    }
  }

  const localState = getLocalDbState();
  return localState.studentProfiles.find(p => p.userId === userId);
}
