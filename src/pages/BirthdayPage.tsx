import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Gift, Cake, PartyPopper, Camera, Music, Palette } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/BirthdayPage.css";

const BirthdayPage = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const birthdayServices = [
    {
      id: "birthday-decoration",
      name: t('birthdayDecoration') || "Birthday Decoration",
      description: t('birthdayDecorationDesc') || "Colorful and themed decorations",
      icon: <PartyPopper className="h-6 w-6" />,
      price: "₹5,000 - ₹25,000",
      rating: 4.7,
      providers: 38
    },
    {
      id: "birthday-cake",
      name: t('birthdayCake') || "Custom Birthday Cakes",
      description: t('birthdayCakeDesc') || "Delicious custom-made birthday cakes",
      icon: <Cake className="h-6 w-6" />,
      price: "₹800 - ₹5,000",
      rating: 4.9,
      providers: 52
    },
    {
      id: "birthday-photography",
      name: t('birthdayPhotography') || "Birthday Photography",
      description: t('birthdayPhotographyDesc') || "Capture precious birthday memories",
      icon: <Camera className="h-6 w-6" />,
      price: "₹3,000 - ₹15,000",
      rating: 4.6,
      providers: 28
    },
    {
      id: "birthday-entertainment",
      name: t('birthdayEntertainment') || "Entertainment & Games",
      description: t('birthdayEntertainmentDesc') || "Fun activities and entertainment",
      icon: <Gift className="h-6 w-6" />,
      price: "₹2,000 - ₹10,000",
      rating: 4.8,
      providers: 35
    },
    {
      id: "birthday-music",
      name: t('birthdayMusic') || "Music & DJ",
      description: t('birthdayMusicDesc') || "Perfect music for birthday parties",
      icon: <Music className="h-6 w-6" />,
      price: "₹3,000 - ₹15,000",
      rating: 4.5,
      providers: 42
    },
    {
      id: "face-painting",
      name: t('facePainting') || "Face Painting & Art",
      description: t('facePaintingDesc') || "Creative face painting for kids",
      icon: <Palette className="h-6 w-6" />,
      price: "₹1,500 - ₹5,000",
      rating: 4.7,
      providers: 25
    }
  ];

  const birthdayGallery = [
    "/images/birthday/b1.png",
    "/images/birthday/b2.png",
    "/images/birthday/b3.png",
    "/images/birthday/b4.png"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">
              {t('birthdayTitle') || 'Birthday Celebrations'}
            </h1>
            <p className="text-xl mb-6">
              {t('birthdayQuote') || 'Another year of blessings and joy 🎂'}
            </p>
            <p className="text-lg opacity-90">
              {t('birthdayPageDesc') || 'Create unforgettable birthday memories with our party planning services'}
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
            {t('birthdayServices') || 'Birthday Party Services'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('birthdayServicesDesc') || 'Everything you need for a perfect birthday celebration'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {birthdayServices.map((service, index) => (
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
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
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
              {t('birthdayGallery') || 'Birthday Gallery'}
            </h2>
            <p className="text-gray-600">
              {t('birthdayGalleryDesc') || 'Happy moments from our birthday celebrations'}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {birthdayGallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Birthday ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=400&fit=crop&auto=format&q=80&sig=${index}`;
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              {t('readyToCelebrate') || 'Ready to Celebrate?'}
            </h2>
            <p className="text-xl mb-8">
              {t('planBirthday') || 'Let us help you plan the perfect birthday party'}
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-yellow-600 hover:bg-gray-100">
              {t('getStarted') || 'Get Started'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayPage;