import { Card, CardContent } from '@/components/ui/card';
import { 
  UserCheck,
  Coins,
  Clock,
  Users,
  Share2,
  Tablet
} from 'lucide-react';

const features = [
  {
    icon: <UserCheck className="text-xl text-accent" />,
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with proven track records and real-world success.'
  },
  {
    icon: <Coins className="text-xl text-primary" />,
    title: 'Money-Back Guarantee',
    description: '30-day money-back guarantee if you\'re not completely satisfied with your course.'
  },
  {
    icon: <Clock className="text-xl text-success" />,
    title: 'Lifetime Access',
    description: 'Pay once and access your courses and updates forever, including all future material.'
  },
  {
    icon: <Users className="text-xl text-foreground" />,
    title: 'Community Support',
    description: 'Join our active community of learners for networking, support, and collaboration.'
  },
  {
    icon: <Share2 className="text-xl text-accent" />,
    title: 'Smart Referral System',
    description: 'Earn commissions by referring friends with unique course-specific referral codes.'
  },
  {
    icon: <Tablet className="text-xl text-primary" />,
    title: 'Multi-Device Learning',
    description: 'Access your courses on any device with our responsive platform optimized for all screens.'
  }
];

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-inter mb-4 text-foreground">Why Choose Wiser Material?</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">Our platform is designed to provide the most effective learning experience</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-accent/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-inter mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
