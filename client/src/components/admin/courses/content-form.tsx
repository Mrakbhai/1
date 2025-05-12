import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Video, FileText, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the form schema for course content
const contentFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  type: z.enum(["video", "text", "quiz"]),
  content: z.string().min(5, {
    message: "Content must be at least 5 characters long",
  }),
  duration: z.string().optional(),
  order: z.coerce.number().int().min(0),
});

const contentTypes = [
  { id: "video", label: "Video", icon: <Video className="h-4 w-4" /> },
  { id: "text", label: "Text/Article", icon: <FileText className="h-4 w-4" /> },
  { id: "quiz", label: "Quiz", icon: <HelpCircle className="h-4 w-4" /> },
];

interface ContentFormProps {
  courseId: number;
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ContentForm({
  courseId,
  initialData,
  onSuccess,
  onCancel,
  isOpen,
  setIsOpen,
}: ContentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>(
    initialData?.type || "video",
  );

  // Initialize form with either initial data or defaults
  const form = useForm<z.infer<typeof contentFormSchema>>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          duration: initialData.duration?.toString() || "",
        }
      : {
          title: "",
          type: "video",
          content: "",
          duration: "",
          order: 0,
        },
  });

  // Watch for type changes to update the active tab
  const typeValue = form.watch("type");
  if (typeValue !== activeTab) {
    setActiveTab(typeValue);
  }

  // Create/Update content mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof contentFormSchema>) => {
      // Transform to the right format
      const transformedData = {
        ...data,
        courseId,
        duration: data.duration ? parseInt(data.duration) : undefined,
      };

      // Call the correct API endpoint based on whether we're creating or updating
      const endpoint = initialData
        ? `/api/courses/content/${initialData.id}`
        : "/api/courses/content";

      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Content updated" : "Content created",
        description: initialData
          ? "Course content has been successfully updated"
          : "New course content has been created",
      });

      // Invalidate relevant queries to trigger refetching
      queryClient.invalidateQueries({
        queryKey: [`/api/courses/${courseId}/content`],
      });

      // Reset form
      form.reset();

      // Close dialog
      setIsOpen(false);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} content: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(data: z.infer<typeof contentFormSchema>) {
    mutation.mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Content" : "Add New Content"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the details of this content item."
              : "Add a new video, text, or quiz to this course."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Introduction to HTML" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <FormControl>
                    <Tabs
                      value={activeTab}
                      onValueChange={(value) => {
                        setActiveTab(value);
                        field.onChange(value);
                      }}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 mb-4">
                        {contentTypes.map((type) => (
                          <TabsTrigger
                            key={type.id}
                            value={type.id}
                            className="flex items-center gap-2"
                          >
                            {type.icon}
                            {type.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <TabsContent value="video">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Add a YouTube or Vimeo video by pasting the embed
                            code or URL.
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="text">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Create a text-based lesson with rich content.
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="quiz">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Create a quiz to test student knowledge.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {activeTab === "video"
                      ? "Video Embed Code"
                      : activeTab === "text"
                        ? "Lesson Content"
                        : "Quiz Questions"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        activeTab === "video"
                          ? '<iframe src="https://www.youtube.com/embed/..." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                          : activeTab === "text"
                            ? "Enter your lesson content here..."
                            : "Enter quiz questions in JSON format..."
                      }
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {activeTab === "video" && (
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (in seconds)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 600 for a 10-minute video"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g. 1 (lower numbers appear first)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : initialData ? (
                  "Update Content"
                ) : (
                  "Add Content"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    
  );
}
