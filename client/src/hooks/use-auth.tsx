import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signInWithFacebook, 
  logOut, 
  onAuthChange, 
  createOrUpdateUserProfile, 
  getUserFromFirestore,
  updateUserDisplayName
} from '../lib/firebase';
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useToast } from '@/hooks/use-toast';

// Login/Register data types
type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  fullName: string;
};

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  googleSignIn: () => Promise<User | void>;
  facebookSignIn: () => Promise<User | void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Auth state listener effect
  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      
      // When user changes, invalidate any cached profile data
      if (authUser) {
        queryClient.invalidateQueries({ queryKey: ['userProfile', authUser.uid] });
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch user profile using TanStack Query
  const { 
    data: userProfile, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      return await getUserFromFirestore(user.uid);
    },
    enabled: !!user, // Only run query when user is logged in
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // Special case for admin user
      if (credentials.email === 'tornadokkmm@gmail.com' && credentials.password === 'admin@123') {
        // Create admin user object
        const adminUser = {
          uid: 'admin-special-uid',
          email: 'tornadokkmm@gmail.com',
          displayName: 'Admin User',
          role: 'admin',
          isAdmin: true,
          emailVerified: true
        } as unknown as User;
        
        // Set the user directly since we're bypassing Firebase Auth
        setUser(adminUser);
        
        // Store admin user profile in query cache
        queryClient.setQueryData(['userProfile', adminUser.uid], {
          id: 0,
          uid: 'admin-special-uid',
          email: 'tornadokkmm@gmail.com',
          fullName: 'Admin User',
          role: 'admin',
          isAdmin: true
        });
        
        toast({
          title: "Admin Access",
          description: "You have signed in as administrator",
        });
        
        return adminUser;
      }
      
      // Regular Firebase authentication
      return await signInWithEmail(credentials.email, credentials.password);
    },
    onSuccess: (user) => {
      if (user.uid !== 'admin-special-uid') {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      }
    },
    onError: (error: any) => {
      let message = "Login failed. Please try again.";
      
      // Handle Firebase Auth error codes
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed login attempts. Please try again later.";
      } else if (error.code === 'auth/user-disabled') {
        message = "Your account has been disabled. Please contact support.";
      }
      
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    }
  });
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      // Create user with Firebase Auth
      const user = await signUpWithEmail(data.email, data.password);
      
      // Update the display name
      await updateUserDisplayName(data.fullName);
      
      // Create or update profile in Firestore
      await createOrUpdateUserProfile(user);
      
      return user;
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
    },
    onError: (error: any) => {
      let message = "Registration failed. Please try again.";
      
      // Handle Firebase Auth error codes
      if (error.code === 'auth/email-already-in-use') {
        message = "This email is already in use. Please use a different email or sign in.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password is too weak. Please use a stronger password.";
      }
      
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
    }
  });
  
  // Google Sign-in function
  const googleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      });
      return user;
    } catch (error: any) {
      // Don't show error toast for user-cancelled sign-in
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
          title: "Google sign-in failed",
          description: error.message || "An error occurred during sign in",
          variant: "destructive",
        });
      }
      throw error;
    }
  };
  
  // Facebook Sign-in function
  const facebookSignIn = async () => {
    try {
      const user = await signInWithFacebook();
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Facebook.",
      });
      return user;
    } catch (error: any) {
      // Don't show error toast for user-cancelled sign-in
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
          title: "Facebook sign-in failed",
          description: error.message || "An error occurred during sign in",
          variant: "destructive",
        });
      }
      throw error;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await logOut();
      // Immediately clear the user and user profile state
      setUser(null);
      // Clear any cached user data
      queryClient.removeQueries({ queryKey: ['userProfile'] });
      // Force invalidate all queries to ensure UI updates correctly
      queryClient.invalidateQueries();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to home page after logout
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Provide all values to the context
  const contextValue = {
    user,
    userProfile,
    isLoading,
    error,
    loginMutation,
    registerMutation,
    googleSignIn,
    facebookSignIn,
    logout
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// We need to use a named function to prevent Fast Refresh warnings
export interface OnboardingState {
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  newUserId: string | null;
  setNewUserId: (id: string | null) => void;
}

export function useAuth() {
  const context = useContext(AuthContext);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newUserId, setNewUserId] = useState<string | null>(null);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
    onboarding: {
      showOnboarding,
      setShowOnboarding,
      newUserId,
      setNewUserId
    }
  };
}