import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useMobile } from '@/hooks/use-mobile';

interface Instructor {
  name: string;
  title: string;
  photo: string;
}

interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  instructor: Instructor;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  badge?: string;
}

const courseCategories = [
  { id: 'all', name: 'All Courses' },
  { id: 'money-making', name: 'Money Making' },
  { id: 'business', name: 'Business' },
  { id: 'investing', name: 'Investing' },
  { id: 'ai-mastery', name: 'AI Mastery' },
];

export function FeaturedCourses() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');
  const isMobile = useMobile();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses', activeCategory],
    queryFn: async () => {
      const endpoint = activeCategory !== 'all' 
        ? `/api/courses?category=${activeCategory}` 
        : '/api/courses';
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const formatPrice = (price: number) => {
    // Price is stored in cents, convert to rupees
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  return (
    <section id="courses" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-inter mb-4 text-foreground">Premium Courses</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Expert-crafted courses designed to transform your skills into tangible financial success
          </p>
        </div>
        
        {/* Course category tabs */}
        <div className="flex flex-wrap justify-center mb-12">
          {courseCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'ghost'}
              className={`m-1 ${
                activeCategory === category.id ? 'bg-primary-gradient text-white' : ''
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        {/* Course cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 rounded-t-lg bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-4 w-1/3 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="h-12 bg-muted rounded mb-4"></div>
                  <div className="h-10 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course: any) => (
              <Card 
                key={course.id} 
                className="overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 object-cover" 
                  />
                  {course.badge && (
                    <Badge className="absolute top-4 left-4 bg-accent text-white" variant="secondary">
                      {course.badge}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="bg-primary-light/10 text-primary-light">
                      {course.category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-foreground">4.9</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-inter mb-2 text-foreground">{course.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center mb-4">
                    <img 
                      src={course.instructorPhoto} 
                      alt={course.instructorName} 
                      className="w-10 h-10 rounded-full mr-3 object-cover" 
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{course.instructorName}</p>
                      <p className="text-xs text-muted-foreground">{course.instructorTitle}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 px-6 pb-6 flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold text-foreground">{formatPrice(course.price)}</p>
                    <p className="text-xs line-through text-muted-foreground">
                      {formatPrice(course.originalPrice)}
                    </p>
                  </div>
                  <Button 
                    variant="default" 
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => setLocation(`/courses/${course.slug}`)}
                  >
                    Preview Course
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/explore">
              View All Courses
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
