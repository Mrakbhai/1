import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { apiRequest } from "./queryClient";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "your-messaging-sender-id", // This can be added later if needed
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  'display': 'popup'
});

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in with email and password:", error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up with email and password:", error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // The signed-in user info
    const user = result.user;
    
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    // Store the token in session storage (cleared when browser is closed)
    if (token) {
      sessionStorage.setItem('googleAccessToken', token);
    }
    
    // Create or update user profile
    await createOrUpdateUserProfile(user);
    
    return user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    
    // Handle specific Firebase auth errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Login cancelled by user. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Login popup was blocked. Please allow popups for this site and try again.');
    }
    
    throw error;
  }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    
    // The signed-in user info
    const user = result.user;
    
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    // Store the token in session storage (cleared when browser is closed)
    if (token) {
      sessionStorage.setItem('facebookAccessToken', token);
    }
    
    // Create or update user profile
    await createOrUpdateUserProfile(user);
    
    return user;
  } catch (error: any) {
    console.error("Error signing in with Facebook:", error);
    
    // Handle specific Firebase auth errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Login cancelled by user. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Login popup was blocked. Please allow popups for this site and try again.');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with the same email address but different sign-in credentials. Sign in using the provider associated with this email address.');
    }
    
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Create or update user profile in our database
export const createOrUpdateUserProfile = async (user: User) => {
  if (!user) return;

  try {
    // Use Firestore directly instead of going through our API
    return await createOrUpdateUserInFirestore(user);
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    // Non-critical error, don't throw so authentication still succeeds
  }
};

// Update user profile in Firebase
export const updateUserDisplayName = async (displayName: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  try {
    await updateProfile(user, { displayName });
    return user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user photo in Firebase
export const updateUserPhoto = async (photoURL: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  try {
    await updateProfile(user, { photoURL });
    return user;
  } catch (error) {
    console.error('Error updating user photo:', error);
    throw error;
  }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore database functions

// Users collection
const usersCollection = collection(db, 'users');

// Create or update user in Firestore
export const createOrUpdateUserInFirestore = async (user: User) => {
  if (!user) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      phoneNumber: user.phoneNumber || '',
      emailVerified: user.emailVerified,
      provider: user.providerData?.[0]?.providerId || 'unknown',
      updatedAt: serverTimestamp(),
    };
    
    if (!userSnap.exists()) {
      // Create new user
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        enrolledCourses: [],
        completedCourses: [],
        role: 'student', // Default role
      });
    } else {
      // Update existing user
      await updateDoc(userRef, userData);
    }
    
    return userRef;
  } catch (error) {
    console.error('Error creating/updating user in Firestore:', error);
    throw error;
  }
};

// Get user from Firestore
export const getUserFromFirestore = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user from Firestore:', error);
    throw error;
  }
};

// Courses collection
const coursesCollection = collection(db, 'courses');

// Get all courses
export const getAllCourses = async () => {
  try {
    const querySnapshot = await getDocs(coursesCollection);
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return courses;
  } catch (error) {
    console.error('Error getting courses from Firestore:', error);
    throw error;
  }
};

// Get featured courses
export const getFeaturedCourses = async () => {
  try {
    const q = query(coursesCollection, where("featured", "==", true));
    const querySnapshot = await getDocs(q);
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return courses;
  } catch (error) {
    console.error('Error getting featured courses from Firestore:', error);
    throw error;
  }
};

// Get course by ID
export const getCourseById = async (courseId: string) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting course from Firestore:', error);
    throw error;
  }
};

// Get course by slug
export const getCourseBySlug = async (slug: string) => {
  try {
    const q = query(coursesCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting course by slug from Firestore:', error);
    throw error;
  }
};

// Get courses by category
export const getCoursesByCategory = async (category: string) => {
  try {
    const q = query(coursesCollection, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return courses;
  } catch (error) {
    console.error('Error getting courses by category from Firestore:', error);
    throw error;
  }
};

// User Courses - Enrollments
export const getUserCourses = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userCourseCollectionRef = collection(userRef, 'enrollments');
    const querySnapshot = await getDocs(userCourseCollectionRef);
    
    const enrollments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get the detailed course information for each enrollment
    const enrollmentsWithCourses = await Promise.all(
      enrollments.map(async (enrollment) => {
        const courseId = enrollment.courseId;
        const course = await getCourseById(courseId);
        return {
          ...enrollment,
          course
        };
      })
    );
    
    return enrollmentsWithCourses;
  } catch (error) {
    console.error('Error getting user courses from Firestore:', error);
    throw error;
  }
};

// Enroll user in a course
export const enrollUserInCourse = async (userId: string, courseId: string, paymentId: string, price: number, discount = 0) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userCourseCollectionRef = collection(userRef, 'enrollments');
    
    // Check if already enrolled
    const q = query(userCourseCollectionRef, where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('User is already enrolled in this course');
    }
    
    // Add enrollment
    const enrollmentData = {
      courseId,
      enrolledAt: serverTimestamp(),
      completedLessons: [],
      progress: 0,
      lastAccessedAt: serverTimestamp(),
      paymentId,
      price,
      discount,
      finalPrice: price - discount,
    };
    
    const docRef = await addDoc(userCourseCollectionRef, enrollmentData);
    return { id: docRef.id, ...enrollmentData };
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    throw error;
  }
};

// Update user course progress
export const updateCourseProgress = async (userId: string, enrollmentId: string, completedLessons: string[], progress: number) => {
  try {
    const enrollmentRef = doc(db, `users/${userId}/enrollments`, enrollmentId);
    
    await updateDoc(enrollmentRef, {
      completedLessons,
      progress,
      lastAccessedAt: serverTimestamp()
    });
    
    return { id: enrollmentId, completedLessons, progress };
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw error;
  }
};

// Payments collection
const paymentsCollection = collection(db, 'payments');

// Create a payment record
export const createPayment = async (paymentData: any) => {
  try {
    const docRef = await addDoc(paymentsCollection, {
      ...paymentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { id: docRef.id, ...paymentData };
  } catch (error) {
    console.error('Error creating payment record:', error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (paymentId: string, status: string, razorpayPaymentId?: string) => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (razorpayPaymentId) {
      updateData.razorpayPaymentId = razorpayPaymentId;
    }
    
    await updateDoc(paymentRef, updateData);
    
    return { id: paymentId, status, razorpayPaymentId };
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Get user payments
export const getUserPayments = async (userId: string) => {
  try {
    const q = query(paymentsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const payments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return payments;
  } catch (error) {
    console.error('Error getting user payments from Firestore:', error);
    throw error;
  }
};

// Referrals collection
const referralsCollection = collection(db, 'referrals');

// Create referral code
export const createReferral = async (userId: string, code: string, discount: number) => {
  try {
    // Check if code already exists
    const q = query(referralsCollection, where("code", "==", code));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Referral code already exists');
    }
    
    const docRef = await addDoc(referralsCollection, {
      userId,
      code,
      discount,
      usedCount: 0,
      createdAt: serverTimestamp()
    });
    
    return { id: docRef.id, userId, code, discount, usedCount: 0 };
  } catch (error) {
    console.error('Error creating referral code:', error);
    throw error;
  }
};

// Get referral by code
export const getReferralByCode = async (code: string) => {
  try {
    const q = query(referralsCollection, where("code", "==", code));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting referral by code from Firestore:', error);
    throw error;
  }
};

// Update referral used count
export const updateReferralUsedCount = async (referralId: string) => {
  try {
    const referralRef = doc(db, 'referrals', referralId);
    const referralSnap = await getDoc(referralRef);
    
    if (!referralSnap.exists()) {
      throw new Error('Referral not found');
    }
    
    const currentCount = referralSnap.data().usedCount || 0;
    
    await updateDoc(referralRef, {
      usedCount: currentCount + 1
    });
    
    return { id: referralId, usedCount: currentCount + 1 };
  } catch (error) {
    console.error('Error updating referral used count:', error);
    throw error;
  }
};

// Analytics collection
const analyticsCollection = collection(db, 'analytics');

// Record page view
export const recordPageView = async (userId: string | null, page: string, metadata: any = {}) => {
  try {
    await addDoc(collection(db, 'analytics', 'pageViews', 'views'), {
      userId,
      page,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      metadata
    });
  } catch (error) {
    console.error('Error recording page view:', error);
    // Non-critical error, don't throw
  }
};

// Record user event (button click, form submission, etc.)
export const recordEvent = async (userId: string | null, eventType: string, metadata: any = {}) => {
  try {
    await addDoc(collection(db, 'analytics', 'events', 'items'), {
      userId,
      eventType,
      timestamp: serverTimestamp(),
      metadata
    });
  } catch (error) {
    console.error('Error recording event:', error);
    // Non-critical error, don't throw
  }
};

// Get page views with optional filters
export const getPageViews = async (options: {
  userId?: string,
  page?: string,
  startDate?: Date,
  endDate?: Date,
  limit?: number
} = {}) => {
  try {
    const { userId, page, startDate, endDate, limit = 100 } = options;
    
    let q: any = collection(db, 'analytics', 'pageViews', 'views');
    const constraints: any[] = [];
    
    if (userId) {
      constraints.push(where("userId", "==", userId));
    }
    
    if (page) {
      constraints.push(where("page", "==", page));
    }
    
    if (startDate) {
      constraints.push(where("timestamp", ">=", startDate));
    }
    
    if (endDate) {
      constraints.push(where("timestamp", "<=", endDate));
    }
    
    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }
    
    const querySnapshot = await getDocs(q);
    const pageViews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return pageViews;
  } catch (error) {
    console.error('Error getting page views from Firestore:', error);
    throw error;
  }
};

// Get events with optional filters
export const getEvents = async (options: {
  userId?: string,
  eventType?: string,
  startDate?: Date,
  endDate?: Date,
  limit?: number
} = {}) => {
  try {
    const { userId, eventType, startDate, endDate, limit = 100 } = options;
    
    let q: any = collection(db, 'analytics', 'events', 'items');
    const constraints: any[] = [];
    
    if (userId) {
      constraints.push(where("userId", "==", userId));
    }
    
    if (eventType) {
      constraints.push(where("eventType", "==", eventType));
    }
    
    if (startDate) {
      constraints.push(where("timestamp", ">=", startDate));
    }
    
    if (endDate) {
      constraints.push(where("timestamp", "<=", endDate));
    }
    
    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }
    
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return events;
  } catch (error) {
    console.error('Error getting events from Firestore:', error);
    throw error;
  }
};

// Admin functions
// Get all users for admin dashboard
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return users;
  } catch (error) {
    console.error('Error getting all users from Firestore:', error);
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId: string, role: 'student' | 'instructor' | 'admin') => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role });
    return { id: userId, role };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Get dashboard stats for admin
export const getAdminDashboardStats = async () => {
  try {
    // Get total users count
    const usersQuery = await getDocs(usersCollection);
    const totalUsers = usersQuery.size;
    
    // Get total courses count
    const coursesQuery = await getDocs(coursesCollection);
    const totalCourses = coursesQuery.size;
    
    // Get total payments
    const paymentsQuery = await getDocs(paymentsCollection);
    const payments = paymentsQuery.docs.map(doc => doc.data());
    const totalRevenue = payments.reduce((sum, payment: any) => sum + (payment.amount || 0), 0);
    
    // Get recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // This is a placeholder since we can't easily do this query with the current structure
    // In a real implementation, we would use a more sophisticated query with Firestore
    const recentUsers = usersQuery.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((user: any) => user.createdAt && user.createdAt.toDate() > sevenDaysAgo)
      .slice(0, 10);
    
    return {
      totalUsers,
      totalCourses,
      totalRevenue,
      recentUsers
    };
  } catch (error) {
    console.error('Error getting admin dashboard stats:', error);
    throw error;
  }
};

// Export db and other functions
export { auth, db };
