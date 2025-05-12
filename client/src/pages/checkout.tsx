import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/use-auth';
import { loadRazorpayScript, createOrder, verifyPayment } from '../lib/razorpay';
import { formatPrice } from '../lib/utils';
import { Helmet } from 'react-helmet';
import { Lock, CreditCard, Check } from 'lucide-react';

export default function CheckoutPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [, setLocation] = useLocation();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !userProfile) {
      setLocation('/');
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to continue with checkout",
      });
    }
  }, [user, userProfile, setLocation, toast]);

  // Load Razorpay script
  useEffect(() => {
    async function loadRazorpay() {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
      if (!loaded) {
        toast({
          variant: "destructive",
          title: "Payment Gateway Error",
          description: "Failed to load payment gateway. Please try again later.",
        });
      }
    }
    loadRazorpay();
  }, [toast]);

  // Fetch course details
  const { data: course, isLoading } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle payment
  const handlePayment = async () => {
    if (!razorpayLoaded || !course || !userProfile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Payment gateway not available or missing information",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderData = await createOrder({
        courseId: course.id,
        userId: userProfile.id,
      });

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "Wiser Material",
        description: `Payment for ${course.title}`,
        image: "https://your-logo-url.png", // Add your logo URL
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verificationData = {
              paymentId: orderData.paymentId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };
            
            const result = await verifyPayment(verificationData);
            
            if (result.success) {
              toast({
                title: "Payment Successful",
                description: "You have successfully enrolled in the course",
              });
              
              // Redirect to course
              setLocation(`/dashboard?course=${course.id}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Payment Verification Failed",
              description: "There was an issue verifying your payment",
            });
          }
        },
        prefill: {
          name: userProfile.fullName,
          email: userProfile.email,
          contact: "",
        },
        theme: {
          color: "#00C4B4",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: response.error.description,
        });
      });
      
      razorpay.open();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: "There was an error processing your payment. Please try again.",
      });
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-64 w-full mb-6" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
        <p className="mb-8">The course you're trying to purchase doesn't exist or has been removed.</p>
        <Button onClick={() => setLocation('/explore')}>
          Browse Courses
        </Button>
      </div>
    );
  }

  const formattedPrice = formatPrice(course.price);
  const formattedOriginalPrice = formatPrice(course.originalPrice);
  const discount = course.originalPrice - course.price;
  const formattedDiscount = formatPrice(discount);

  return (
    <>
      <Helmet>
        <title>Checkout | Wiser Material</title>
        <meta name="description" content={`Complete your purchase for ${course.title}`} />
      </Helmet>

      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Lock className="text-accent mr-2" />
              <h1 className="text-2xl font-bold">Secure Checkout</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    
                    <div className="flex mb-6">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-24 h-24 object-cover rounded-lg mr-4" 
                      />
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {course.lessons} lessons • {course.duration} total
                        </p>
                        <div className="flex items-center">
                          <span className="font-bold">{formattedPrice}</span>
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formattedOriginalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="referral">Referral Code (Optional)</Label>
                        <div className="flex mt-1">
                          <Input 
                            id="referral" 
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                            placeholder="Enter referral code"
                            className="rounded-r-none"
                          />
                          <Button variant="outline" className="rounded-l-none">
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formattedOriginalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="text-success">-{formattedDiscount}</span>
                      </div>
                      {referralCode && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Referral Discount</span>
                          <span className="text-success">-₹0</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2">
                        <span>Total</span>
                        <span>{formattedPrice}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Payment</h2>
                    
                    <div className="flex items-center mb-6">
                      <CreditCard className="text-accent mr-2" />
                      <span>Secure Payment via Razorpay</span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center">
                        <Check className="text-success mr-2 h-5 w-5" />
                        <span>Full Lifetime Access</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="text-success mr-2 h-5 w-5" />
                        <span>30-Day Money Back Guarantee</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="text-success mr-2 h-5 w-5" />
                        <span>Access on All Devices</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="text-success mr-2 h-5 w-5" />
                        <span>Certificate of Completion</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full bg-primary-gradient"
                      onClick={handlePayment}
                      disabled={isProcessing || !razorpayLoaded}
                    >
                      {isProcessing ? 'Processing...' : `Pay ${formattedPrice}`}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
