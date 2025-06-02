

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const NewProductLaunch = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { firstName, lastName, email, request });
    
    // Redirect to payment based on selected bundle
    if (request === "kids-curriculum") {
      window.open("https://buy.stripe.com/eVqdR9a7H3kb2sk8H5gMw08", "_blank");
    } else if (request === "video-bundle") {
      window.open("https://buy.stripe.com/7sY5kDfs1dYP1og0azgMw09", "_blank");
    } else if (request === "animation-video") {
      window.open("https://buy.stripe.com/dRmeVd0x7f2Td6Y1eDgMw0a", "_blank");
    }
    // Handle form submission here for other bundles
  };

  const bundleOptions = [
    { value: "kids-curriculum", label: "Kids Curriculum Bundle - $19.99" },
    { value: "video-bundle", label: "Video Bundle - $19.99" },
    { value: "animation-video", label: "Animation Video Bundle - $19.99" }
  ];

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
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="personal" className="text-lg py-3">Personal Info</TabsTrigger>
                  <TabsTrigger value="request" className="text-lg py-3">Request Details</TabsTrigger>
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
                  <div className="space-y-2">
                    <Label htmlFor="request" className="text-lg font-medium">Choose Your Bundle</Label>
                    <Select value={request} onValueChange={setRequest} required>
                      <SelectTrigger className="h-12 text-lg">
                        <SelectValue placeholder="Select a bundle option" />
                      </SelectTrigger>
                      <SelectContent>
                        {bundleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-lg py-3">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                <div className="mt-8 flex justify-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="mr-2 w-5 h-5" />
                    Submit Request
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
