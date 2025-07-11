
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Fingerprint, SendHorizontal, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleSendMoney = () => {
    if (isAuthenticated) {
      navigate("/send-money");
    } else {
      navigate("/login", { state: { from: "/send-money" } });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-0"></div>
      
      {/* Main content */}
      <div className="container relative z-10 px-4 py-16 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <Fingerprint className="h-14 w-14 text-primary" />
          </div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Secure Payments with
            <span className="text-primary block mt-2">Biometric Authentication</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
            Transfer money securely using facial recognition and fingerprint authentication. Experience the next level of payment security.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium flex items-center gap-2"
              onClick={handleSendMoney}
            >
              <SendHorizontal className="mr-2" />
              Send Money
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </Button>
          </div>
        </motion.div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-effect p-6 rounded-2xl card-hover"
          >
            <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fingerprint Verification</h3>
            <p className="text-muted-foreground">Use your unique fingerprint to authenticate and authorize secure money transfers.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-effect p-6 rounded-2xl card-hover"
          >
            <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12C2 6.48 6.48 2 12 2c5.53 0 10 4.47 10 10 0 5.52-4.47 10-10 10-5.52 0-10-4.48-10-10z"/>
                <circle cx="12" cy="10" r="3"/>
                <path d="M7 20.662V19c0-1.657 2.239-3 5-3 2.762 0 5 1.343 5 3v1.662"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Facial Recognition</h3>
            <p className="text-muted-foreground">Secure your transactions with advanced facial recognition technology for enhanced security.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-effect p-6 rounded-2xl card-hover"
          >
            <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Bank-Level Security</h3>
            <p className="text-muted-foreground">Rest easy knowing your transactions are protected with the highest level of encryption and security.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
