import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  User,
  BookOpen,
  Users,
  CreditCard,
  LineChart,
  ArrowUpRight,
  ChevronUp,
} from 'lucide-react';

// Placeholder component for dashboard stats
export function DashboardOverview() {
  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ['/api/courses'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch payments - This would normally come from your backend
  const { data: payments = [] } = useQuery({
    queryKey: ['/api/payments'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Calculate metrics (these would normally come from your backend)
  const totalRevenue = payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0);
  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalRevenue / 100); // Convert cents to rupees
  
  // Count published courses
  const publishedCourses = courses.filter((course: any) => course.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">{formattedRevenue}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-success">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">12% </span>
              <span className="text-sm text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <h3 className="text-2xl font-bold mt-1">{payments.length}</h3>
              </div>
              <div className="bg-accent/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-success">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">8% </span>
              <span className="text-sm text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <h3 className="text-2xl font-bold mt-1">{courses.length}</h3>
              </div>
              <div className="bg-success/10 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-muted-foreground">
              <span className="text-sm">{publishedCourses} published</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <h3 className="text-2xl font-bold mt-1">
                  {courses.length ? Math.round((payments.length / courses.length) * 100) / 100 : 0}%
                </h3>
              </div>
              <div className="bg-primary-light/10 p-2 rounded-full">
                <ArrowUpRight className="h-5 w-5 text-primary-light" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-success">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">1.5% </span>
              <span className="text-sm text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-12 w-12 mx-auto mb-2" />
                <p>Revenue chart would appear here</p>
                <p className="text-sm mt-2">Integration with chart library required</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Course Enrollments</CardTitle>
            <CardDescription>Student enrollments by course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-12 w-12 mx-auto mb-2" />
                <p>Enrollment chart would appear here</p>
                <p className="text-sm mt-2">Integration with chart library required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest enrollments and course updates</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="space-y-6">
              {payments.slice(0, 5).map((payment: any, i: number) => (
                <div key={payment.id || i} className="flex gap-4">
                  <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      New student enrolled in{' '}
                      <span className="text-primary">
                        {courses.find((c: any) => c.id === payment.courseId)?.title || 'a course'}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No recent activities found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}