import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { hashPassword, verifyPassword } from "./auth";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => {
      if (!opts.ctx.user) return null;
      const { passwordHash, ...safeUser } = opts.ctx.user as any;
      return safeUser;
    }),

    signup: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          email: z.string().email("Please enter a valid email address"),
          password: z.string().min(6, "Password must be at least 6 characters"),
          institution: z.string().optional(),
          department: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const email = input.email.toLowerCase().trim();

        const existing = await db.getUserByEmail(email);
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "An account with this email already exists",
          });
        }

        const passwordHash = hashPassword(input.password);
        const openId = `usr_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;

        const user = await db.createUser({
          openId,
          name: input.name.trim(),
          email,
          passwordHash,
          loginMethod: "email",
          role: "user",
        });

        // Initialize student profile in the database
        await db.createStudentProfile({
          userId: user.id,
          institution: input.institution || "Northbridge University",
          department: input.department || "Computer Science",
        });

        const sessionToken = await sdk.createSessionToken(openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        return {
          success: true,
          user: {
            id: user.id,
            openId: user.openId,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),

    login: publicProcedure
      .input(
        z.object({
          email: z.string().email("Please enter a valid email address"),
          password: z.string().min(1, "Password is required"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const email = input.email.toLowerCase().trim();
        const user = await db.getUserByEmail(email);

        if (!user || !user.passwordHash) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        const isValid = verifyPassword(input.password, user.passwordHash);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        await db.updateUserLastSignedIn(user.openId);

        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        return {
          success: true,
          user: {
            id: user.id,
            openId: user.openId,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getStudentProfileByUserId(ctx.user.id);
      return {
        user: ctx.user,
        profile,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
