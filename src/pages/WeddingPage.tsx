import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Heart, Calendar, MapPin, Camera, Music, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/WeddingPage.css";

const WeddingPage = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const weddingServices = [
    {
      id: "bridal-makeup",
      name: t('bridalMakeup') || "Bridal Makeup",
      description: t('bridalMakeupDesc') || "Professional bridal makeup and styling",
      icon: <Heart className="h-6 w-6" />,
      price: "₹15,000 - ₹50,000",
      rating: 4.8,
      providers: 45
    },
    {
      id: "wedding-photography",
      name: t('weddingPhotography') || "Wedding Photography",
      description: t('weddingPhotographyDesc') || "Capture every precious moment",
      icon: <Camera className="h-6 w-6" />,
      price: "₹25,000 - ₹1,00,000",
      rating: 4.9,
      providers: 32
    },
    {
      id: "wedding-venue",
      name: t('weddingVenue') || "Wedding Venues",
      description: t('weddingVenueDesc') || "Beautiful venues for your special day",
      icon: <MapPin className="h-6 w-6" />,
      price: "₹50,000 - ₹5,00,000",
      rating: 4.7,
      providers: 28
    },
    {
      id: "wedding-catering",
      name: t('weddingCatering') || "Wedding Catering",
      description: t('weddingCateringDesc') || "Delicious food for your guests",
      icon: <Utensils className="h-6 w-6" />,
      price: "₹300 - ₹1,500 per plate",
      rating: 4.6,
      providers: 56
    },
    {
      id: "wedding-music",
      name: t('weddingMusic') || "Wedding Music & DJ",
      description: t('weddingMusicDesc') || "Perfect music for your celebration",
      icon: <Music className="h-6 w-6" />,
      price: "₹10,000 - ₹75,000",
      rating: 4.5,
      providers: 38
    },
    {
      id: "wedding-decoration",
      name: t('weddingDecoration') || "Wedding Decoration",
      description: t('weddingDecorationDesc') || "Beautiful decorations and themes",
      icon: <Star className="h-6 w-6" />,
      price: "₹20,000 - ₹2,00,000",
      rating: 4.8,
      providers: 42
    }
  ];

  const weddingGallery = [
    "/images/wedding/w1.png",
    "/images/wedding/w2.png",
    "/images/wedding/w3.png",
    "/images/wedding/w4.png"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">
              {t('weddingTitle') || 'Wedding Ceremonies'}
            </h1>
            <p className="text-xl mb-6">
              {t('weddingQuote') || 'Two hearts, one soul, endless love 💍'}
            </p>
            <p className="text-lg opacity-90">
              {t('weddingPageDesc') || 'Make your special day perfect with our comprehensive wedding services'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('weddingServices') || 'Wedding Services'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('weddingServicesDesc') || 'Everything you need for your perfect wedding day'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddingServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedService(service.id)}>
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
                        <span className="text-sm text-gray-500">({service.providers} providers)</span>
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

      {/* Gallery Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('weddingGallery') || 'Wedding Gallery'}
            </h2>
            <p className="text-gray-600">
              {t('weddingGalleryDesc') || 'Beautiful moments from our previous weddings'}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weddingGallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Wedding ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&auto=format&q=80&sig=${index}`;
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              {t('readyToStart') || 'Ready to Start Planning?'}
            </h2>
            <p className="text-xl mb-8">
              {t('contactUs') || 'Contact us today to make your dream wedding come true'}
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-gray-100">
              {t('getStarted') || 'Get Started'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WeddingPage;