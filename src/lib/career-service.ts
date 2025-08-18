export interface CareerFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  resume: string;
  startDate: string;
  comments: string;
}

export const submitCareerApplication = async (formData: CareerFormData): Promise<{ success: boolean; message?: string; id?: string }> => {
  try {
    // Create a form element to submit as HTML form
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('location', formData.location);
    form.append('role', formData.role);
    form.append('resume', formData.resume);
    form.append('startDate', formData.startDate);
    form.append('comments', formData.comments);
    form.append('source', 'website');

    const response = await fetch('https://script.google.com/macros/s/AKfycbyj2B9-m-QMzRgI6gHTw7w9iuGAMXZ8nfxM_t-MhB50_AwREre5QX4WgyC_7aaACLZ0/exec', {
      method: 'POST',
      body: form,
      redirect: 'follow'
    });

    // Try to get the response as text first
    const responseText = await response.text();
    
    // Try to parse as JSON, if it fails just check if response is ok
    let result: any = null;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      // If we can't parse JSON, check if response was successful
      if (response.ok || responseText.includes('success')) {
        return { success: true, message: 'Application submitted successfully!' };
      }
      throw new Error('Failed to submit application');
    }

    if (result && (result.status === 'success' || response.ok)) {
      return { 
        success: true, 
        message: result.id ? `Application submitted! ID: ${result.id}` : 'Application submitted successfully!',
        id: result.id 
      };
    } else {
      throw new Error(result?.message || 'Failed to submit application');
    }
  } catch (error: any) {
    console.error('Submission error:', error);
    return { 
      success: false, 
      message: error.message || 'There was a problem submitting your application. Please try again.' 
    };
  }
};