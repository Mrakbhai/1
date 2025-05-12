import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/10 to-primary-light/10 z-0"></div>
      
      {/* Abstract background patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary-light/5 rounded-tr-full"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-inter leading-tight mb-6 text-foreground">
              Turn Knowledge Into
              <span className="bg-clip-text text-transparent bg-primary-gradient"> Financial Success</span>
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Master money-making skills, business strategies, investing techniques, and productivity hacks from industry experts.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-primary-gradient hover:opacity-90 shadow-lg shadow-primary-light/20">
                <Link href="/explore">
                  Explore Courses
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  const quizSection = document.getElementById('quiz');
                  if (quizSection) {
                    quizSection.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                  }
                }}
              >
                Take Course Quiz
              </Button>
            </div>
            
            <div className="mt-8 flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                  alt="Student testimonial" 
                  className="w-10 h-10 rounded-full border-2 border-white" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                  alt="Student testimonial" 
                  className="w-10 h-10 rounded-full border-2 border-white" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                  alt="Student testimonial" 
                  className="w-10 h-10 rounded-full border-2 border-white" 
                />
              </div>
              <div>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 font-semibold text-foreground">4.9/5</span>
                </div>
                <p className="text-sm text-muted-foreground">From over 12,000+ happy students</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Student learning financial concepts" 
              className="rounded-2xl shadow-2xl" 
            />
            
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-background rounded-xl p-4 shadow-lg">
                <div className="text-accent text-2xl font-bold">4</div>
                <div className="text-sm text-muted-foreground">Premium Courses</div>
              </div>
              <div className="bg-background rounded-xl p-4 shadow-lg">
                <div className="text-accent text-2xl font-bold">100+</div>
                <div className="text-sm text-muted-foreground">Video Lessons</div>
              </div>
              <div className="bg-background rounded-xl p-4 shadow-lg">
                <div className="text-accent text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
