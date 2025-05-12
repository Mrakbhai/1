import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./hooks/use-theme";
import { AuthProvider } from "./hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import HomePage from "./pages/home";
import ExplorePage from "./pages/explore";
import CourseDetailsPage from "./pages/course-details";
import CheckoutPage from "./pages/checkout";
import DashboardPage from "./pages/dashboard";
import ProfilePage from "./pages/profile";
import AdminPage from "./pages/admin";
import NotFound from "./pages/not-found";
import CoursePreviewPage from "./pages/course-preview";
import AuthPage from "./pages/auth-page";
import PricingPage from "./pages/pricing";
import TestimonialsPage from "./pages/testimonials";
import SupportPage from "./pages/support";
import ContactPage from "./pages/contact";
import SettingsPage from "./pages/settings";
import { useEffect } from "react";

function Router() {
  const [location] = useLocation();
  
  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Hide navbar and footer on admin page
  const isAdminPage = location.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/explore" component={ExplorePage} />
          <Route path="/courses/:slug" component={CourseDetailsPage} />
          <Route path="/preview/:slug" component={CoursePreviewPage} />
          <Route path="/checkout/:courseId" component={CheckoutPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/pricing" component={PricingPage} />
          <Route path="/testimonials" component={TestimonialsPage} />
          <Route path="/support" component={SupportPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/admin/:path*" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
