import React from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet';

const faqItems = [
  {
    question: "How do I access my courses after purchase?",
    answer: "After purchasing a course, log into your account and navigate to the Dashboard. You'll see all your purchased courses there. Click on any course to start learning."
  },
  {
    question: "Can I download course materials for offline use?",
    answer: "Yes, most course materials can be downloaded for offline viewing. Look for the download icon next to video lectures and resources within each course."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for course purchases."
  },
  {
    question: "Do you offer refunds if I'm not satisfied?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with a course, contact our support team within 30 days of purchase for a full refund."
  },
  {
    question: "How long do I have access to a course after purchasing?",
    answer: "Once you purchase a course, you have lifetime access to all its materials, updates, and the community forum associated with it."
  },
  {
    question: "Can I get a certificate after completing a course?",
    answer: "Yes, all our courses offer completion certificates. You need to complete at least 80% of the course content to receive your certificate."
  }
];

export default function SupportPage() {
  return (
    <>
      <Helmet>
        <title>Support - Wiser Material</title>
        <meta name="description" content="Get help with your courses, account, or any other questions. Our support team is here to assist you." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary-gradient py-20 px-4 text-white">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">How Can We Help You?</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">We're here to support your learning journey every step of the way.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Live Chat
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Support
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Support Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Available 24/7 for immediate assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Connect with our support team instantly through live chat for real-time help with your questions.</p>
                  <Button className="w-full bg-primary-gradient">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>Response within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Send us an email with your questions or concerns, and our team will get back to you within 24 hours.</p>
                  <Button className="w-full bg-primary-gradient">Email Us</Button>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>Available Mon-Fri, 9am-5pm EST</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">For complex issues or if you prefer talking to a person, give us a call during business hours.</p>
                  <Button className="w-full bg-primary-gradient">Call Us</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-accent/10">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Find quick answers to common questions</p>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-medium">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-10 text-center">
                <p className="text-muted-foreground mb-4">Still have questions? Reach out to our support team.</p>
                <Button className="bg-primary-gradient">
                  Contact Support
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}