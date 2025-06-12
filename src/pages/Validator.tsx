
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const Validator = () => {
  const [formData, setFormData] = useState({
    certificateId: '',
    email: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    // Simulate certificate verification
    setTimeout(() => {
      const mockResult = {
        valid: true,
        holderName: 'John Doe',
        issuanceDate: '2024-01-15',
        issuer: 'CodeResite Academy',
        certificateType: 'AI Development Certification',
        status: 'Valid',
      };

      setVerificationResult(mockResult);
      setIsVerifying(false);
      
      toast({
        title: "Certificate Verified Successfully!",
        description: "The certificate is valid and active.",
      });
    }, 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Certificate Validator
            </h1>
            <p className="text-gray-300">
              Verify the authenticity of CodeResite certificates
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-black/40 border-white/20 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="certificateId" className="text-white">
                      Certificate ID *
                    </Label>
                    <Input
                      id="certificateId"
                      name="certificateId"
                      value={formData.certificateId}
                      onChange={handleInputChange}
                      placeholder="Enter certificate ID"
                      required
                      className="mt-1 bg-black/50 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      className="mt-1 bg-black/50 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isVerifying}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-medium py-3 rounded-full"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Certificate'}
                  </Button>
                </form>

                {verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 p-6 bg-green-500/20 border border-green-400/30 rounded-lg"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h3 className="text-xl font-bold text-white mb-4">
                        Certificate Verified
                      </h3>
                      
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Holder:</span>
                          <span className="text-white font-medium">{verificationResult.holderName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Type:</span>
                          <span className="text-white font-medium">{verificationResult.certificateType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Issued Date:</span>
                          <span className="text-white font-medium">{verificationResult.issuanceDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Issuer:</span>
                          <span className="text-white font-medium">{verificationResult.issuer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Status:</span>
                          <span className="text-green-400 font-bold">{verificationResult.status}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-8"
          >
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Validator;
