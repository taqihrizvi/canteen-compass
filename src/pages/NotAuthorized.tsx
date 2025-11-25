import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const NotAuthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Access Denied</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
