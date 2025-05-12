import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/use-auth';
import { 
  Star, 
  Play, 
  FileText, 
  Clock, 
  Users, 
  Award, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Demo preview videos - to be replaced with actual course preview content
const PREVIEW_VIDEOS = [
  {
    id: 1,
    title: "Introduction to the Course",
    description: "A brief overview of what you'll learn in this course and how it will help you achieve your financial goals.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder - replace with actual video
    duration: "5:24"
  },
  {
    id: 2,
    title: "Core Concepts Explained",
    description: "Understanding the fundamental principles that drive success in this field.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder - replace with actual video
    duration: "7:18"
  }
];

export default function CoursePreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeVideo, setActiveVideo] = useState(PREVIEW_VIDEOS[0]);

  const { data: course, isLoading } = useQuery({
    queryKey: [`/api/courses/${slug}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleBackToCourse = () => {
    setLocation(`/courses/${slug}`);
  };

  const handleEnroll = () => {
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 gap-8">
            <Skeleton className="h-[500px] w-full mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
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
  const formattedOriginalPrice = course.originalPrice ? formatPrice(course.originalPrice) : '';

  return (
    <>
      <Helmet>
        <title>{`Preview: ${course.title} | Wiser Material`}</title>
        <meta name="description" content={`Preview the ${course.title} course and learn ${course.description}`} />
      </Helmet>

      <div className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="mb-6" 
              onClick={handleBackToCourse}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
            
            <div className="flex space-x-2 mb-4">
              <Badge className="bg-primary-light/10 text-primary-light">
                {course.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <Badge className="bg-accent text-white">
                Preview
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">
                  {typeof course.rating === 'number' ? course.rating.toFixed(1) : '4.9'}
                </span>
                <span className="text-muted-foreground ml-1">(280 reviews)</span>
              </div>
              <div className="text-muted-foreground">
                {course.lessons || 24} lessons
              </div>
              <div className="text-muted-foreground">
                {course.level || 'Intermediate'}
              </div>
            </div>
            
            <div className="flex items-center mb-8">
              <img 
                src={course.instructor?.photo || 'https://ui-avatars.com/api/?name=Instructor'} 
                alt={course.instructor?.name || 'Instructor'} 
                className="w-12 h-12 rounded-full mr-4" 
              />
              <div>
                <div className="font-medium">{course.instructor?.name || 'Expert Instructor'}</div>
                <div className="text-sm text-muted-foreground">{course.instructor?.title || 'Financial Expert'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content area with video player */}
            <div className="lg:col-span-2">
              <div className="bg-background rounded-xl border border-border overflow-hidden mb-8">
                <div className="aspect-video">
                  <iframe 
                    src={activeVideo.videoUrl}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{activeVideo.title}</h2>
                  <p className="text-muted-foreground">{activeVideo.description}</p>
                </div>
              </div>
              
              <div className="bg-background rounded-xl border border-border overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Available Preview Lessons</h2>
                  <div className="space-y-4">
                    {PREVIEW_VIDEOS.map((video) => (
                      <div 
                        key={video.id} 
                        className={`flex items-start p-4 rounded-lg cursor-pointer hover:bg-secondary ${
                          activeVideo.id === video.id ? 'bg-secondary' : ''
                        }`}
                        onClick={() => setActiveVideo(video)}
                      >
                        <div className="h-10 w-10 flex-shrink-0 bg-primary-light/10 rounded-full flex items-center justify-center mr-4">
                          <Play className="h-5 w-5 text-primary-light" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{video.title}</h3>
                          <p className="text-sm text-muted-foreground">{video.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">{video.duration}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-background rounded-xl border border-border overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Build a strong foundation in financial literacy",
                      "Learn practical money-making strategies",
                      "Understand investment fundamentals",
                      "Create passive income streams",
                      "Develop effective budgeting techniques",
                      "Master risk management and asset protection",
                      "Network with like-minded entrepreneurs",
                      "Apply proven business models"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5 mr-3">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"/>
                          </svg>
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar content */}
            <div>
              <div className="bg-background rounded-xl shadow-lg overflow-hidden border border-border sticky top-20">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-3xl font-bold">{formattedPrice}</div>
                      {formattedOriginalPrice && (
                        <div className="text-muted-foreground line-through text-sm">{formattedOriginalPrice}</div>
                      )}
                    </div>
                    {course.originalPrice && (
                      <Badge className="bg-success text-white">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <Button className="w-full mb-4 bg-primary-gradient" onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                  
                  <div className="text-sm text-center text-muted-foreground mb-6">
                    <span className="font-semibold">This is a preview</span> - Enroll to access all content
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-accent" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-accent" />
                      <span>{course.lessons || 24} lessons (approx. {course.duration || '8 hours'})</span>
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
    </>
  );
}