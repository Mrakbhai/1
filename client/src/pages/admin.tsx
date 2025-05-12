import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { Helmet } from 'react-helmet';
import {
  BarChart,
  User,
  BookOpen,
  Settings,
  FilePlus,
  MoreVertical,
  ChevronUp,
  Users,
  CreditCard,
  LineChart,
  ArrowUpRight,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';

// Import admin components
import { DashboardOverview } from '@/components/admin/dashboard-overview';
import { CourseManagement } from '@/components/admin/course-management';

// Mock data for visualizations
const revenueData = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 53000 },
  { month: 'Mar', revenue: 58000 },
  { month: 'Apr', revenue: 48000 },
  { month: 'May', revenue: 62000 },
  { month: 'Jun', revenue: 68000 },
];

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user, userProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect if not an admin
  useEffect(() => {
    if (!loading && (!user || (!userProfile?.isAdmin && user?.email !== 'tornadokkmm@gmail.com'))) {
      setLocation('/');
    }
  }, [user, userProfile, loading, setLocation]);

  // Fetch all courses
  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch all users
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['/api/users'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch all payments
  const { data: payments, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['/api/payments'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show loading state or redirect if not admin
  if (loading || (!userProfile?.isAdmin && user?.email !== 'tornadokkmm@gmail.com')) {
    return (
      <div className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 py-12">
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

  const filteredCourses = courses?.filter(
    (course: any) => course.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredUsers = users?.filter(
    (user: any) => user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Wiser Material</title>
        <meta name="description" content="Wiser Material admin dashboard for managing courses, users, and analytics" />
      </Helmet>

      <div className="flex min-h-screen">
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200 ease-in-out"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <div className={`w-64 bg-primary-dark text-white fixed md:relative top-0 bottom-0 z-50 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-4 flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          <nav className="mt-6">
            <div className="px-4 mb-2 text-sm text-gray-400 uppercase">Main</div>
            <Button 
              variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
              className="w-full justify-start rounded-none"
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'courses' ? 'secondary' : 'ghost'} 
              className="w-full justify-start rounded-none"
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Courses
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'secondary' : 'ghost'} 
              className="w-full justify-start rounded-none"
              onClick={() => setActiveTab('users')}
            >
              <User className="h-5 w-5 mr-2" />
              Users
            </Button>
            <Button 
              variant={activeTab === 'sales' ? 'secondary' : 'ghost'} 
              className="w-full justify-start rounded-none"
              onClick={() => setActiveTab('sales')}
            >
              <LineChart className="h-5 w-5 mr-2" />
              Sales
            </Button>

            <div className="px-4 mt-6 mb-2 text-sm text-gray-400 uppercase">Settings</div>
            <Button 
              variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
              className="w-full justify-start rounded-none"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-secondary">
          {/* Top header */}
          <header className="bg-background border-b border-border py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="md:hidden cursor-pointer" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <BookOpen className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold hidden md:block">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'courses' && 'Courses Management'}
                {activeTab === 'users' && 'Users Management'}
                {activeTab === 'sales' && 'Sales Analytics'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/')}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <div className="relative w-64">
                  <Input 
                    placeholder="Search..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                  <svg
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('courses')}
                >
                  <FilePlus className="h-4 w-4 mr-2" />
                  New Course
                </Button>
              </div>
            </div>
          </header>

          {/* Content area */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsContent value="dashboard" className="space-y-6">
                <DashboardOverview />
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">
                <CourseManagement />
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Users Management</CardTitle>
                      <CardDescription>Manage and update user accounts</CardDescription>
                    </div>
                    <Button>
                      <FilePlus className="h-4 w-4 mr-2" />
                      Add New User
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isUsersLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                          <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Courses</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Admin</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                              {filteredUsers?.map((user: any) => (
                                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                  <td className="p-4 align-middle">{user.id}</td>
                                  <td className="p-4 align-middle">
                                    <div className="flex items-center gap-3">
                                      <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center">
                                        {user.fullName.charAt(0)}
                                      </div>
                                      <span className="font-medium">{user.fullName}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 align-middle">{user.email}</td>
                                  <td className="p-4 align-middle">
                                    <Badge variant="outline">
                                      {user.courses || 0}
                                    </Badge>
                                  </td>
                                  <td className="p-4 align-middle">
                                    {user.isAdmin ? <Check className="h-5 w-5 text-success" /> : <X className="h-5 w-5 text-muted-foreground" />}
                                  </td>
                                  <td className="p-4 align-middle">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>View</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sales" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Analytics</CardTitle>
                    <CardDescription>View detailed sales and revenue reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center">
                            <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                            <h3 className="text-2xl font-bold">₹3,24,500</h3>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center">
                            <p className="text-sm text-muted-foreground mb-1">Orders</p>
                            <h3 className="text-2xl font-bold">248</h3>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center">
                            <p className="text-sm text-muted-foreground mb-1">Avg. Order Value</p>
                            <h3 className="text-2xl font-bold">₹1,308</h3>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="h-80 flex items-center justify-center mb-6">
                      <div className="text-center text-muted-foreground">
                        <BarChart className="h-12 w-12 mx-auto mb-2" />
                        <p>Sales chart visualization would appear here</p>
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                          <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Course</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                          </thead>
                          <tbody className="[&_tr:last-child]:border-0">
                            {[...Array(5)].map((_, i) => (
                              <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <td className="p-4 align-middle">#{100000 + i}</td>
                                <td className="p-4 align-middle">Customer Name</td>
                                <td className="p-4 align-middle">Investing Mastery</td>
                                <td className="p-4 align-middle">₹7,999</td>
                                <td className="p-4 align-middle">Jul 8, 2023</td>
                                <td className="p-4 align-middle">
                                  <Badge className="bg-success text-white">Completed</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Manage global platform settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">General Settings</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Platform Name</label>
                            <Input defaultValue="Wiser Material" className="mt-1" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Support Email</label>
                            <Input defaultValue="support@wisermaterial.com" className="mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Tabs defaultValue="payment">
                      <TabsList>
                        <TabsTrigger value="payment">Payment Settings</TabsTrigger>
                        <TabsTrigger value="email">Email Settings</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance Settings</TabsTrigger>
                      </TabsList>
                      <TabsContent value="payment" className="mt-4 space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Payment Gateway</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Razorpay Key ID</label>
                              <Input defaultValue="rzp_test_yourkeyhere" className="mt-1" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Razorpay Key Secret</label>
                              <Input defaultValue="••••••••••••••••" type="password" className="mt-1" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Currency Settings</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Default Currency</label>
                              <Input defaultValue="INR" className="mt-1" />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="email" className="mt-4">
                        Email settings here...
                      </TabsContent>
                      <TabsContent value="appearance" className="mt-4">
                        Appearance settings here...
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
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