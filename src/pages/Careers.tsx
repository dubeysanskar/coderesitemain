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
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbyj2B9-m-QMzRgI6gHTw7w9iuGAMXZ8nfxM_t-MhB50_AwREre5QX4WgyC_7aaACLZ0/exec';

      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('phone', formData.phone);
      params.append('location', formData.location);
      params.append('role', formData.role);
      params.append('resume', formData.resume);
      params.append('startDate', formData.startDate);
      params.append('comments', formData.comments);
      params.append('source', 'website');

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: params.toString()
      });

      // Attempt to read JSON:
      let json = null;
      try {
        json = await response.json();
      } catch (err) {
        console.warn('Could not parse JSON response:', err);
      }

      if (response.ok || (json && json.status === 'success')) {
        const id = json && json.id ? json.id : undefined;
        toast({
          title: 'Application Submitted!',
          description: id ? `Thanks — Submission ID: ${id}` : 'Thank you! Your application was submitted.'
        });

        setFormData({ name: '', email: '', phone: '', location: '', role: '', resume: '', startDate: '', comments: '' });
      } else {
        const msg = (json && json.message) ? json.message : `HTTP ${response.status}`;
        throw new Error(msg);
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      toast({
        title: 'Submission Failed',
        description: err.message || 'There was a problem submitting the form. Check console/network and Apps Script logs.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... UI unchanged (same as your current form). For brevity, not repeated here.
  return (
    <Layout>
      <div className="min-h-screen">{/* ... keep the rest of your JSX identical to previous component ... */}
        {/* Copy your full JSX here (same as before) */}
      </div>
    </Layout>
  );
};

export default Careers;
