import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Flower2, Camera, Music, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/HaldiPage.css";

const HaldiPage = () => {
  const { t } = useLanguage();

  const haldiServices = [
    {
      id: "haldi-decoration",
      name: t('haldiDecoration') || "Haldi Decoration",
      description: t('haldiDecorationDesc') || "Traditional yellow themed decorations",
      icon: <Flower2 className="h-6 w-6" />,
      price: "₹10,000 - ₹45,000",
      rating: 4.8,
      providers: 32
    },
    {
      id: "haldi-photography",
      name: t('haldiPhotography') || "Haldi Photography",
      description: t('haldiPhotographyDesc') || "Capture traditional haldi moments",
      icon: <Camera className="h-6 w-6" />,
      price: "₹8,000 - ₹25,000",
      rating: 4.7,
      providers: 24
    },
    {
      id: "traditional-music",
      name: t('traditionalMusic') || "Traditional Music",
      description: t('traditionalMusicDesc') || "Authentic Indian music for ceremonies",
      icon: <Music className="h-6 w-6" />,
      price: "₹5,000 - ₹20,000",
      rating: 4.6,
      providers: 18
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      <div className="relative h-96 bg-gradient-to-r from-yellow-600 to-amber-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">
              {t('haldiTitle') || 'Haldi Ceremonies'}
            </h1>
            <p className="text-xl mb-6">
              {t('haldiQuote') || 'Golden traditions, blessed beginnings 💛'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {haldiServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
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
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      {service.price}
                    </Badge>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
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

export default HaldiPage;