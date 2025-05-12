import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Define the form schema
const courseFormSchema = z.object({
  slug: z.string().min(3, {
    message: 'Slug must be at least 3 characters long',
  }).regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  }),
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters long',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters long',
  }),
  category: z.string().min(1, {
    message: 'Please select a category',
  }),
  instructorName: z.string().min(2, {
    message: 'Instructor name must be at least 2 characters long',
  }),
  instructorTitle: z.string().min(2, {
    message: 'Instructor title must be at least 2 characters long',
  }),
  instructorPhoto: z.string().url({
    message: 'Please enter a valid URL for instructor photo',
  }).optional().or(z.literal('')),
  price: z.string().regex(/^\d+$/, {
    message: 'Price must be a valid number',
  }),
  originalPrice: z.string().regex(/^\d+$/, {
    message: 'Original price must be a valid number',
  }),
  duration: z.string().min(2, {
    message: 'Duration must be at least 2 characters long',
  }),
  lessons: z.string().regex(/^\d+$/, {
    message: 'Lessons must be a valid number',
  }),
  level: z.string().min(1, {
    message: 'Please select a level',
  }),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  image: z.string().url({
    message: 'Please enter a valid URL for course image',
  }),
  badge: z.string().optional(),
});

// Define categories and levels
const categories = [
  'Web Development',
  'Frontend Development',
  'Backend Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'AI Mastery',
  'Investing',
  'Business',
  'Money Making',
  'Productivity',
];

const levels = [
  'beginner',
  'intermediate',
  'advanced',
];

const badges = [
  'BESTSELLER',
  'POPULAR',
  'NEW',
];

interface CourseFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CourseForm({ initialData, onSuccess, onCancel }: CourseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize form with either initial data or defaults
  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: initialData.price.toString(),
      originalPrice: initialData.originalPrice.toString(),
      lessons: initialData.lessons.toString(),
    } : {
      slug: '',
      title: '',
      description: '',
      category: '',
      instructorName: '',
      instructorTitle: '',
      instructorPhoto: '',
      price: '9900',
      originalPrice: '12900',
      duration: '8 weeks',
      lessons: '10',
      level: 'beginner',
      isFeatured: false,
      isPublished: false,
      image: '',
      badge: '',
    },
  });

  // Create/Update course mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof courseFormSchema>) => {
      // Transform string price and lessons to numbers
      const transformedData = {
        ...data,
        price: parseInt(data.price),
        originalPrice: parseInt(data.originalPrice),
        lessons: parseInt(data.lessons),
      };

      // Call the correct API endpoint based on whether we're creating or updating
      const endpoint = initialData 
        ? `/api/courses/${initialData.id}` 
        : '/api/courses';

      const method = initialData ? 'PATCH' : 'POST';

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(transformedData),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to save course');
        }

        return data;
      } catch (error) {
        console.error('Course creation error:', error);
        throw new Error('Failed to save course: ' + (error.message || 'Unknown error'));
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Course updated" : "Course created",
        description: initialData 
          ? "Your course has been successfully updated" 
          : "Your new course has been created",
      });

      // Invalidate relevant queries to trigger refetching
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} course: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(data: z.infer<typeof courseFormSchema>) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Complete Web Development Bootcamp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. web-development-bootcamp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your course in detail" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (in cents)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 9900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (in cents)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 12900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 8 weeks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lessons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Lessons</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 42" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge (optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select badge (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {badges.map((badge) => (
                        <SelectItem key={badge} value={badge}>
                          {badge}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="font-medium">Instructor Information</h3>

              <FormField
                control={form.control}
                name="instructorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructorTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Web Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructorPhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor Photo URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/photo.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Featured Course</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Published</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              initialData ? 'Update Course' : 'Create Course'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}