import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  location: string;
  text: string;
  image: string;
  course: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    title: 'Engineering Student',
    location: 'Delhi',
    text: 'The Student Money Making course was a game-changer for me. I was able to earn ₹25,000 in my first month while still maintaining my grades. The step-by-step guidance made implementation so easy!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    course: 'Student Money Making Course',
    rating: 5
  },
  {
    id: 2,
    name: 'Rahul Gupta',
    title: 'Entrepreneur',
    location: 'Mumbai',
    text: 'After completing the Business Starter course, I launched my e-commerce store that now generates ₹3 lakhs monthly. The frameworks and templates saved me months of trial and error.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    course: 'Business Starter Course',
    rating: 5
  },
  {
    id: 3,
    name: 'Anjali Mehta',
    title: 'Marketing Professional',
    location: 'Bangalore',
    text: 'The Investing Mastery course taught me how to build a diversified portfolio that\'s already up 32% in the past year. The strategies for market analysis have been invaluable.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    course: 'Investing Mastery Course',
    rating: 5
  }
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: activeIndex * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-inter mb-4 text-foreground">Success Stories</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">Hear from students who transformed their lives through our courses</p>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" 
            ref={sliderRef}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="min-w-full px-4 snap-center">
                <Card className="shadow-lg border-border">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="rounded-xl w-full h-auto object-cover" 
                        />
                      </div>
                      <div className="md:w-2/3">
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-xl font-medium mb-6 italic text-foreground">
                          "{testimonial.text}"
                        </blockquote>
                        <div>
                          <p className="font-bold text-lg mb-1 text-foreground">{testimonial.name}</p>
                          <p className="text-muted-foreground">{testimonial.title}, {testimonial.location}</p>
                          <p className="mt-4 text-accent font-medium">{testimonial.course}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={cn(
                  "w-3 h-3 p-0 rounded-full",
                  activeIndex === index 
                    ? "bg-accent" 
                    : "bg-muted hover:bg-muted-foreground/50"
                )}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
