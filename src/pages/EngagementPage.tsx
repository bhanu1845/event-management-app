import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Heart, Diamond, Camera, Music, Flower } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/EngagementPage.css";

const EngagementPage = () => {
  const { t } = useLanguage();

  const engagementServices = [
    {
      id: "engagement-photography",
      name: t('engagementPhotography') || "Engagement Photography",
      description: t('engagementPhotographyDesc') || "Capture your love story beautifully",
      icon: <Camera className="h-6 w-6" />,
      price: "₹8,000 - ₹30,000",
      rating: 4.8,
      providers: 25
    },
    {
      id: "ring-ceremony",
      name: t('ringCeremony') || "Ring Ceremony Setup",
      description: t('ringCeremonyDesc') || "Beautiful ring exchange ceremony",
      icon: <Diamond className="h-6 w-6" />,
      price: "₹15,000 - ₹75,000",
      rating: 4.7,
      providers: 32
    },
    {
      id: "engagement-decoration",
      name: t('engagementDecoration') || "Engagement Decoration",
      description: t('engagementDecorationDesc') || "Romantic and elegant decorations",
      icon: <Flower className="h-6 w-6" />,
      price: "₹10,000 - ₹50,000",
      rating: 4.6,
      providers: 40
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <div className="relative h-96 bg-gradient-to-r from-pink-500 to-red-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">
              {t('engagementTitle') || 'Engagement Ceremonies'}
            </h1>
            <p className="text-xl mb-6">
              {t('engagementQuote') || 'The beginning of forever starts here 💕'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engagementServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{service.description}</CardDescription>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                      {service.price}
                    </Badge>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                      {t('bookNow') || 'Book Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementPage;