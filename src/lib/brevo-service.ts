// Note: This is a frontend service. In production, you should move this to a backend API
// to keep API keys secure and handle CORS issues.

interface EmailData {
  sender: { name: string; email: string };
  to: Array<{ email: string; name: string }>;
  subject: string;
  htmlContent: string;
}

export const brevoService = {
  async sendTransactionalEmail(emailData: EmailData) {
    // In a real implementation, this would call your backend API
    // which would then use the Brevo API with the server-side API key
    
    console.log('Email would be sent via Brevo API:', emailData);
    
    // Simulate API call for demo purposes
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure randomly for demo
        if (Math.random() > 0.1) {
          resolve({ messageId: `msg_${Date.now()}` });
        } else {
          reject(new Error('Simulated API error'));
        }
      }, 1000 + Math.random() * 2000);
    });
  }
};

// Example of how the backend implementation would look:
/*
// Backend Node.js implementation (for reference):
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendEmail(emailData) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.sender = emailData.sender;
  sendSmtpEmail.to = emailData.to;
  sendSmtpEmail.subject = emailData.subject;
  sendSmtpEmail.htmlContent = emailData.htmlContent;
  
  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    throw error;
  }
}
*/
