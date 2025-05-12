import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';

const pricingPlans = [
  {
    name: "Monthly",
    price: "₹999",
    description: "Perfect for short-term learning",
    features: [
      "Access to all basic courses",
      "Community support",
      "Basic downloads",
      "30-day money-back guarantee"
    ],
    cta: "Start Monthly",
    popular: false,
    link: "/explore"
  },
  {
    name: "Annual",
    price: "₹7,999",
    priceDetail: "₹666/mo",
    description: "Our most popular plan",
    features: [
      "Access to all courses",
      "Priority support",
      "Unlimited downloads",
      "Exclusive webinars",
      "Certificate of completion",
      "30-day money-back guarantee"
    ],
    cta: "Start Annual",
    popular: true,
    link: "/explore"
  },
  {
    name: "Lifetime",
    price: "₹24,999",
    description: "Best value for serious learners",
    features: [
      "Lifetime access to all courses",
      "VIP support",
      "Unlimited downloads",
      "Exclusive webinars",
      "Certificate of completion",
      "1-on-1 coaching session",
      "Access to future courses",
      "30-day money-back guarantee"
    ],
    cta: "Get Lifetime",
    popular: false,
    link: "/explore"
  }
];

export default function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Pricing | Wiser Material</title>
        <meta 
          name="description" 
          content="Choose the perfect plan for your learning journey. Flexible pricing options for individuals and businesses." 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your learning journey. Start with a 7-day free trial.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col h-full ${plan.popular ? 'border-primary shadow-lg relative' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader className={`pb-8 ${plan.popular ? 'pt-8' : ''}`}>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.priceDetail && (
                    <span className="text-muted-foreground ml-2 text-sm">{plan.priceDetail}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  asChild
                  className={`w-full ${plan.popular ? 'bg-primary' : ''}`} 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href={plan.link}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Can I switch plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remaining time on your current plan.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, debit cards, UPI, and net banking. All payments are processed securely through Razorpay.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Is there a money-back guarantee?</h3>
              <p className="text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee for all of our plans. If you're not satisfied, simply contact our support team.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Do I get access to all courses?</h3>
              <p className="text-muted-foreground">
                The Annual and Lifetime plans include access to our complete course library. The Monthly plan includes most courses with a few premium exclusions.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-20 bg-secondary rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a custom enterprise plan?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We offer special pricing for teams and organizations. Get in touch with us to discuss your requirements.
          </p>
          <Button size="lg" variant="default" className="bg-primary mx-auto">
            Contact for Enterprise
          </Button>
        </div>
      </div>
    </>
  );
}