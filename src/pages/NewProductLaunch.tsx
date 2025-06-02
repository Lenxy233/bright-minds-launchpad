import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const NewProductLaunch = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);

  const handleBundleChange = (bundleValue: string, checked: boolean) => {
    if (checked) {
      setSelectedBundles([...selectedBundles, bundleValue]);
    } else {
      setSelectedBundles(selectedBundles.filter(bundle => bundle !== bundleValue));
    }
  };

  const bundleOptions = [
    { value: "kids-curriculum", label: "Kids Curriculum Bundle", price: 19.99, url: "https://buy.stripe.com/eVqdR9a7H3kb2sk8H5gMw08" },
    { value: "video-bundle", label: "Video Bundle", price: 19.99, url: "https://buy.stripe.com/7sY5kDfs1dYP1og0azgMw09" },
    { value: "animation-video", label: "Animation Video Bundle", price: 19.99, url: "https://buy.stripe.com/dRmeVd0x7f2Td6Y1eDgMw0a" }
  ];

  const calculateTotal = () => {
    return selectedBundles.reduce((total, bundleValue) => {
      const bundle = bundleOptions.find(option => option.value === bundleValue);
      return total + (bundle?.price || 0);
    }, 0);
  };

  const getSelectedBundleDetails = () => {
    return selectedBundles.map(bundleValue => 
      bundleOptions.find(option => option.value === bundleValue)
    ).filter(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { firstName, lastName, email, selectedBundles, total: calculateTotal() });
    
    // For now, we'll open all payment pages since we don't have a combined checkout
    // In a real implementation, you'd create a single checkout session with multiple line items
    selectedBundles.forEach(bundle => {
      const bundleOption = bundleOptions.find(option => option.value === bundle);
      if (bundleOption) {
        window.open(bundleOption.url, "_blank");
      }
    });
  };

  const totalAmount = calculateTotal();
  const selectedBundleDetails = getSelectedBundleDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-green-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              New Product Launch
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Upgrade your creative library with additional content and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="personal" className="text-lg py-3">Personal Info</TabsTrigger>
                  <TabsTrigger value="request" className="text-lg py-3">Select Bundles</TabsTrigger>
                  <TabsTrigger value="summary" className="text-lg py-3">Order Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-lg font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="h-12 text-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-lg font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        className="h-12 text-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="h-12 text-lg"
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="request" className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Choose Your Bundles (Select one or more)</Label>
                    <div className="space-y-4">
                      {bundleOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Checkbox
                            id={option.value}
                            checked={selectedBundles.includes(option.value)}
                            onCheckedChange={(checked) => handleBundleChange(option.value, checked as boolean)}
                          />
                          <div className="flex-1">
                            <label htmlFor={option.value} className="text-lg font-medium cursor-pointer">
                              {option.label} - ${option.price}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                    <h3 className="text-xl font-bold text-purple-800 mb-4">Bundle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-purple-700">Kids Curriculum Bundle</h4>
                        <p className="text-gray-600 mt-2">Educational activities and lesson plans</p>
                        <p className="font-bold text-purple-600 mt-2">$19.99</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-purple-700">Video Bundle</h4>
                        <p className="text-gray-600 mt-2">Video tutorials and training content</p>
                        <p className="font-bold text-purple-600 mt-2">$19.99</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-purple-700">Animation Video Bundle</h4>
                        <p className="text-gray-600 mt-2">Animated videos for content creation</p>
                        <p className="font-bold text-purple-600 mt-2">$19.99</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                    <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                      <ShoppingCart className="w-6 h-6" />
                      Order Summary
                    </h3>
                    
                    {selectedBundleDetails.length === 0 ? (
                      <p className="text-gray-600">No bundles selected. Please go back and select your desired bundles.</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-semibold text-purple-700 mb-3">Selected Items:</h4>
                          <div className="space-y-2">
                            {selectedBundleDetails.map((bundle) => (
                              <div key={bundle?.value} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                <span className="text-gray-700">{bundle?.label}</span>
                                <span className="font-semibold text-purple-600">${bundle?.price}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t-2 border-purple-200">
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-purple-800">Total:</span>
                              <span className="text-2xl font-bold text-purple-600">${totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-semibold text-purple-700 mb-2">Customer Information:</h4>
                          <div className="text-gray-700 space-y-1">
                            <p><span className="font-medium">Name:</span> {firstName} {lastName}</p>
                            <p><span className="font-medium">Email:</span> {email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <div className="mt-8 flex justify-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    disabled={selectedBundles.length === 0}
                  >
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Complete Order - ${totalAmount.toFixed(2)}
                  </Button>
                </div>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewProductLaunch;
