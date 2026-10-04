import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Additional Feature 1: Relational Database Schema & Persistent Data Models

export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userSkills = mysqlTable("user_skills", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  skillId: int("skillId").notNull(),
  proficiency: mysqlEnum("proficiency", ["Beginner", "Intermediate", "Advanced", "Expert"]).notNull(),
  projectUrl: varchar("projectUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Additional Feature 2: Student Profile & Skill Inventory System

export const studentProfiles = mysqlTable("student_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  institution: varchar("institution", { length: 255 }).default("Northbridge University").notNull(),
  department: varchar("department", { length: 255 }),
  graduationYear: int("graduationYear"),
  bio: text("bio"),
  contactEmail: varchar("contactEmail", { length: 320 }),
  discordHandle: varchar("discordHandle", { length: 120 }),
  telegramHandle: varchar("telegramHandle", { length: 120 }),
  linkedinUrl: varchar("linkedinUrl", { length: 255 }),
  visibility: mysqlEnum("visibility", ["campus_only", "public", "department_only"]).default("campus_only").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const learningGoals = mysqlTable("learning_goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  skillName: varchar("skillName", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }),
  priority: mysqlEnum("priority", ["Urgent", "High", "Normal"]).default("Normal").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const skillRequests = mysqlTable("skill_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  projectDetails: text("projectDetails"),
  deadline: timestamp("deadline"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  matchedUserId: int("matchedUserId").notNull(),
  matchType: mysqlEnum("matchType", ["Direct", "Reciprocal"]).notNull(),
  compatibilityScore: int("compatibilityScore").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const exchanges = mysqlTable("exchanges", {
  id: int("id").autoincrement().primaryKey(),
  proposerId: int("proposerId").notNull(),
  receiverId: int("receiverId").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "scheduled", "in_progress", "completed", "incomplete"]).default("pending").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  meetingLink: varchar("meetingLink", { length: 512 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const peerFeedback = mysqlTable("peer_feedback", {
  id: int("id").autoincrement().primaryKey(),
  exchangeId: int("exchangeId").notNull(),
  reviewerId: int("reviewerId").notNull(),
  targetUserId: int("targetUserId").notNull(),
  helpfulnessScore: int("helpfulnessScore").notNull(),
  reliabilityScore: int("reliabilityScore").notNull(),
  communicationScore: int("communicationScore").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const contributionRecords = mysqlTable("contribution_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  completedExchanges: int("completedExchanges").default(0).notNull(),
  totalHours: int("totalHours").default(0).notNull(),
  averageRating: varchar("averageRating", { length: 10 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type LearningGoal = typeof learningGoals.$inferSelect;
export type SkillRequest = typeof skillRequests.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Exchange = typeof exchanges.$inferSelect;
export type PeerFeedback = typeof peerFeedback.$inferSelect;
export type ContributionRecord = typeof contributionRecords.$inferSelect;