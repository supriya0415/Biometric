
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Fingerprint, SendHorizontal, User, DollarSign } from "lucide-react";
import { useAuth } from "@/context/FingAuthContext";

const SendMoney = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<"initial" | "fingerprint" | "face" | "success">("initial");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { user, verifyFingerprint } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const verified = await verifyFingerprint();
      if (verified) {
        navigate('/payment-success');
      } else {
        setError('Fingerprint verification failed. Please try again.');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };


  

  const handleBackToHome = () => {
    navigate("/");
  };

  const renderContent = () => {
    switch (verificationStep) {
      case "initial":
        return (
          <Card className="w-full max-w-md glass-effect">
            <CardHeader>
              <CardTitle className="text-2xl">Send Money</CardTitle>
              <CardDescription>
                Enter recipient details and amount to begin the secure transfer
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Email or ID</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="pl-10"
                      placeholder="Enter recipient email or ID"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                      placeholder="Enter amount to send"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full"> Verify and Pay</Button>
              </CardFooter>
            </form>
          </Card>
        );
        
      case "fingerprint":
        return (
          <Card className="w-full max-w-md glass-effect text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Fingerprint Verification</CardTitle>
              <CardDescription>
                Please scan your fingerprint to verify your identity
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 py-8">
              <div className="w-36 h-36 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Fingerprint className={`h-20 w-20 text-primary ${loading ? 'animate-pulse' : ''}`} />
              </div>
              <p className="text-muted-foreground">
                Touch the fingerprint sensor to confirm your identity and authorize this transaction
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
            
                disabled={loading}
                className="w-full"
              >
                {loading ? "Verifying..." : "Scan Fingerprint"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setVerificationStep("initial")}
                disabled={loading}
              >
                Go Back
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "face":
        return (
          <Card className="w-full max-w-md glass-effect text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Face Recognition</CardTitle>
              <CardDescription>
                Please look at the camera to verify your identity
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 py-8">
              <div className="w-36 h-36 rounded-full bg-primary/10 flex items-center justify-center mx-auto overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-20 w-20 text-primary ${loading ? 'animate-pulse' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12C2 6.48 6.48 2 12 2c5.53 0 10 4.47 10 10 0 5.52-4.47 10-10 10-5.52 0-10-4.48-10-10z"/>
                  <circle cx="12" cy="10" r="3"/>
                  <path d="M7 20.662V19c0-1.657 2.239-3 5-3 2.762 0 5 1.343 5 3v1.662"/>
                </svg>
              </div>
              <p className="text-muted-foreground">
                Position your face within the frame and remain still for facial verification
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
         
                disabled={loading}
                className="w-full"
              >
                {loading ? "Verifying..." : "Scan Face"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setVerificationStep("fingerprint")}
                disabled={loading}
              >
                Go Back
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "success":
        return (
          <Card className="w-full max-w-md glass-effect text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Transfer Complete!</CardTitle>
              <CardDescription>
                Your money has been sent successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 py-8">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  ${Number(amount).toFixed(2)} sent to {recipient}
                </p>
                <p className="text-sm text-muted-foreground">
                  Transaction ID: {Math.random().toString(36).substring(2, 15)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBackToHome} className="w-full">
                Return Home
              </Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 mt-16">
        {renderContent()}
      </div>
    </div>
  );
};

export default SendMoney;
