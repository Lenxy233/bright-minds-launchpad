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
        const { data: purchase, error } = await supabase
          .from('user_purchases')
          .select('id, status')
          .eq('email', user.email)
          .eq('status', 'completed')
          .maybeSingle();

        setHasValidPurchase(!error && !!purchase);
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
