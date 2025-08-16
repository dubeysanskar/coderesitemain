
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import * as XLSX from 'xlsx';

interface CertificateData {
  id: string;
  name: string;
  role: string;
  email: string;
  mergedDocUrl: string;
}

const Validator = () => {
  const [formData, setFormData] = useState({
    certificateId: '',
    email: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<CertificateData | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [certificatesData, setCertificatesData] = useState<CertificateData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load the Excel file when component mounts
    loadCertificatesData();
  }, []);

  const loadCertificatesData = async () => {
    try {
      // Fetch data from Google Sheets CSV
      const csvUrl = 'https://docs.google.com/spreadsheets/d/1_IUIjdegiO-WPTuR5ljdELtm7zEQT623W3gIMwWeb8Y/export?format=csv';
      const response = await fetch(csvUrl);
      const csvText = await response.text();
      
      // Parse CSV data
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const certificates: CertificateData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length >= 6 && values[0]) {
          certificates.push({
            id: values[0],
            name: values[1] || '',
            role: values[2] || '',
            email: values[3] || '',
            mergedDocUrl: values[5] || '' // Column 6: "Merged Doc URL - CodeResite Internship Completion Certificate"
          });
        }
      }
      
      setCertificatesData(certificates);
      console.log('Certificate data loaded:', certificates.length, 'certificates');
      
    } catch (error) {
      console.error('Error loading certificates data:', error);
      toast({
        title: "Error loading certificates",
        description: "Could not load the certificates database. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);
    setHasSubmitted(true);

    try {
      const searchCertId = formData.certificateId.trim().toLowerCase();
      const searchEmail = formData.email.trim().toLowerCase();
      
      console.log('Searching for:', { 
        certificateId: searchCertId, 
        email: searchEmail,
        totalCertificates: certificatesData.length
      });
      
      // Debug: Log all certificate IDs and emails for comparison
      console.log('All certificates in database:');
      certificatesData.forEach((cert, index) => {
        console.log(`${index + 1}. ID: "${cert.id.toLowerCase()}" | Email: "${cert.email.toLowerCase()}"`);
      });
      
      // Find matching certificate
      const matchingCertificate = certificatesData.find(cert => {
        const certId = cert.id.toLowerCase().trim();
        const certEmail = cert.email.toLowerCase().trim();
        const certName = cert.name.toLowerCase().trim();
        
        const certIdMatch = certId === searchCertId;
        const emailMatch = certEmail === searchEmail;
        const nameMatch = certName === searchEmail.toLowerCase();
        
        console.log('Checking certificate:', {
          originalCertId: cert.id,
          normalizedCertId: certId,
          searchCertId: searchCertId,
          certIdMatch,
          originalEmail: cert.email,
          normalizedEmail: certEmail,
          searchEmail: searchEmail,
          emailMatch,
          nameMatch,
          bothMatch: certIdMatch && (emailMatch || nameMatch)
        });
        
        return certIdMatch && (emailMatch || nameMatch);
      });

      console.log('Matching certificate found:', matchingCertificate);

      if (matchingCertificate) {
        setVerificationResult(matchingCertificate);
        toast({
          title: "Certificate Verified Successfully!",
          description: "The certificate is valid and matches our records.",
        });
      } else {
        setVerificationResult(null);
        toast({
          title: "Certificate Not Found",
          description: "No matching certificate found for the provided ID and email combination.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
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
                      Email or Name *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email or name"
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

                {hasSubmitted && verificationResult && (
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
                          <span className="text-gray-300">ID:</span>
                          <span className="text-white font-medium">{verificationResult.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Name:</span>
                          <span className="text-white font-medium">{verificationResult.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Role:</span>
                          <span className="text-white font-medium">{verificationResult.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Email:</span>
                          <span className="text-white font-medium">{verificationResult.email}</span>
                        </div>
                      </div>
                      
                      {verificationResult.mergedDocUrl && (
                        <div className="mt-6">
                          <Button 
                            onClick={() => window.open(verificationResult.mergedDocUrl, '_blank')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-full"
                          >
                            📄 Download Your Certificate
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {hasSubmitted && !verificationResult && !isVerifying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 p-6 bg-red-500/20 border border-red-400/30 rounded-lg"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">❌</div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Certificate Not Found
                      </h3>
                      <p className="text-gray-300 text-sm">
                        No matching certificate found for the provided credentials.
                      </p>
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
              className="border-white text-white bg-black hover:bg-white hover:text-black"
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
