import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Web Developer",
    testimonial: "The courses here are incredibly well-structured. I was able to advance my career from junior to senior developer in just 6 months after completing the web development bootcamp.",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    course: "Web Development",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Brown",
    role: "Data Scientist",
    testimonial: "The instructors are industry experts who provide real-world examples and challenges. The data science course helped me transition into a new career field.",
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
    course: "Data Science",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "UX Designer",
    testimonial: "I've taken many online courses, but the UI/UX design course here stands out. The projects were challenging and the feedback from instructors was invaluable.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    course: "UX/UI Design",
    rating: 4,
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Software Engineer",
    testimonial: "The mobile app development course was comprehensive and up-to-date with the latest technologies. I was able to build and publish my own app within weeks of finishing.",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    course: "Mobile Development",
    rating: 5,
  },
  {
    id: 5,
    name: "Jessica Martinez",
    role: "Digital Marketer",
    testimonial: "The digital marketing course provided practical strategies that I immediately implemented in my work. My campaigns now see 40% better engagement rates.",
    avatar: "https://randomuser.me/api/portraits/women/54.jpg",
    course: "Digital Marketing",
    rating: 4,
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Blockchain Developer",
    testimonial: "As someone who was new to blockchain, I found the course extremely accessible yet comprehensive. Now I'm working on cutting-edge DeFi projects.",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    course: "Blockchain Development",
    rating: 5,
  },
];

const videoTestimonials = [
  {
    id: 1,
    name: "James Thompson",
    role: "Frontend Developer",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8",
    course: "Web Development",
  },
  {
    id: 2,
    name: "Nina Patel",
    role: "Product Manager",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    course: "Product Management",
  },
  {
    id: 3,
    name: "Carlos Mendez",
    role: "AI Engineer",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33",
    course: "Artificial Intelligence",
  },
];

const companies = [
  { id: 1, name: "Amazon", logo: "https://via.placeholder.com/150x80?text=Amazon" },
  { id: 2, name: "Microsoft", logo: "https://via.placeholder.com/150x80?text=Microsoft" },
  { id: 3, name: "Google", logo: "https://via.placeholder.com/150x80?text=Google" },
  { id: 4, name: "Facebook", logo: "https://via.placeholder.com/150x80?text=Facebook" },
  { id: 5, name: "Apple", logo: "https://via.placeholder.com/150x80?text=Apple" },
  { id: 6, name: "Netflix", logo: "https://via.placeholder.com/150x80?text=Netflix" },
];

const Rating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <StarIcon 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

export default function TestimonialsPage() {
  return (
    <>
      <Helmet>
        <title>Student Testimonials - Wiser Material</title>
        <meta name="description" content="Hear what our students have to say about their learning experience with our courses. Read success stories and watch video testimonials." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary-gradient py-20 px-4 text-white">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Our Students' Success Stories</h1>
              <p className="text-lg md:text-xl opacity-90">Hear from the people who have transformed their careers through our courses.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-6 rounded-lg bg-accent/10">
                <p className="text-4xl font-bold text-primary">10k+</p>
                <p className="text-muted-foreground mt-2">Happy Students</p>
              </div>
              <div className="p-6 rounded-lg bg-accent/10">
                <p className="text-4xl font-bold text-primary">95%</p>
                <p className="text-muted-foreground mt-2">Completion Rate</p>
              </div>
              <div className="p-6 rounded-lg bg-accent/10">
                <p className="text-4xl font-bold text-primary">4.8/5</p>
                <p className="text-muted-foreground mt-2">Average Rating</p>
              </div>
              <div className="p-6 rounded-lg bg-accent/10">
                <p className="text-4xl font-bold text-primary">87%</p>
                <p className="text-muted-foreground mt-2">Career Advancement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Tabs */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
              <p className="text-muted-foreground">Real testimonials from students who have taken our courses</p>
            </div>
            
            <Tabs defaultValue="written" className="w-full max-w-5xl mx-auto">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="written">Written Testimonials</TabsTrigger>
                  <TabsTrigger value="video">Video Testimonials</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="written">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4 mb-4">
                          <Avatar className="h-12 w-12 border-2 border-primary">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            <div className="mt-1">
                              <Rating rating={testimonial.rating} />
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground italic mb-4">"{testimonial.testimonial}"</p>
                        <div className="text-sm font-medium text-primary">
                          Course: {testimonial.course}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="video">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {videoTestimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                      <div className="aspect-video bg-muted">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={testimonial.videoUrl} 
                          title={`Video testimonial by ${testimonial.name}`}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <CardContent className="p-4">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-sm mt-2">
                          <span className="text-primary font-medium">Course:</span> {testimonial.course}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Companies Section */}
        <section className="py-16 px-4 bg-accent/10">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Where Our Graduates Work</h2>
              <p className="text-muted-foreground">Our students have been hired by top companies worldwide</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {companies.map((company) => (
                <div key={company.id} className="bg-background rounded-lg p-4 flex items-center justify-center shadow-sm">
                  <img src={company.logo} alt={company.name} className="max-h-12" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Success Stories</h2>
              <p className="text-muted-foreground mb-8">Start your learning journey today and become our next success story</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/explore" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-primary-gradient">
                  Explore Courses
                </a>
                <a href="/" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  Take the Quiz
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}