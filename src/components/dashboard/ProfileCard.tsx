
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface ProfileCardProps {
  firstName: string | null;
  lastName: string | null;
  email: string;
  memberSince: string;
}

const ProfileCard = ({ firstName, lastName, email, memberSince }: ProfileCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Name:</strong> {firstName} {lastName}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Member since:</strong> {memberSince}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
