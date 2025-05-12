import { pgTable, text, serial, integer, boolean, timestamp, json, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase UID
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  photoURL: text("photo_url"),
  phoneNumber: text("phone_number"),
  emailVerified: boolean("email_verified").default(false),
  provider: text("provider").default("email"),
  role: text("role").default("user"), // user, admin, instructor
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Course schema
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  instructorId: integer("instructor_id").references(() => users.id),
  instructorName: text("instructor_name").notNull(),
  instructorTitle: text("instructor_title").notNull(),
  instructorPhoto: text("instructor_photo"),
  price: integer("price").notNull(), // in cents
  originalPrice: integer("original_price").notNull(), // in cents
  duration: text("duration").notNull(),
  lessons: integer("lessons").notNull(),
  level: text("level").notNull(), // beginner, intermediate, advanced
  isFeatured: boolean("is_featured").default(false),
  isPublished: boolean("is_published").default(false),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  badge: text("badge"), // BESTSELLER, POPULAR, NEW
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

// Course content
export const courseContent = pgTable("course_content", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // video, text, quiz
  content: text("content").notNull(),
  duration: integer("duration"), // in seconds, for videos
  order: integer("order").notNull(),
});

export const insertCourseContentSchema = createInsertSchema(courseContent).omit({
  id: true,
});

// User courses (purchased courses)
export const userCourses = pgTable("user_courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  completedLessons: json("completed_lessons").default([]),
  progress: integer("progress").default(0),
  referralCode: text("referral_code"),
  referredBy: text("referred_by"),
});

export const insertUserCourseSchema = createInsertSchema(userCourses).omit({
  id: true,
  purchasedAt: true,
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").default("INR"),
  status: text("status").notNull(), // success, pending, failed
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpayOrderId: text("razorpay_order_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

// Referrals
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  code: text("code").notNull().unique(),
  usedCount: integer("used_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

// Analytics - Page Views
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  page: text("page").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  userAgent: text("user_agent"),
  metadata: json("metadata").default({}),
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  timestamp: true,
});

// Analytics - Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  eventType: text("event_type").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: json("metadata").default({}),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  timestamp: true,
});

// Auth Sessions for express-session
export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type CourseContent = typeof courseContent.$inferSelect;
export type InsertCourseContent = z.infer<typeof insertCourseContentSchema>;

export type UserCourse = typeof userCourses.$inferSelect;
export type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
