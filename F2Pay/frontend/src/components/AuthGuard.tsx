
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to access this page",
        variant: "destructive",
      });
      
      // Store the location they were trying to go to
      navigate("/login", {
        state: { from: location.pathname }
      });
    }
  }, [isAuthenticated, loading, navigate, location, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/30"></div>
          <div className="space-y-2">
            <div className="h-4 w-36 bg-primary/30 rounded"></div>
            <div className="h-4 w-24 bg-primary/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
