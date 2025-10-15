import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Baby, Camera, Gift, Cake } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/BabyShowerPage.css";

const BabyShowerPage = () => {
  const { t } = useLanguage();

  const babyShowerServices = [
    {
      id: "babyshower-decoration",
      name: t('babyshowerDecoration') || "Baby Shower Decoration",
      description: t('babyshowerDecorationDesc') || "Cute and adorable decorations",
      icon: <Baby className="h-6 w-6" />,
      price: "₹8,000 - ₹35,000",
      rating: 4.8,
      providers: 25
    },
    {
      id: "babyshower-photography",
      name: t('babyshowerPhotography') || "Baby Shower Photography",
      description: t('babyshowerPhotographyDesc') || "Capture precious moments",
      icon: <Camera className="h-6 w-6" />,
      price: "₹5,000 - ₹20,000",
      rating: 4.7,
      providers: 18
    },
    {
      id: "baby-cake",
      name: t('babyCake') || "Baby Themed Cakes",
      description: t('babyCakeDesc') || "Adorable baby shower cakes",
      icon: <Cake className="h-6 w-6" />,
      price: "₹1,500 - ₹8,000",
      rating: 4.9,
      providers: 32
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="relative h-96 bg-gradient-to-r from-blue-400 to-pink-400 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">
              {t('babyshowerTitle') || 'Baby Shower'}
            </h1>
            <p className="text-xl mb-6">
              {t('babyshowerQuote') || 'Little miracles bring big joy 👶'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {babyShowerServices.map((service, index) => (
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

export default BabyShowerPage;