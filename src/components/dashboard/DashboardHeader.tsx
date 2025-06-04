
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  firstName: string | null;
  onSignOut: () => void;
}

const DashboardHeader = ({ firstName, onSignOut }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome, {firstName || 'Member'}!
        </h1>
        <p className="text-gray-600 mt-2">Your Bright Minds Academy Dashboard</p>
      </div>
      <Button onClick={onSignOut} variant="outline" className="flex items-center gap-2">
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default DashboardHeader;
