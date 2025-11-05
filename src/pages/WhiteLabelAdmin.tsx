import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePurchaseVerification } from "@/hooks/usePurchaseVerification";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Palette, Upload } from "lucide-react";

const WhiteLabelAdmin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasValidPurchase, loading: purchaseLoading } = usePurchaseVerification();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    platform_name: "Bright Minds Academy",
    logo_url: "",
    primary_color: "#9b87f5",
    secondary_color: "#7E69AB",
    custom_domain: "",
    tagline: "",
    contact_email: "",
    enable_reselling: false,
    reseller_stripe_publishable_key: "",
    reseller_stripe_secret_key: "",
    reseller_bundle_price: 3900,
    reseller_currency: "usd",
    reseller_support_email: "",
  });

  useEffect(() => {
    if (!purchaseLoading && !hasValidPurchase) {
      toast.error("You need to purchase the BMA Bundle to access white-label settings");
      navigate("/");
      return;
    }

    if (user) {
      fetchSettings();
    }
  }, [user, hasValidPurchase, purchaseLoading, navigate]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("branding_settings")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setSettings({
          platform_name: data.platform_name,
          logo_url: data.logo_url || "",
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          custom_domain: data.custom_domain || "",
          tagline: data.tagline || "",
          contact_email: data.contact_email || "",
          enable_reselling: data.enable_reselling || false,
          reseller_stripe_publishable_key: data.reseller_stripe_publishable_key || "",
          reseller_stripe_secret_key: data.reseller_stripe_secret_key || "",
          reseller_bundle_price: data.reseller_bundle_price || 3900,
          reseller_currency: data.reseller_currency || "usd",
          reseller_support_email: data.reseller_support_email || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("branding_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      const payload = {
        user_id: user.id,
        platform_name: settings.platform_name,
        logo_url: settings.logo_url || null,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        custom_domain: settings.custom_domain || null,
        tagline: settings.tagline || null,
        contact_email: settings.contact_email || null,
        enable_reselling: settings.enable_reselling,
        reseller_stripe_publishable_key: settings.reseller_stripe_publishable_key || null,
        reseller_stripe_secret_key: settings.reseller_stripe_secret_key || null,
        reseller_bundle_price: settings.reseller_bundle_price,
        reseller_currency: settings.reseller_currency,
        reseller_support_email: settings.reseller_support_email || null,
      };

      if (existing) {
        const { error } = await supabase
          .from("branding_settings")
          .update(payload)
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("branding_settings")
          .insert([payload]);

        if (error) throw error;
      }

      toast.success("Branding settings saved successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (purchaseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="border-2 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-2xl">White-Label Settings</CardTitle>
            </div>
            <CardDescription>
              Customize your platform's branding and domain settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="branding" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="reseller">Reseller Setup</TabsTrigger>
              </TabsList>

              <TabsContent value="branding" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="platform_name">Platform Name</Label>
                  <Input
                    id="platform_name"
                    value={settings.platform_name}
                    onChange={(e) =>
                      setSettings({ ...settings, platform_name: e.target.value })
                    }
                    placeholder="Your Platform Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) =>
                      setSettings({ ...settings, tagline: e.target.value })
                    }
                    placeholder="Your catchy tagline"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logo_url"
                      value={settings.logo_url}
                      onChange={(e) =>
                        setSettings({ ...settings, logo_url: e.target.value })
                      }
                      placeholder="https://example.com/logo.png"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload your logo to a hosting service and paste the URL here
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) =>
                          setSettings({ ...settings, primary_color: e.target.value })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.primary_color}
                        onChange={(e) =>
                          setSettings({ ...settings, primary_color: e.target.value })
                        }
                        placeholder="#9b87f5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) =>
                          setSettings({ ...settings, secondary_color: e.target.value })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.secondary_color}
                        onChange={(e) =>
                          setSettings({ ...settings, secondary_color: e.target.value })
                        }
                        placeholder="#7E69AB"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_domain">Custom Domain</Label>
                  <Input
                    id="custom_domain"
                    value={settings.custom_domain}
                    onChange={(e) =>
                      setSettings({ ...settings, custom_domain: e.target.value })
                    }
                    placeholder="yourdomain.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll need to configure DNS settings with your domain registrar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) =>
                      setSettings({ ...settings, contact_email: e.target.value })
                    }
                    placeholder="support@yourdomain.com"
                  />
                </div>
              </TabsContent>

              <TabsContent value="reseller" className="space-y-6 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💰 Reseller Mode</h4>
                  <p className="text-sm text-blue-800">
                    Enable reselling to sell access to this platform on your custom domain. 
                    You'll keep 100% of sales revenue using your own Stripe account.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enable_reselling" className="text-base font-semibold">
                      Enable Reselling
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to purchase access through your platform
                    </p>
                  </div>
                  <Switch
                    id="enable_reselling"
                    checked={settings.enable_reselling}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, enable_reselling: checked })
                    }
                  />
                </div>

                {settings.enable_reselling && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reseller_bundle_price">Bundle Price (in cents)</Label>
                      <Input
                        id="reseller_bundle_price"
                        type="number"
                        value={settings.reseller_bundle_price}
                        onChange={(e) =>
                          setSettings({ ...settings, reseller_bundle_price: parseInt(e.target.value) || 0 })
                        }
                        placeholder="3900"
                      />
                      <p className="text-xs text-muted-foreground">
                        ${(settings.reseller_bundle_price / 100).toFixed(2)} {settings.reseller_currency.toUpperCase()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reseller_stripe_publishable_key">Stripe Publishable Key</Label>
                      <Input
                        id="reseller_stripe_publishable_key"
                        value={settings.reseller_stripe_publishable_key}
                        onChange={(e) =>
                          setSettings({ ...settings, reseller_stripe_publishable_key: e.target.value })
                        }
                        placeholder="pk_live_..."
                        type="password"
                      />
                      <p className="text-xs text-muted-foreground">
                        Get this from your Stripe Dashboard → Developers → API Keys
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reseller_stripe_secret_key">Stripe Secret Key</Label>
                      <Input
                        id="reseller_stripe_secret_key"
                        value={settings.reseller_stripe_secret_key}
                        onChange={(e) =>
                          setSettings({ ...settings, reseller_stripe_secret_key: e.target.value })
                        }
                        placeholder="sk_live_..."
                        type="password"
                      />
                      <p className="text-xs text-muted-foreground">
                        ⚠️ Keep this secret! Never share publicly.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reseller_support_email">Support Email</Label>
                      <Input
                        id="reseller_support_email"
                        type="email"
                        value={settings.reseller_support_email}
                        onChange={(e) =>
                          setSettings({ ...settings, reseller_support_email: e.target.value })
                        }
                        placeholder="support@yourdomain.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        Customers will see this email for support inquiries
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">📋 Setup Checklist</h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>✓ Create a Stripe account at stripe.com</li>
                        <li>✓ Complete your business profile in Stripe</li>
                        <li>✓ Copy your API keys from Stripe Dashboard</li>
                        <li>✓ Set your bundle price</li>
                        <li>✓ Configure your custom domain DNS</li>
                        <li>✓ Test a purchase to verify payment flow</li>
                      </ul>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full mt-6"
              size="lg"
            >
              {loading ? "Saving..." : "Save All Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhiteLabelAdmin;
