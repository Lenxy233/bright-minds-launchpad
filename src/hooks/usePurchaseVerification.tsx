import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePurchaseVerification = () => {
  const { user } = useAuth();
  const [hasValidPurchase, setHasValidPurchase] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPurchase = async () => {
      if (!user?.email) {
        setHasValidPurchase(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-purchase', {
          body: { email: user.email },
        });

        if (error) {
          console.error('Error verifying purchase via function:', error);
          setHasValidPurchase(false);
        } else {
          setHasValidPurchase(!!data?.hasValidPurchase);
        }
      } catch (error) {
        console.error('Error checking purchase:', error);
        setHasValidPurchase(false);
      } finally {
        setLoading(false);
      }
    };

    checkPurchase();
  }, [user]);

  return { hasValidPurchase, loading };
};
