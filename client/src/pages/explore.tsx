import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Star, Filter, Search, ArrowRight } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { Helmet } from 'react-helmet';
import { QuizModal } from '../components/shared/quiz-modal';

// Define course type for TypeScript
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
  originalPrice?: number;
  image: string;
  rating: number;
  badge?: string;
  featured?: boolean;
  createdAt: string;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [recommendedCourseSlug, setRecommendedCourseSlug] = useState<string | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);

  // Get the recommended course slug from localStorage if available
  useEffect(() => {
    const savedRecommendation = localStorage.getItem('recommendedCourse');
    if (savedRecommendation) {
      setRecommendedCourseSlug(savedRecommendation);
    }
  }, []);

  // Fetch all courses
  const { data: coursesData = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses', selectedCategory],
    queryFn: async () => {
      const endpoint = selectedCategory !== 'all'
        ? `/api/courses?category=${selectedCategory}`
        : '/api/courses';
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Cast the data to our Course type
  const courses = coursesData as Course[];

  // Find the recommended course
  const recommendedCourse = recommendedCourseSlug 
    ? courses.find(course => course.slug === recommendedCourseSlug) 
    : null;

  // Filter courses based on search query and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort courses based on selected sort option
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    // If there's a recommended course, sort it to the top
    if (recommendedCourseSlug) {
      if (a.slug === recommendedCourseSlug) return -1;
      if (b.slug === recommendedCourseSlug) return 1;
    }
    
    if (selectedSort === 'priceAsc') return a.price - b.price;
    if (selectedSort === 'priceDesc') return b.price - a.price;
    if (selectedSort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default: featured
    return a.featured ? -1 : 1;
  });

  // Get unique categories from courses
  const uniqueCategories = Array.from(new Set(courses.map(course => course.category)));
  const categories = ['all', ...uniqueCategories];

  return (
    <>
      <Helmet>
        <title>Explore Courses | Wiser Material</title>
        <meta 
          name="description" 
          content="Browse our premium collection of money-making skills, business strategies, investing techniques, and productivity courses." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Explore Courses</h1>
              <p className="text-muted-foreground mt-2">
                Discover premium courses to boost your financial success
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-9 w-full sm:w-[200px] md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                  <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-sm p-5 sticky top-20">
                <div className="flex items-center mb-4">
                  <Filter className="h-5 w-5 mr-2" />
                  <h2 className="font-semibold">Categories</h2>
                </div>
                
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      className="w-full justify-start font-normal"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="rounded-lg bg-secondary p-4">
                  <h3 className="font-medium mb-2">Not sure which course to take?</h3>
                  <p className="text-sm text-muted-foreground mb-3">Take our quick quiz to find the perfect match for your goals.</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setQuizModalOpen(true)}
                  >
                    Take Course Quiz
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Course grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="w-full animate-pulse">
                      <div className="aspect-video bg-muted rounded-t-lg"></div>
                      <CardHeader>
                        <div className="h-6 bg-muted rounded-full w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded-full w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-muted rounded-full w-full mb-2"></div>
                        <div className="h-4 bg-muted rounded-full w-5/6"></div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="h-6 bg-muted rounded-full w-1/4"></div>
                        <div className="h-9 bg-muted rounded-full w-1/3"></div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : sortedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCourses.map((course: any) => (
                    <Card 
                      key={course.id} 
                      className={`course-card overflow-hidden transition-all ${
                        course.slug === recommendedCourseSlug 
                          ? 'ring-2 ring-accent shadow-lg' 
                          : ''
                      }`}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="object-cover w-full h-full"
                        />
                        {course.badge && (
                          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                            {course.badge}
                          </Badge>
                        )}
                        {course.slug === recommendedCourseSlug && (
                          <Badge className="absolute top-3 left-3 bg-success text-white">
                            Recommended for You
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {course.category}
                            </Badge>
                            <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground">
                              {course.instructor && course.instructor.photo ? (
                                <img 
                                  src={course.instructor.photo} 
                                  alt={course.instructor.name} 
                                  className="w-5 h-5 rounded-full mr-2"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-muted mr-2"></div>
                              )}
                              <span>{course.instructor ? course.instructor.name : 'Instructor'}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm line-clamp-2 text-muted-foreground">{course.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(course.rating) 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-muted stroke-muted-foreground fill-none"}`} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-muted-foreground">({Math.floor(Math.random() * 100) + 50})</span>
                        </div>
                        <div>
                          {course.originalPrice && course.originalPrice > course.price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground line-through text-sm">
                                {formatPrice(course.originalPrice)}
                              </span>
                              <span className="font-bold text-lg">
                                {formatPrice(course.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-lg">
                              {formatPrice(course.price)}
                            </span>
                          )}
                        </div>
                      </CardFooter>
                      <div className="px-6 pb-6 pt-0">
                        <Button asChild className="w-full">
                          <Link href={`/courses/${course.slug}`}>
                            View Course <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-muted inline-block p-3 rounded-full mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No courses found</h3>
                  <p className="text-muted-foreground mt-1 mb-4">Try adjusting your search or filter criteria</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedSort('featured');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quiz Modal */}
      <QuizModal 
        isOpen={quizModalOpen} 
        onClose={() => setQuizModalOpen(false)} 
      />
    </>
  );
}