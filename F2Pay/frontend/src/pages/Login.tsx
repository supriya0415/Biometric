
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, auth, db, getFaceData, verifyFaceData } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Fingerprint, Lock, Mail, ScanFace } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, query, where, getDocs } from "firebase/firestore";
import FaceRecognition from "@/components/F_recognition";


interface LocationState {
  from?: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"credentials" | "face">("credentials");
  const [faceEmail, setFaceEmail] = useState("");
  const [faceScanStarted, setFaceScanStarted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from || "/";

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await loginUser(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to 2FPay",
      });
      
      // Navigate to the page they were trying to access
      navigate(from);
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFaceLogin = async () => {
    if (!faceEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email to continue with face login",
        variant: "destructive",
      });
      return;
    }
    
    setFaceScanStarted(true);
  };

  const handleFaceCapture = async (faceData: string) => {
    setLoading(true);
    
    try {
      // First, we need to find the user's UID from their email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", faceEmail));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("User not found");
      }
      
      const userId = querySnapshot.docs[0].id;
      const isVerified = await verifyFaceData(userId, faceData);
      
      if (!isVerified) {
        throw new Error("Face verification failed");
      }
      
      // If verification is successful, we need to manually sign them in
      // In a real app, you would use a custom token or similar secure method
      // This is simplified for the demo
      const userCred = await loginUser(faceEmail, "dummy-password");
      
      toast({
        title: "Face verification successful",
        description: "Welcome back to 2FPay",
      });
      
      navigate(from);
    } catch (error: any) {
      console.error("Face login error:", error);
      
      toast({
        title: "Face Login Error",
        description: error.message || "Face verification failed. Please try again or use email/password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setFaceScanStarted(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 mt-16">
        <div className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-primary/10">
                <Fingerprint className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Access your 2FPay account to send money securely
              </p>
            </div>
            
            <Tabs defaultValue="credentials" onValueChange={(value) => setLoginMethod(value as "credentials" | "face")} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credentials">Password</TabsTrigger>
                <TabsTrigger value="face">Face ID</TabsTrigger>
              </TabsList>
              
              <TabsContent value="credentials">
                <form className="space-y-6" onSubmit={handleEmailPasswordLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="#"
                        className="text-sm font-medium text-primary hover:text-primary/80"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full py-6"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="face">
                <div className="space-y-6">
                  {!faceScanStarted &&
                  
                    //   {/* <div className="space-y-2">
                    //     <Label htmlFor="faceEmail">Email address</Label>
                    //     <div className="relative">
                    //       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    //         <Mail className="h-5 w-5 text-muted-foreground" />
                    //       </div>
                    //       <Input
                    //         id="faceEmail"
                    //         name="faceEmail"
                    //         type="email"
                    //         autoComplete="email"
                    //         required
                    //         className="pl-10"
                    //         value={faceEmail}
                    //         onChange={(e) => setFaceEmail(e.target.value)}
                    //         placeholder="Enter your email"
                    //       />
                    //     </div>
                    //   </div>
                    //    */}
                    //   {/* <Button
                    //     onClick={handleFaceLogin}
                    //     className="w-full py-6"
                    //     disabled={loading}
                    //   >
                    //     <ScanFace className="mr-2 h-4 w-4" />
                    //     Proceed to Face Scan
                    //   </Button>
                    // </> */}
                   (
                    <>
                      {/* <div className="space-y-2 text-center">
                        <h3 className="text-xl font-medium">Face Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Look at the camera for verification
                        </p>
                      </div>
                      
                      <FaceScanner 
                        onCapture={handleFaceCapture} 
                        actionText="Verify Face" 
                      />
                      
                      <Button
                        variant="outline"
                        onClick={() => setFaceScanStarted(false)}
                        className="w-full"
                        disabled={loading}
                      >
                        Cancel
                      </Button> */}
                      <FaceRecognition/>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
