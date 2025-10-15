import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, PartyPopper, Camera, Music, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/ReceptionPage.css";

const ReceptionPage = () => {
  const { t } = useLanguage();

  const receptionServices = [
    {
      id: "reception-decoration",
      name: t('receptionDecoration') || "Reception Decoration",
      description: t('receptionDecorationDesc') || "Grand reception decorations",
      icon: <PartyPopper className="h-6 w-6" />,
      price: "₹30,000 - ₹2,00,000",
      rating: 4.8,
      providers: 35
    },
    {
      id: "reception-catering",
      name: t('receptionCatering') || "Reception Catering",
      description: t('receptionCateringDesc') || "Delicious multi-cuisine dining",
      icon: <Utensils className="h-6 w-6" />,
      price: "₹400 - ₹2,000 per plate",
      rating: 4.7,
      providers: 48
    },
    {
      id: "reception-entertainment",
      name: t('receptionEntertainment') || "Entertainment & DJ",
      description: t('receptionEntertainmentDesc') || "Music and entertainment",
      icon: <Music className="h-6 w-6" />,
      price: "₹15,000 - ₹1,00,000",
      rating: 4.6,
      providers: 42
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gold-50">
      <div className="relative h-96 bg-gradient-to-r from-purple-600 to-yellow-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">
              {t('receptionTitle') || 'Reception Parties'}
            </h1>
            <p className="text-xl mb-6">
              {t('receptionQuote') || 'Dance, dine, and celebrate life 🎉'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receptionServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
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
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {service.price}
                    </Badge>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
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

export default ReceptionPage;