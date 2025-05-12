import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { useAuth } from '../../hooks/use-auth';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { loginMutation, googleSignIn, facebookSignIn } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    loginMutation.mutate(data, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      onError: (error: any) => {
        // The detailed error handling is already in the useAuth hook
        // This is just a fallback in case something is missed
        setAuthError(error.message || "An error occurred during login");
      }
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      await googleSignIn();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      // Only show error if it's not a user-cancelled popup
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || "Google sign-in failed");
      }
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setAuthError(null);
      await facebookSignIn();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      // Only show error if it's not a user-cancelled popup
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || "Facebook sign-in failed");
      }
    }
  };

  return (
    <div className="space-y-4 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your@email.com" 
                    {...field} 
                    disabled={loginMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Button 
                    variant="link" 
                    className="text-xs p-0 h-auto text-accent"
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    disabled={loginMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Dialog open={!!authError} onOpenChange={() => setAuthError(null)}>
            <DialogContent className="sm:max-w-[425px] animate-in fade-in-0 zoom-in-95">
              <DialogHeader>
                <DialogTitle className="text-destructive">Login Error</DialogTitle>
                <DialogDescription>
                  Invalid email or password. Please check your credentials and try again.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setAuthError(null)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            type="submit" 
            className="w-full bg-primary-gradient"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="w-full bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
          onClick={handleGoogleSignIn}
          disabled={loginMutation.isPending}
        >
          <FaGoogle className="mr-2 h-4 w-4 text-[#4285F4]" />
          Google
        </Button>
        <Button 
          variant="outline" 
          className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2]"
          onClick={handleFacebookSignIn}
          disabled={loginMutation.isPending}
        >
          <FaFacebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  );
}
