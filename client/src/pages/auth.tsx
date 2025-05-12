import { useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { LoginForm } from '../components/auth/login-form';
import { SignupForm } from '../components/auth/signup-form';
import { Button } from '../components/ui/button';
// We'll use the mock functions in useAuth hook instead of direct Firebase references
import { useAuth } from '../hooks/use-auth';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { toast } = useToast();
  const { user } = useAuth();
  
  // If already logged in, redirect to dashboard
  if (user) {
    setLocation('/dashboard');
    return null;
  }

  const { googleSignIn, facebookSignIn } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      toast({
        title: "Success!",
        description: "You've successfully signed in with Google.",
      });
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "There was a problem signing in with Google.",
      });
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn();
      toast({
        title: "Success!",
        description: "You've successfully signed in with Facebook.",
      });
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "There was a problem signing in with Facebook.",
      });
    }
  };

  const handleSuccess = () => {
    setLocation('/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>{activeTab === 'login' ? 'Login' : 'Sign Up'} | Wiser Material</title>
        <meta 
          name="description" 
          content={activeTab === 'login' 
            ? 'Login to your Wiser Material account to access premium courses and track your learning progress.' 
            : 'Create your Wiser Material account to start your learning journey with premium money-making skills courses.'}
        />
      </Helmet>

      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => setLocation('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <Card className="w-full shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {activeTab === 'login' ? 'Welcome Back!' : 'Create an Account'}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === 'login' 
                  ? 'Sign in to continue your learning journey' 
                  : 'Join Wiser Material and unlock premium content'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue={activeTab} 
                onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onSuccess={handleSuccess} />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm onSuccess={handleSuccess} />
                </TabsContent>
              </Tabs>


            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                {activeTab === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <span 
                      className="cursor-pointer underline text-primary-light"
                      onClick={() => {
                        setActiveTab('signup');
                        const tabElement = document.querySelector('[data-state="inactive"][data-value="signup"]') as HTMLElement;
                        if (tabElement) tabElement.click();
                      }}
                    >
                      Sign up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <span 
                      className="cursor-pointer underline text-primary-light"
                      onClick={() => {
                        setActiveTab('login');
                        const tabElement = document.querySelector('[data-state="inactive"][data-value="login"]') as HTMLElement;
                        if (tabElement) tabElement.click();
                      }}
                    >
                      Log in
                    </span>
                  </>
                )}
              </div>
              <Button 
                variant="link" 
                className="text-muted-foreground"
                onClick={() => setLocation('/explore')}
              >
                Explore courses without signing in
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}