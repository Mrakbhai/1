import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  HeadphonesIcon,
  ShieldCheckIcon,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-primary-gradient rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/5 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold font-inter text-white mb-4">Transform Your Future Today</h2>
              <p className="text-white/80 text-lg mb-8">Join thousands of successful students who have changed their lives with our premium courses.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <HeadphonesIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <ShieldCheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">Guaranteed Results</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <RefreshCw className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">30-Day Refund</span>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-primary-dark">
                <Link href="/explore">
                  Get Started Now
                </Link>
              </Button>
            </div>
            <div className="md:w-2/5 relative">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644" 
                alt="Student success" 
                className="h-full w-full object-cover" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-dark/80 to-transparent h-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
