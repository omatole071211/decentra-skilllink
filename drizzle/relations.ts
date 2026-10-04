import { relations } from "drizzle-orm";
import {
  users,
  skills,
  userSkills,
  studentProfiles,
  learningGoals,
  skillRequests,
  matches,
  exchanges,
  peerFeedback,
  contributionRecords,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  userSkills: many(userSkills),
  learningGoals: many(learningGoals),
  skillRequests: many(skillRequests),
  contributionRecord: one(contributionRecords, {
    fields: [users.id],
    references: [contributionRecords.userId],
  }),
  matchesInitiated: many(matches, { relationName: "userMatches" }),
  matchesReceived: many(matches, { relationName: "matchedUser" }),
  exchangesProposed: many(exchanges, { relationName: "proposer" }),
  exchangesReceived: many(exchanges, { relationName: "receiver" }),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
}));

export const learningGoalsRelations = relations(learningGoals, ({ one }) => ({
  user: one(users, {
    fields: [learningGoals.userId],
    references: [users.id],
  }),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  userSkills: many(userSkills),
}));

export const userSkillsRelations = relations(userSkills, ({ one }) => ({
  user: one(users, {
    fields: [userSkills.userId],
    references: [users.id],
  }),
  skill: one(skills, {
    fields: [userSkills.skillId],
    references: [skills.id],
  }),
}));

export const skillRequestsRelations = relations(skillRequests, ({ one }) => ({
  user: one(users, {
    fields: [skillRequests.userId],
    references: [users.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  user: one(users, {
    fields: [matches.userId],
    references: [users.id],
    relationName: "userMatches",
  }),
  matchedUser: one(users, {
    fields: [matches.matchedUserId],
    references: [users.id],
    relationName: "matchedUser",
  }),
}));

export const exchangesRelations = relations(exchanges, ({ one, many }) => ({
  proposer: one(users, {
    fields: [exchanges.proposerId],
    references: [users.id],
    relationName: "proposer",
  }),
  receiver: one(users, {
    fields: [exchanges.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
  feedbacks: many(peerFeedback),
}));

export const peerFeedbackRelations = relations(peerFeedback, ({ one }) => ({
  exchange: one(exchanges, {
    fields: [peerFeedback.exchangeId],
    references: [exchanges.id],
  }),
  reviewer: one(users, {
    fields: [peerFeedback.reviewerId],
    references: [users.id],
    relationName: "reviewer",
  }),
  targetUser: one(users, {
    fields: [peerFeedback.targetUserId],
    references: [users.id],
    relationName: "targetUser",
  }),
}));

export const contributionRecordsRelations = relations(contributionRecords, ({ one }) => ({
  user: one(users, {
    fields: [contributionRecords.userId],
    references: [users.id],
  }),
}));
