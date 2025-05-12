import {
  users,
  courses,
  courseContent,
  userCourses,
  payments,
  referrals,
  pageViews,
  events,
  type User,
  type InsertUser,
  type Course,
  type InsertCourse,
  type CourseContent,
  type InsertCourseContent,
  type UserCourse,
  type InsertUserCourse,
  type Payment,
  type InsertPayment,
  type Referral,
  type InsertReferral,
  type PageView,
  type InsertPageView,
  type Event,
  type InsertEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from 'drizzle-orm';
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  getFeaturedCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;

  // Course content methods
  getCourseContent(courseId: number): Promise<CourseContent[]>;
  getCourseContentById(id: number): Promise<CourseContent | undefined>;
  createCourseContent(content: InsertCourseContent): Promise<CourseContent>;
  updateCourseContent(id: number, content: Partial<CourseContent>): Promise<CourseContent | undefined>;
  deleteCourseContent(id: number): Promise<boolean>;

  // User courses methods
  getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]>;
  getUserCourse(userId: number, courseId: number): Promise<UserCourse | undefined>;
  purchaseCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  updateUserCourseProgress(id: number, completedLessons: number[], progress: number): Promise<UserCourse | undefined>;

  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  updatePaymentStatus(id: number, status: string, razorpayPaymentId?: string): Promise<Payment | undefined>;

  // Referral methods
  getReferral(code: string): Promise<Referral | undefined>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferralUsedCount(id: number): Promise<Referral | undefined>;
  getUserReferrals(userId: number): Promise<Referral[]>;
  
  // Analytics methods (for tracking)
  recordPageView(userId: number | null, page: string, metadata?: any): Promise<void>;
  getPageViews(userId?: number, startDate?: Date, endDate?: Date): Promise<any[]>;
  recordEvent(userId: number | null, eventType: string, metadata?: any): Promise<void>;
  getEvents(userId?: number, eventType?: string, startDate?: Date, endDate?: Date): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Initialize session store with PostgreSQL
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'sessions'
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.uid, uid));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
    return course;
  }

  async getAllCourses(): Promise<Course[]> {
    return db.select().from(courses);
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.category, category));
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.isFeatured, true));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set(courseData)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await db.delete(courses).where(eq(courses.id, id));
    return result.count > 0;
  }

  // Course content methods
  async getCourseContent(courseId: number): Promise<CourseContent[]> {
    return db
      .select()
      .from(courseContent)
      .where(eq(courseContent.courseId, courseId))
      .orderBy(courseContent.order);
  }

  async getCourseContentById(id: number): Promise<CourseContent | undefined> {
    const [content] = await db
      .select()
      .from(courseContent)
      .where(eq(courseContent.id, id));
    return content;
  }

  async createCourseContent(content: InsertCourseContent): Promise<CourseContent> {
    const [newContent] = await db.insert(courseContent).values(content).returning();
    return newContent;
  }

  async updateCourseContent(id: number, contentData: Partial<CourseContent>): Promise<CourseContent | undefined> {
    const [updatedContent] = await db
      .update(courseContent)
      .set(contentData)
      .where(eq(courseContent.id, id))
      .returning();
    return updatedContent;
  }

  async deleteCourseContent(id: number): Promise<boolean> {
    const result = await db.delete(courseContent).where(eq(courseContent.id, id));
    return result.count > 0;
  }

  // User courses methods
  async getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]> {
    const userCoursesResult = await db
      .select({
        userCourse: userCourses,
        course: courses
      })
      .from(userCourses)
      .innerJoin(courses, eq(userCourses.courseId, courses.id))
      .where(eq(userCourses.userId, userId));
    
    return userCoursesResult.map(result => ({
      ...result.userCourse,
      course: result.course
    }));
  }

  async getUserCourse(userId: number, courseId: number): Promise<UserCourse | undefined> {
    const [userCourse] = await db
      .select()
      .from(userCourses)
      .where(and(
        eq(userCourses.userId, userId),
        eq(userCourses.courseId, courseId)
      ));
    return userCourse;
  }

  async purchaseCourse(userCourse: InsertUserCourse): Promise<UserCourse> {
    const [newUserCourse] = await db
      .insert(userCourses)
      .values({
        ...userCourse,
        completedLessons: [],
        progress: 0
      })
      .returning();
    return newUserCourse;
  }

  async updateUserCourseProgress(
    id: number,
    completedLessons: number[],
    progress: number
  ): Promise<UserCourse | undefined> {
    const [updatedUserCourse] = await db
      .update(userCourses)
      .set({
        completedLessons,
        progress
      })
      .where(eq(userCourses.id, id))
      .returning();
    return updatedUserCourse;
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.userId, userId));
  }

  async updatePaymentStatus(
    id: number,
    status: string,
    razorpayPaymentId?: string
  ): Promise<Payment | undefined> {
    const updateData: Partial<Payment> = { status };
    if (razorpayPaymentId) {
      updateData.razorpayPaymentId = razorpayPaymentId;
    }
    
    const [updatedPayment] = await db
      .update(payments)
      .set(updateData)
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  // Referral methods
  async getReferral(code: string): Promise<Referral | undefined> {
    const [referral] = await db.select().from(referrals).where(eq(referrals.code, code));
    return referral;
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const [newReferral] = await db
      .insert(referrals)
      .values({
        ...referral,
        usedCount: 0
      })
      .returning();
    return newReferral;
  }

  async updateReferralUsedCount(id: number): Promise<Referral | undefined> {
    const [referral] = await db.select().from(referrals).where(eq(referrals.id, id));
    if (!referral) return undefined;
    
    const [updatedReferral] = await db
      .update(referrals)
      .set({
        usedCount: (referral.usedCount || 0) + 1
      })
      .where(eq(referrals.id, id))
      .returning();
    return updatedReferral;
  }

  async getUserReferrals(userId: number): Promise<Referral[]> {
    return db.select().from(referrals).where(eq(referrals.userId, userId));
  }
  
  // Analytics methods
  async recordPageView(userId: number | null, page: string, metadata?: any): Promise<void> {
    await db.insert(pageViews).values({
      userId,
      page,
      metadata: metadata || {}
    });
  }
  
  async getPageViews(userId?: number, startDate?: Date, endDate?: Date): Promise<any[]> {
    let query = db.select().from(pageViews);
    
    if (userId) {
      query = query.where(eq(pageViews.userId, userId));
    }
    
    if (startDate) {
      query = query.where(sql`${pageViews.timestamp} >= ${startDate}`);
    }
    
    if (endDate) {
      query = query.where(sql`${pageViews.timestamp} <= ${endDate}`);
    }
    
    return query.orderBy(desc(pageViews.timestamp));
  }
  
  async recordEvent(userId: number | null, eventType: string, metadata?: any): Promise<void> {
    await db.insert(events).values({
      userId,
      eventType,
      metadata: metadata || {}
    });
  }
  
  async getEvents(userId?: number, eventType?: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    let query = db.select().from(events);
    
    if (userId) {
      query = query.where(eq(events.userId, userId));
    }
    
    if (eventType) {
      query = query.where(eq(events.eventType, eventType));
    }
    
    if (startDate) {
      query = query.where(sql`${events.timestamp} >= ${startDate}`);
    }
    
    if (endDate) {
      query = query.where(sql`${events.timestamp} <= ${endDate}`);
    }
    
    return query.orderBy(desc(events.timestamp));
  }
}

export const storage = new DatabaseStorage();
