import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useReferrals() {
  const { toast } = useToast();

  // Get all referrals for the current user
  const { 
    data: referrals, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/referrals'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/referrals');
        return await response.json();
      } catch (error) {
        // Handle unauthorized or other errors
        return [];
      }
    }
  });

  // Generate a new referral
  const generateReferralMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await apiRequest('POST', '/api/referrals', { courseId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/referrals'] });
      toast({
        title: 'Success',
        description: 'Referral code generated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate referral code',
        variant: 'destructive',
      });
    }
  });

  // Validate a referral code
  const validateReferralMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest('GET', `/api/referrals/${code}/validate`);
      return await res.json();
    },
    onError: (error: Error) => {
      toast({
        title: 'Invalid Referral',
        description: error.message || 'Invalid referral code',
        variant: 'destructive',
      });
    }
  });

  // Apply a referral code
  const applyReferralMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest('POST', `/api/referrals/${code}/apply`);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: data.message || 'Referral applied successfully',
      });
      // Invalidate user courses to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to apply referral code',
        variant: 'destructive',
      });
    }
  });

  return {
    referrals,
    isLoading,
    error,
    refetchReferrals: refetch,
    generateReferralMutation,
    validateReferralMutation,
    applyReferralMutation
  };
}