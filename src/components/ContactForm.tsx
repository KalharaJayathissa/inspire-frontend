import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Mock API call - In real implementation, this would connect to Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email Us',
      value: 'hello@kessinspire.com',
      description: 'Send us an email anytime'
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri from 9am to 6pm'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Visit Us',
      value: '123 Education Street',
      description: 'New York, NY 10001'
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Office Hours',
      value: 'Mon-Fri: 9am-6pm',
      description: 'Weekend support available'
    }
  ];

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our programs? Need academic guidance? We're here to help you succeed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Let's Connect</h3>
              <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8">
                Whether you're a current student, prospective applicant, or just curious about what we offer, 
                we'd love to hear from you. Our team is dedicated to supporting your academic journey.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    {info.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{info.title}</h4>
                    <p className="text-foreground font-medium mb-1 text-sm sm:text-base">{info.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 sm:mt-12">
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Frequently Asked Questions</h4>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h5 className="font-medium text-foreground mb-1 text-sm sm:text-base">How quickly do you respond?</h5>
                  <p className="text-xs sm:text-sm text-muted-foreground">We typically respond within 24 hours during business days.</p>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-1 text-sm sm:text-base">Is there a cost for your services?</h5>
                  <p className="text-xs sm:text-sm text-muted-foreground">All our student support services are completely free.</p>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-1 text-sm sm:text-base">Can you help with specific subjects?</h5>
                  <p className="text-xs sm:text-sm text-muted-foreground">Yes! We have experts across all major academic disciplines.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="card-gradient border-0 shadow-soft order-1 lg:order-2">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">Send us a Message</CardTitle>
              <CardDescription className="text-center text-sm sm:text-base">
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-sm sm:text-base">Full Name *</Label>
                    <Input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-sm sm:text-base">Email Address *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject" className="text-sm sm:text-base">Subject *</Label>
                  <Input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="What's this about?"
                    className="h-10 sm:h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-sm sm:text-base">Message *</Label>
                  <Textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Please describe how we can help you or any questions you have..."
                    className="min-h-[100px] sm:min-h-[120px] resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 py-4 sm:py-6 text-base sm:text-lg font-semibold group"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;