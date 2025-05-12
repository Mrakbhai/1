import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { CourseForm } from '@/components/admin/courses/course-form';
import { ContentForm } from '@/components/admin/courses/content-form';
import { FilePlus, MoreVertical, Edit, Trash2, Plus, Video, FileText, ArrowRight } from 'lucide-react';

export function CourseManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showContentForm, setShowContentForm] = useState(false);

  // Fetch all courses
  const { data: courses = [], isLoading: isCoursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch course content when a course is selected
  const { data: courseContent = [], isLoading: isContentLoading } = useQuery({
    queryKey: ['/api/courses/content', selectedCourse?.id],
    queryFn: async () => {
      if (!selectedCourse) return [];
      const response = await fetch(`/api/courses/${selectedCourse.id}/content`);
      if (!response.ok) {
        throw new Error('Failed to fetch course content');
      }
      return response.json();
    },
    enabled: !!selectedCourse,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Course deleted",
        description: "The course has been successfully deleted",
      });

      // Invalidate relevant queries to trigger refetching
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });

      // Reset selected course if it was the one deleted
      if (selectedCourse) {
        setSelectedCourse(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete course: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      const response = await fetch(`/api/courses/content/${contentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Content deleted",
        description: "The content item has been successfully deleted",
      });

      // Invalidate relevant queries to trigger refetching
      if (selectedCourse) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/courses/content', selectedCourse.id] 
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete content: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form close
  const handleCourseFormClose = () => {
    setEditingCourse(null);
    setShowCourseForm(false);
  };

  // Handle course edit
  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  // Handle course delete with confirmation
  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course? This cannot be undone.')) {
      deleteCourseMutation.mutate(courseId);
    }
  };

  // Handle content delete with confirmation
  const handleDeleteContent = (contentId: number) => {
    if (window.confirm('Are you sure you want to delete this content item? This cannot be undone.')) {
      deleteContentMutation.mutate(contentId);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price / 100); // Convert cents to rupees
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course: any) => course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateCourse = async (id: number, data: any) => {
    try {
      await updateCourse.mutateAsync({ id, ...data });
      setShowEditForm(false);
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
    } catch (error: any) {
      console.error("Course update error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update course",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>Add, edit, and manage your courses</CardDescription>
          </div>
          <Button onClick={() => {
            setEditingCourse(null);
            setShowCourseForm(true);
          }}>
            <FilePlus className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isCoursesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course: any) => (
                <Card key={course.id} className="overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="h-40 w-full object-cover" 
                  />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-wrap gap-2">
                        {course.badge && (
                          <Badge variant="secondary">{course.badge}</Badge>
                        )}
                        {course.isFeatured && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            Featured
                          </Badge>
                        )}
                        {!course.isPublished && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCourse(course);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Manage Content
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditCourse(course)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">{formatPrice(course.price)}</p>
                        {course.originalPrice > course.price && (
                          <p className="text-xs line-through text-muted-foreground">
                            {formatPrice(course.originalPrice)}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCourse(course)}
                      >
                        Manage
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md bg-muted/10">
              <FilePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first course
              </p>
              <Button onClick={() => {
                setEditingCourse(null);
                setShowCourseForm(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Course
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course content management dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Management</DialogTitle>
            <DialogDescription>Manage content for {selectedCourse?.title}</DialogDescription>
          </DialogHeader>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Content for: {selectedCourse?.title || 'Loading...'}</CardTitle>
              <CardDescription>Manage the content for this course</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                Back to Courses
              </Button>
              <Button onClick={() => setShowContentForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isContentLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : courseContent.length > 0 ? (
              <div className="space-y-4">
                {courseContent
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((content: any) => (
                    <div 
                      key={content.id} 
                      className="flex items-center justify-between border p-4 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-dark/10 p-2 rounded-full">
                          {content.type === 'video' ? (
                            <Video className="h-5 w-5 text-primary" />
                          ) : content.type === 'text' ? (
                            <FileText className="h-5 w-5 text-accent" />
                          ) : (
                            <FileText className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{content.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                            {content.duration ? ` • ${Math.floor(content.duration / 60)} min` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            // Edit content functionality
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteContent(content.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md bg-muted/10">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding videos, text lessons, or quizzes
                </p>
                <Button onClick={() => setShowContentForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course Content
                </Button>
              </div>
            )}
          </CardContent>
        </DialogContent>
      </Dialog>

      {/* Course Form Dialog */}
      <Dialog open={showCourseForm} onOpenChange={(open) => !open && handleCourseFormClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
          </DialogHeader>
          <CourseForm
            initialData={editingCourse}
            onSuccess={() => {
              handleCourseFormClose();
            }}
            onCancel={handleCourseFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Content Form Dialog */}
      {selectedCourse?.id && (
        <ContentForm
          courseId={selectedCourse.id}
          isOpen={showContentForm}
          setIsOpen={setShowContentForm}
          onSuccess={() => {
            setShowContentForm(false);
          }}
        />
      )}
    </div>
  );
}