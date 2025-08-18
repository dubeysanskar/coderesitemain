import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const Careers = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    resume: '',
    startDate: '',
    comments: ''
  });

  const roleOptions = [
    'AI Developer',
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'Mobile App Developer',
    'Marketing',
    'HR',
    'Sales',
    'Graphic Designer',
    'UI/UX Designer',
    'Video Editor',
    'Content Creator',
    'Social Media Manager',
    'Community Manager',
    'Project Manager',
    'Other'
  ];

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Google Sheets API endpoint
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbyYcJoBxVWF0y-5wA02qVWXbd2iPYXAisjbrDSssH0xEHjYt-ehouDJmwbiYpj699CZfA/exec';
      
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          role: formData.role,
          resume: formData.resume,
          startDate: formData.startDate,
          comments: formData.comments,
          source: 'website'
        })
      });
      
      toast({
        title: "Application Submitted!",
        description: "Thank you! Your application has been submitted. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        role: '',
        resume: '',
        startDate: '',
        comments: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">{/* Background removed - using theme default */}
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">{/* Made more responsive */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent"
            >
              Get Hired at coderesite.com
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              We are a coder site, building innovative solutions with passionate people. 
              Join our team of developers, creators, and strategists. Pick your role, apply, 
              and we'll connect with you for the next steps.
            </motion.p>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="pb-16 px-4">
          <div className="max-w-2xl mx-auto">{/* Improved spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">{/* Better transparency */}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">
                    Submit Your Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">{/* Responsive spacing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">{/* Responsive gaps */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">{/* Responsive gaps */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Preferred Role *</Label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Portfolio / Resume Link</Label>
                      <Input
                        id="resume"
                        value={formData.resume}
                        onChange={(e) => handleInputChange('resume', e.target.value)}
                        placeholder="https://your-portfolio.com or Google Drive link"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">How soon can you start?</Label>
                      <Input
                        id="startDate"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        placeholder="e.g., Immediately, 2 weeks notice, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comments">Do you have any questions or comments?</Label>
                      <Textarea
                        id="comments"
                        value={formData.comments}
                        onChange={(e) => handleInputChange('comments', e.target.value)}
                        placeholder="Tell us why you'd be a great fit!"
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base md:text-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Careers;