import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BrandingSettings {
  id?: string;
  platform_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  custom_domain: string | null;
  tagline: string | null;
  contact_email: string | null;
  social_links: any;
}

export const useBrandingSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setSettings(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('branding_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setSettings(data);
      } catch (error) {
        console.error('Error fetching branding settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  return { settings, loading };
};
