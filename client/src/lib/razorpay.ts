import { apiRequest } from "./queryClient";

// Interface for Razorpay options
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

// Interface for creating order
interface CreateOrderParams {
  courseId: number;
  userId: number;
}

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create order
export const createOrder = async ({ courseId, userId }: CreateOrderParams) => {
  try {
    const response = await apiRequest("POST", "/api/payments/create-order", {
      courseId,
      userId,
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Initialize payment
export const initializePayment = (
  options: RazorpayOptions,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  const razorpayInstance = new (window as any).Razorpay(options);

  razorpayInstance.on("payment.success", onSuccess);
  razorpayInstance.on("payment.error", onError);

  razorpayInstance.open();
};

// Verify payment
export const verifyPayment = async (paymentData: {
  paymentId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}) => {
  try {
    const response = await apiRequest("POST", "/api/payments/verify", paymentData);
    return await response.json();
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};
