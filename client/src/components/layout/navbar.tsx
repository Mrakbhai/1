import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '../../hooks/use-theme';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { 
  BookOpen, 
  Sun, 
  Moon, 
  Palette, 
  Menu, 
  X,
  User,
  LogOut,
  Settings,
  BookMarked,
  Crown
} from 'lucide-react';
import { useMobile } from '../../hooks/use-mobile';
import { AuthModal } from '../../components/auth/auth-modal';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [animated, setAnimated] = useState(false);
  const isMobile = useMobile();
  const navRef = useRef<HTMLDivElement>(null);

  // Handle navbar animation and shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add animation class after a short delay
    const animationTimeout = setTimeout(() => {
      setAnimated(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(animationTimeout);
    };
  }, []);

  // Close mobile menu when changing location
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const openLoginModal = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  return (
    <header 
      ref={navRef}
      className={cn(
        "sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300",
        scrolled && "shadow-md",
        animated ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-primary-gradient p-2 rounded-lg mr-2">
                <BookOpen className="text-white text-xl" />
              </div>
              <span className="font-inter font-bold text-xl text-foreground">Wiser Material</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            {[
              { href: "/explore", label: "Explore", delay: 100 },
              { href: "/explore", label: "Find Your Course", delay: 150 },
              { href: "/testimonials", label: "Testimonials", delay: 200 },
              { href: "/pricing", label: "Pricing", delay: 250 },
              { href: "/support", label: "Support", delay: 300 },
              { href: "/contact", label: "Contact Us", delay: 350 },
            ].map((item, index) => (
              <Link 
                key={index}
                href={item.href} 
                className={cn(
                  "font-medium relative hover:text-accent text-foreground transition-all duration-300",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent hover:after:w-full after:transition-all after:duration-300",
                  animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}
                style={{ transitionDelay: animated ? `${item.delay}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth & Theme Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="hidden md:flex items-center border rounded-lg p-1 border-border">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "p-1 rounded-md transition-all duration-200",
                  theme === 'light' 
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent/10 text-foreground"
                )}
                onClick={() => setTheme('light')}
                title="Light Theme"
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "p-1 rounded-md transition-all duration-200",
                  theme === 'dark' 
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent/10 text-foreground"
                )}
                onClick={() => setTheme('dark')}
                title="Dark Theme"
              >
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "p-1 rounded-md transition-all duration-200",
                  theme === 'luxury' 
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent/10 text-foreground"
                )}
                onClick={() => setTheme('luxury')}
                title="Luxury Theme"
              >
                <Crown className="h-4 w-4" />
              </Button>
            </div>

            {/* Login / Sign Up or User Avatar */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                    <Avatar>
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>{userProfile?.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(userProfile?.role === 'admin' || user?.email === 'tornadokkmm@gmail.com') && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <BookMarked className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className={cn(
                "hidden md:flex space-x-3 transition-all duration-300",
                animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: animated ? "300ms" : "0ms" }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/auth')}
                  className="transition-transform hover:scale-105"
                >
                  Log In
                </Button>
                <Button 
                  className="bg-primary-gradient hover:opacity-90 transition-transform hover:scale-105"
                  onClick={() => setLocation('/auth?tab=signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border overflow-hidden">
          <div className="px-4 pt-2 pb-4 space-y-4">
            {[
              { href: "/explore", label: "Explore", delay: 50 },
              { href: "/explore", label: "Find Your Course", delay: 100 },
              { href: "/testimonials", label: "Testimonials", delay: 150 },
              { href: "/pricing", label: "Pricing", delay: 200 },
              { href: "/support", label: "Support", delay: 250 },
              { href: "/contact", label: "Contact", delay: 300 },
            ].map((item, index) => (
              <div 
                key={index} 
                className="animate-slideDown"
                style={{ 
                  animationDelay: `${item.delay}ms`,
                  animationFillMode: "both"
                }}
              >
                <Link 
                  href={item.href} 
                  className="block py-2 font-medium text-foreground hover:text-accent transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </div>
            ))}

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 animate-slideDown" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "p-1 rounded-md transition-all duration-200",
                      theme === 'light' 
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent/10 text-foreground"
                    )}
                    onClick={() => setTheme('light')}
                    title="Light Theme"
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "p-1 rounded-md transition-all duration-200",
                      theme === 'dark' 
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent/10 text-foreground"
                    )}
                    onClick={() => setTheme('dark')}
                    title="Dark Theme"
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "p-1 rounded-md transition-all duration-200",
                      theme === 'luxury' 
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent/10 text-foreground"
                    )}
                    onClick={() => setTheme('luxury')}
                    title="Luxury Theme"
                  >
                    <Crown className="h-4 w-4" />
                  </Button>
                </div>
                {!user && (
                  <div className="flex space-x-2 animate-slideDown" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation('/auth')}
                      className="transition-transform hover:scale-105"
                    >
                      Log In
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-primary-gradient hover:opacity-90 transition-transform hover:scale-105"
                      onClick={() => setLocation('/auth?tab=signup')}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialTab={authModalTab}
      />
    </header>
  );
}