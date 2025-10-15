import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Briefcase, Camera, Mic, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/CorporatePage.css";

const CorporatePage = () => {
  const { t } = useLanguage();

  const corporateServices = [
    {
      id: "conference-setup",
      name: t('conferenceSetup') || "Conference Setup",
      description: t('conferenceSetupDesc') || "Professional conference arrangements",
      icon: <Briefcase className="h-6 w-6" />,
      price: "₹25,000 - ₹1,50,000",
      rating: 4.8,
      providers: 15
    },
    {
      id: "corporate-catering",
      name: t('corporateCatering') || "Corporate Catering",
      description: t('corporateCateringDesc') || "Professional catering services",
      icon: <Coffee className="h-6 w-6" />,
      price: "₹200 - ₹800 per person",
      rating: 4.7,
      providers: 28
    },
    {
      id: "av-equipment",
      name: t('avEquipment') || "AV Equipment",
      description: t('avEquipmentDesc') || "Audio visual equipment rental",
      icon: <Mic className="h-6 w-6" />,
      price: "₹5,000 - ₹25,000",
      rating: 4.6,
      providers: 22
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-gray-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">
              {t('corporateTitle') || 'Corporate Events'}
            </h1>
            <p className="text-xl mb-6">
              {t('corporateQuote') || 'Success celebrates with style 💼'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {corporateServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
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
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {service.price}
                    </Badge>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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

export default CorporatePage;