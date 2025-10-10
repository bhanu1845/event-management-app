import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <Phone className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Phone</CardTitle>
              <CardDescription>Give us a call</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">+91 98765 43210</p>
              <p className="text-sm text-muted-foreground mt-2">
                Available Mon-Sat, 9 AM - 6 PM
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Email</CardTitle>
              <CardDescription>Send us an email</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">support@eventhub.com</p>
              <p className="text-sm text-muted-foreground mt-2">
                We'll respond within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Location</CardTitle>
              <CardDescription>Visit our office</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Hyderabad, Telangana</p>
              <p className="text-sm text-muted-foreground mt-2">
                India, 500001
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>When we're available</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Mon - Sat: 9 AM - 6 PM</p>
              <p className="text-sm text-muted-foreground mt-2">
                Sunday: Closed
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Have questions? We're here to help! Feel free to reach out through any of the 
              channels above, and our team will get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">For Customers</h3>
                <p className="text-muted-foreground text-sm">
                  If you need help finding the right service provider or have questions about 
                  booking, our customer support team is ready to assist you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">For Service Providers</h3>
                <p className="text-muted-foreground text-sm">
                  Interested in joining EventHub? Contact us to learn more about creating your 
                  professional profile and reaching more customers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
