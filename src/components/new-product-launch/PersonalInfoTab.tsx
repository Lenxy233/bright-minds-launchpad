
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PersonalInfoTabProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

const PersonalInfoTab = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
}: PersonalInfoTabProps) => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-700">You're signed in! Your purchase will be automatically linked to your account.</p>
        <p className="text-sm text-green-600 mt-2">Email: {user.email}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-700">
          <Link to="/auth" className="underline font-medium">Sign in</Link> to automatically track your purchases!
        </p>
      </div>
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
            required={!user}
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
            required={!user}
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
          required={!user}
        />
      </div>
    </>
  );
};

export default PersonalInfoTab;
