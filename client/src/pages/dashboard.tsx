import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../hooks/use-auth';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Share2,
  BarChart3
} from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user, userProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('my-courses');
  const queryParams = new URLSearchParams(window.location.search);
  const activeCourseId = queryParams.get('course');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  // Fetch user's courses with proper error handling
  const { data: userCourses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['/api/users/:userId/courses', userProfile?.id],
    enabled: !!userProfile?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData: []
  });

  // Handle continue learning
  const handleContinueLearning = (courseId: number) => {
    setLocation(`/dashboard?course=${courseId}`);
  };

  // Find active course
  const activeCourse = activeCourseId && userCourses 
    ? userCourses.find((course: any) => course.courseId === parseInt(activeCourseId)) 
    : null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Learning Platform</title>
        <meta name="description" content="Access your purchased courses and track your learning progress" />
      </Helmet>

      <div className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Welcome, {userProfile?.fullName || 'Learner'}</h1>
            <p className="text-muted-foreground mb-6">
              Track your progress and continue learning
            </p>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="my-courses">My Courses</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
              </TabsList>

              <TabsContent value="my-courses">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    {isCoursesLoading ? (
                      <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-40 w-full" />
                        ))}
                      </div>
                    ) : userCourses && userCourses.length > 0 ? (
                      <div className="space-y-6">
                        {userCourses.map((userCourse: any) => (
                          <Card key={userCourse.id} className={`${activeCourseId && activeCourseId === userCourse.courseId.toString() ? 'border-accent' : ''}`}>
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row">
                                <img 
                                  src={userCourse.course?.image || '/placeholder-course.jpg'} 
                                  alt={userCourse.course?.title || 'Course'} 
                                  className="w-full md:w-32 h-24 object-cover rounded-lg mb-4 md:mb-0 md:mr-6" 
                                />
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                    <h3 className="font-bold text-lg">{userCourse.course?.title || 'Loading...'}</h3>
                                    {userCourse.course?.category && (
                                      <Badge className="md:ml-2 my-1 md:my-0 w-fit" variant="outline">
                                        {userCourse.course.category}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground text-sm mb-4">
                                    {userCourse.course?.lessons || 0} lessons • {userCourse.course?.duration || '0h'} total
                                  </p>
                                  <div className="mb-2">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm">Progress</span>
                                      <span className="text-sm">{userCourse.progress || 0}%</span>
                                    </div>
                                    <Progress value={userCourse.progress || 0} className="h-2" />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Button 
                                      variant="link" 
                                      className="px-0"
                                      onClick={() => {}}
                                    >
                                      <Share2 className="h-4 w-4 mr-1" />
                                      Share
                                    </Button>
                                    <Button 
                                      className="bg-accent hover:bg-accent/90"
                                      onClick={() => handleContinueLearning(userCourse.courseId)}
                                    >
                                      {userCourse.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-xl font-bold mb-2">No courses yet</h3>
                          <p className="text-muted-foreground mb-6">
                            Explore our courses and start your learning journey
                          </p>
                          <Button onClick={() => setLocation('/explore')}>
                            Browse Courses
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <BookOpen className="h-5 w-5 mr-2 text-accent" />
                              <span>Courses Enrolled</span>
                            </div>
                            <span className="font-bold">
                              {userCourses?.length || 0}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 mr-2 text-success" />
                              <span>Completed Courses</span>
                            </div>
                            <span className="font-bold">
                              {userCourses?.filter((uc: any) => uc.progress === 100)?.length || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="certificates">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Certificates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-bold mb-2">No certificates yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Complete a course to earn your certificate
                      </p>
                      <Button onClick={() => setActiveTab('my-courses')}>
                        Go to My Courses
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}