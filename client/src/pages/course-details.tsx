import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Helmet } from 'react-helmet';
import { useAuth } from '../hooks/use-auth';
import { Star, Play, FileText, Clock, Users, Award, ChevronRight } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { loadRazorpayScript } from '../lib/razorpay';

export default function CourseDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { user, userProfile } = useAuth();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script on component mount
  useEffect(() => {
    async function loadRazorpay() {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
    }
    loadRazorpay();
  }, []);

  const { data: course, isLoading } = useQuery({
    queryKey: [`/api/courses/${slug}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: courseContent, isLoading: isContentLoading } = useQuery({
    queryKey: [`/api/courses/${course?.id}/content`],
    enabled: !!course?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Check if the user has already purchased this course
  const { data: userCourses, isLoading: isUserCoursesLoading } = useQuery({
    queryKey: ['/api/users/:userId/courses', userProfile?.id],
    enabled: !!userProfile?.id,
  });

  const hasPurchased = userCourses?.some((uc: any) => uc.course.id === course?.id);

  const handlePurchase = () => {
    if (!user) {
      // If user is not logged in, redirect to login
      const authModal = document.getElementById('auth-modal');
      if (authModal) {
        (authModal as any).showModal();
      }
      return;
    }

    if (course) {
      setLocation(`/checkout/${course.id}`);
    }
  };

  const handleStartLearning = () => {
    setLocation(`/dashboard?course=${course.id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-72 w-full mb-6" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-2/3 mb-4" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
        <p className="mb-8">The course you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => setLocation('/explore')}>
          Browse Courses
        </Button>
      </div>
    );
  }

  // Format course data
  const formattedPrice = formatPrice(course.price);
  const formattedOriginalPrice = formatPrice(course.originalPrice);

  return (
    <>
      <Helmet>
        <title>{`${course.title} | Wiser Material`}</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="flex space-x-2 mb-4">
                  <Badge className="bg-primary-light/10 text-primary-light">
                    {course.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  {course.badge && (
                    <Badge className="bg-accent text-white">
                      {course.badge}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                
                <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">4.9</span>
                    <span className="text-muted-foreground ml-1">(280 reviews)</span>
                  </div>
                  <div className="text-muted-foreground">
                    {course.lessons} lessons
                  </div>
                  <div className="text-muted-foreground">
                    {course.level}
                  </div>
                </div>
                
                <div className="flex items-center mb-8">
                  <img 
                    src={course.instructorPhoto} 
                    alt={course.instructorName} 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <div className="font-medium">{course.instructorName}</div>
                    <div className="text-sm text-muted-foreground">{course.instructorTitle}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-background rounded-xl shadow-lg overflow-hidden border border-border">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-3xl font-bold">{formattedPrice}</div>
                        <div className="text-muted-foreground line-through text-sm">{formattedOriginalPrice}</div>
                      </div>
                      <Badge className="bg-success text-white">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                    
                    {hasPurchased ? (
                      <Button className="w-full mb-4 bg-primary-gradient" onClick={handleStartLearning}>
                        Start Learning
                      </Button>
                    ) : (
                      <>
                        <Button className="w-full mb-4 bg-primary-gradient" onClick={handlePurchase}>
                          Enroll Now
                        </Button>
                        <Button 
                          className="w-full mb-4" 
                          variant="outline" 
                          onClick={() => setLocation(`/preview/${slug}`)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch Preview
                        </Button>
                      </>
                    )}
                    
                    <div className="text-sm text-center text-muted-foreground mb-6">
                      30-day money-back guarantee
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3 text-accent" />
                        <span>Full lifetime access</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-accent" />
                        <span>{course.lessons} lessons (approx. {course.duration})</span>
                      </div>
                      <div className="flex items-center">
                        <Play className="h-5 w-5 mr-3 text-accent" />
                        <span>Watch on all devices</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3 text-accent" />
                        <span>Community access</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-3 text-accent" />
                        <span>Certificate of completion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="curriculum">
            <TabsList className="mb-8">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curriculum">
              <div className="bg-background rounded-lg border border-border">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-muted-foreground">
                      {course.lessons} lessons • {course.duration} total
                    </div>
                    <Button variant="link">Expand All</Button>
                  </div>
                  
                  {isContentLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="border border-border rounded-lg p-4">
                          <Skeleton className="h-6 w-1/3 mb-3" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : courseContent && courseContent.length > 0 ? (
                    <div className="space-y-4">
                      {courseContent.map((section: any, index: number) => (
                        <div key={index} className="border border-border rounded-lg overflow-hidden">
                          <div className="p-4 bg-secondary flex justify-between items-center">
                            <h3 className="font-medium">{section.title}</h3>
                            <ChevronRight className="h-5 w-5" />
                          </div>
                          <div className="p-4 space-y-2 hidden">
                            {/* This would be the expandable content */}
                            <div className="flex items-center p-2 hover:bg-secondary/50 rounded">
                              <Play className="h-4 w-4 mr-3" />
                              <span>Lesson title here</span>
                              <span className="text-muted-foreground text-sm ml-auto">12:34</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Course content will be available soon.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="instructor">
              <div className="bg-background rounded-lg border border-border p-6">
                <div className="flex items-start space-x-6 mb-6">
                  <img 
                    src={course.instructorPhoto} 
                    alt={course.instructorName} 
                    className="w-24 h-24 rounded-full" 
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{course.instructorName}</h2>
                    <p className="text-muted-foreground mb-4">{course.instructorTitle}</p>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">4.9</span>
                        <span className="text-muted-foreground ml-1">Instructor Rating</span>
                      </div>
                      <div className="text-muted-foreground">
                        12 Courses
                      </div>
                      <div className="text-muted-foreground">
                        5,234 Students
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis nisl. Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis nisl.
                </p>
                
                <p>
                  Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis nisl. Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis nisl.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="bg-background rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
                
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/3 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold mb-2">4.9</div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-muted-foreground">Course Rating</div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="space-y-4">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <div className="w-12 text-muted-foreground">{rating} stars</div>
                          <div className="flex-1 mx-4">
                            <div className="h-2 bg-muted rounded-full">
                              <div 
                                className="h-2 bg-yellow-400 rounded-full" 
                                style={{ width: rating === 5 ? '75%' : rating === 4 ? '20%' : '5%' }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-12 text-right text-muted-foreground">
                            {rating === 5 ? '75%' : rating === 4 ? '20%' : '5%'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-t border-border pt-6">
                      <div className="flex items-start mb-4">
                        <img 
                          src={`https://i.pravatar.cc/150?img=${i+10}`} 
                          alt="Student" 
                          className="w-12 h-12 rounded-full mr-4" 
                        />
                        <div>
                          <div className="font-medium">Student Name</div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-muted-foreground text-sm ml-2">1 month ago</span>
                          </div>
                        </div>
                      </div>
                      <p>
                        This course exceeded my expectations! The instructor explains complex concepts in a simple, easy-to-understand manner. I've already started implementing what I've learned.
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">Load More Reviews</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faq">
              <div className="bg-background rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Do I need any prior knowledge to take this course?</h3>
                    <p className="text-muted-foreground">
                      No, this course is designed for beginners and assumes no prior knowledge. We'll guide you step-by-step through everything you need to know.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">How long do I have access to the course?</h3>
                    <p className="text-muted-foreground">
                      You have lifetime access to the course content, including all future updates and additions to the curriculum.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Is there a money-back guarantee?</h3>
                    <p className="text-muted-foreground">
                      Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the course, you can request a full refund within 30 days of purchase.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Do you offer a certificate of completion?</h3>
                    <p className="text-muted-foreground">
                      Yes, upon completing the course, you'll receive a certificate that you can add to your portfolio or share on your social media profiles.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Can I access the course on mobile devices?</h3>
                    <p className="text-muted-foreground">
                      Yes, the course is fully responsive and can be accessed on any device, including smartphones and tablets.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
