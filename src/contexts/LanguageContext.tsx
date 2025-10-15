import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Translations {
  en: Record<string, string>;
  hi: Record<string, string>;
  te: Record<string, string>;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations: Translations = {
  en: {
    // Navbar translations
    deliverTo: "Deliver to",
    searchPlaceholder: "Search services...",
    addWorker: "Add Worker",
    signIn: "Sign In",
    signOut: "Sign Out",
    cart: "Cart",
    home: "Home",
    allServices: "All Services",
    photography: "Photography",
    catering: "Catering",
    decoration: "Decoration",
    musicDj: "Music & DJ",
    about: "About",
    contact: "Contact",
    
    // Common translations
    welcome: "Welcome to Vibezon",
    services: "Services",
    workers: "Workers",
    bookNow: "Book Now",
    viewDetails: "View Details",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    
    // Home page translations
    cateringServices: "Catering Services",
    cateringDescription: "Delicious food for your events",
    photographyServices: "Photography",
    photographyDescription: "Capture your precious moments",
    decorationServices: "Decoration Services", 
    decorationDescription: "Beautiful decorations for your events",
    venueServices: "Venue Services",
    venueDescription: "Beautiful venues for your special events",
    musicDjServices: "Music & DJ Services",
    musicDjDescription: "Perfect music for your celebrations",
    
    // Event Categories with Quotes
    weddingTitle: "Wedding Ceremonies",
    weddingQuote: "Two hearts, one soul, endless love 💍",
    birthdayTitle: "Birthday Celebrations", 
    birthdayQuote: "Another year of blessings and joy 🎂",
    engagementTitle: "Engagement Ceremonies",
    engagementQuote: "The beginning of forever starts here 💕",
    anniversaryTitle: "Anniversary Celebrations",
    anniversaryQuote: "Years of love, memories to treasure 🥂",
    haldiTitle: "Haldi Ceremonies",
    haldiQuote: "Golden traditions, blessed beginnings 💛",
    corporateTitle: "Corporate Events",
    corporateQuote: "Success celebrates with style 💼",
    babyshowerTitle: "Baby Shower",
    babyshowerQuote: "Little miracles bring big joy 👶",
    receptionTitle: "Reception Parties",
    receptionQuote: "Dance, dine, and celebrate life 🎉",
    
    exploreServices: "Explore Our Services",
    trustedProfessionals: "Trusted Professionals",
    topRatedWorkers: "Top Rated Workers",
    featuredCategories: "Featured Categories",
    whyChooseUs: "Why Choose Us",
    experiencedProfessionals: "Experienced Professionals",
    experiencedDesc: "Our workers have years of experience in their field",
    quickResponse: "Quick Response Time",
    quickResponseDesc: "Get instant responses and quick service booking",
    verifiedWorkers: "Verified Workers", 
    verifiedDesc: "All our workers are background verified and trusted",
    affordablePricing: "Affordable Pricing",
    affordableDesc: "Competitive prices with no hidden charges",
    yearsExperience: "Years Experience",
    projectsCompleted: "Projects Completed",
    rating: "Rating",
    responseTime: "Response Time",
    addToCart: "Add to Cart",
    
    // Additional common translations
    loadingCategories: "Loading categories...",
    projects: "projects",
    years: "years",
    experts: "+ Experts",
    viewAll: "View All",
    professionals: "Professionals",
    profile: "Profile",
    fresher: "Fresher",
    
    // Category translations - English (base language)
    "Catering": "Catering",
    "Photography": "Photography", 
    "Venue": "Venue",
    "DJ & Music": "DJ & Music",
    "Music & DJ": "Music & DJ", 
    "Decoration": "Decoration",
    "Entertainment": "Entertainment",
    "Makeup": "Makeup",
    "Planning": "Planning",
    "Event Planning": "Event Planning"
  },
  hi: {
    // Navbar translations
    deliverTo: "डिलीवर करें",
    searchPlaceholder: "सेवाएं खोजें...",
    addWorker: "कार्यकर्ता जोड़ें",
    signIn: "साइन इन",
    signOut: "साइन आउट",
    cart: "कार्ट",
    home: "होम",
    allServices: "सभी सेवाएं",
    photography: "फोटोग्राफी",
    catering: "कैटरिंग",
    decoration: "सजावट",
    musicDj: "संगीत और डीजे",
    about: "के बारे में",
    contact: "संपर्क",
    
    // Common translations
    welcome: "विबेज़ोन में आपका स्वागत है",
    services: "सेवाएं",
    workers: "कार्यकर्ता",
    bookNow: "अभी बुक करें",
    viewDetails: "विवरण देखें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    
    // Home page translations
    cateringServices: "कैटरिंग सेवाएं",
    cateringDescription: "आपके कार्यक्रमों के लिए स्वादिष्ट खाना",
    photographyServices: "फोटोग्राफी",
    photographyDescription: "अपने कीमती पलों को कैद करें",
    decorationServices: "सजावट सेवाएं",
    decorationDescription: "आपके कार्यक्रमों के लिए सुंदर सजावट",
    venueServices: "स्थल सेवाएं",
    venueDescription: "आपके विशेष अवसरों के लिए सुंदर स्थल",
    musicDjServices: "संगीत और डीजे सेवाएं",
    musicDjDescription: "आपके उत्सव के लिए परफेक्ट संगीत",
    
    // Event Categories with Quotes
    weddingTitle: "शादी समारोह",
    weddingQuote: "दो दिल, एक आत्मा, अनंत प्रेम 💍",
    birthdayTitle: "जन्मदिन उत्सव", 
    birthdayQuote: "आशीर्वाद और खुशी का एक और साल 🎂",
    engagementTitle: "सगाई समारोह",
    engagementQuote: "हमेशा की शुरुआत यहीं से होती है 💕",
    anniversaryTitle: "वर्षगांठ उत्सव",
    anniversaryQuote: "प्रेम के साल, संजोने वाली यादें 🥂",
    haldiTitle: "हल्दी समारोह",
    haldiQuote: "सुनहरी परंपराएं, धन्य शुरुआत 💛",
    corporateTitle: "कॉर्पोरेट इवेंट्स",
    corporateQuote: "सफलता स्टाइल के साथ मनाती है 💼",
    babyshowerTitle: "बेबी शावर",
    babyshowerQuote: "छोटे चमत्कार बड़ी खुशी लाते हैं 👶",
    receptionTitle: "रिसेप्शन पार्टी",
    receptionQuote: "नृत्य करें, भोजन करें, और जीवन मनाएं 🎉",
    
    exploreServices: "हमारी सेवाएं देखें",
    trustedProfessionals: "विश्वसनीय पेशेवर",
    topRatedWorkers: "टॉप रेटेड कार्यकर्ता",
    featuredCategories: "प्रमुख श्रेणियां",
    whyChooseUs: "हमें क्यों चुनें",
    experiencedProfessionals: "अनुभवी पेशेवर",
    experiencedDesc: "हमारे कार्यकर्ताओं के पास अपने क्षेत्र में वर्षों का अनुभव है",
    quickResponse: "तुरंत जवाब",
    quickResponseDesc: "तुरंत जवाब और तेज़ सेवा बुकिंग पाएं",
    verifiedWorkers: "सत्यापित कार्यकर्ता",
    verifiedDesc: "हमारे सभी कार्यकर्ता पूर्ण जांच के बाद सत्यापित हैं",
    affordablePricing: "किफायती मूल्य",
    affordableDesc: "प्रतिस्पर्धी कीमतें बिना किसी छुपी लागत के",
    yearsExperience: "वर्ष का अनुभव",
    projectsCompleted: "पूरे किए गए प्रोजेक्ट",
    rating: "रेटिंग",
    responseTime: "जवाब देने का समय",
    addToCart: "कार्ट में जोड़ें",
    
    // Additional common translations
    loadingCategories: "श्रेणियां लोड हो रही हैं...",
    projects: "प्रोजेक्ट",
    years: "वर्ष",
    experts: "+ विशेषज्ञ",
    profile: "प्रोफ़ाइल",
    fresher: "नया",
    viewAll: "सभी देखें",
    professionals: "पेशेवर",
    
    // Category translations
    "Catering": "कैटरिंग",
    "Photography": "फोटोग्राफी", 
    "Venue": "स्थान",
    "DJ & Music": "डीजे और संगीत",
    "Music & DJ": "संगीत और डीजे",
    "Decoration": "सजावट",
    "Entertainment": "मनोरंजन",
    "Makeup": "मेकअप",
    "Planning": "योजना",
    "Event Planning": "कार्यक्रम योजना"
  },
  te: {
    // Navbar translations
    deliverTo: "డెలివర్ చేయండి",
    searchPlaceholder: "సేవలను వెతకండి...",
    addWorker: "వర్కర్ జోడించు",
    signIn: "సైన్ ఇన్",
    signOut: "సైన్ అవుట్",
    cart: "కార్ట్",
    home: "హోమ్",
    allServices: "అన్ని సేవలు",
    photography: "ఫోటోగ్రఫీ",
    catering: "క్యాటరింగ్",
    decoration: "అలంకరణ",
    musicDj: "సంగీతం & DJ",
    about: "గురించి",
    contact: "సంప్రదింపు",
    
    // Common translations
    welcome: "విబేజోన్‌కు స్వాగతం",
    services: "సేవలు",
    workers: "కార్మికులు",
    bookNow: "ఇప్పుడే బుక్ చేయండి",
    viewDetails: "వివరాలు చూడండి",
    loading: "లోడ్ అవుతోంది...",
    error: "లోపం",
    success: "విజయం",
    
    // Home page translations
    cateringServices: "క్యాటరింగ్ సేవలు",
    cateringDescription: "మీ కార్యక్రమాలకు రుచికరమైన భోజనం",
    photographyServices: "ఫోటోగ్రఫీ",
    photographyDescription: "మీ అమూల్య క్షణాలను దాచుకోండి",
    decorationServices: "అలంకరణ సేవలు",
    decorationDescription: "మీ కార్యక్రమాలకు అందమైన అలంకరణలు",
    venueServices: "వేదిక సేవలు",
    venueDescription: "మీ ప్రత్యేక కార్యక్రమాలకు అందమైన వేదికలు",
    musicDjServices: "సంగీతం & DJ సేవలు",
    musicDjDescription: "మీ వేడుకలకు పర్ఫెక్ట్ సంగీతం",
    
    // Event Categories with Quotes
    weddingTitle: "వివాహ వేడుకలు",
    weddingQuote: "రెండు హృదయాలు, ఒక ఆత్మ, అంతులేని ప్రేమ 💍",
    birthdayTitle: "పుట్టినరోజు వేడుకలు", 
    birthdayQuote: "ఆశీర్వాదాలు మరియు ఆనందం యొక్క మరో సంవత్సరం 🎂",
    engagementTitle: "నిశ్చితార్థ వేడుకలు",
    engagementQuote: "ఎల్లప్పుడూ యొక్క ప్రారంభం ఇక్కడ మొదలవుతుంది 💕",
    anniversaryTitle: "వార్షికోత్సవ వేడుకలు",
    anniversaryQuote: "ప్రేమ సంవత్సరాలు, నిధిగా భావించే జ్ఞాపకాలు 🥂",
    haldiTitle: "హల్దీ వేడుకలు",
    haldiQuote: "బంగారు సంప్రదాయాలు, ఆశీర్వాద ప్రారంభాలు 💛",
    corporateTitle: "కార్పొరేట్ ఈవెంట్లు",
    corporateQuote: "విజయం స్టైల్‌తో జరుపుకుంటుంది 💼",
    babyshowerTitle: "బేబీ షవర్",
    babyshowerQuote: "చిన్న అద్భుతాలు పెద్ద ఆనందం తెస్తాయి 👶",
    receptionTitle: "రిసెప్షన్ పార్టీలు",
    receptionQuote: "నృత్యం చేయండి, భోజనం చేయండి, జీవితాన్ని జరుపుకోండి 🎉",
    
    exploreServices: "మా సేవలను అన్వేషించండి",
    trustedProfessionals: "నమ్మకమైన నిపుణులు",
    topRatedWorkers: "టాప్ రేటెడ్ వర్కర్లు",
    featuredCategories: "ప్రధాన వర్గాలు",
    whyChooseUs: "మమ్మల్ని ఎందుకు ఎంచుకోవాలి",
    experiencedProfessionals: "అనుభవజ్ఞులైన నిపుణులు",
    experiencedDesc: "మా వర్కర్లకు వారి రంగంలో అనేక సంవత్సరాల అనుభవం ఉంది",
    quickResponse: "త్వరిత స్పందన",
    quickResponseDesc: "తక్షణ స్పందనలు మరియు వేగవంతమైన సేవ బుకింగ్ పొందండి",
    verifiedWorkers: "ధృవీకరించబడిన వర్కర్లు",
    verifiedDesc: "మా వర్కర్లందరూ నేపథ్య తనిఖీ చేసి ధృవీకరించబడ్డారు",
    affordablePricing: "సరసమైన ధరలు",
    affordableDesc: "దాచిన ఛార్జీలు లేకుండా పోటీ ధరలు",
    yearsExperience: "సంవత్సరాల అనుభవం",
    projectsCompleted: "పూర్తి చేసిన ప్రాజెక్టులు",
    rating: "రేటింగ్",
    responseTime: "స్పందన సమయం",
    addToCart: "కార్ట్‌కు జోడించండి",
    
    // Additional common translations
    loadingCategories: "వర్గాలు లోడ్ అవుతున్నాయి...",
    projects: "ప్రాజెక్టులు",
    years: "సంవత్సరాలు", 
    experts: "+ నిపుణులు",
    profile: "ప్రొఫైల్",
    fresher: "కొత్తవారు",
    viewAll: "అన్నీ చూడండి",
    professionals: "నిపుణులు",
    
    // Category translations
    "Catering": "క్యాటరింగ్",
    "Photography": "ఫోటోగ్రఫీ", 
    "Venue": "వేదిక",
    "DJ & Music": "డీజే మరియు సంగీతం",
    "Music & DJ": "సంగీతం మరియు డీజే",
    "Decoration": "అలంకరణ",
    "Entertainment": "వినోదం",
    "Makeup": "మేకప్",
    "Planning": "ప్రణాళిక",
    "Event Planning": "ఈవెంట్ ప్రణాళిక"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get language from localStorage or default to 'en'
    return localStorage.getItem('selectedLanguage') || 'en';
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem('selectedLanguage', currentLanguage);
    
    // Update document language attribute
    document.documentElement.lang = currentLanguage;
    
    // Dispatch custom event for components to listen to language changes
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: currentLanguage } 
    }));
  }, [currentLanguage]);

  const setLanguage = (lang: string) => {
    if (lang in translations) {
      setCurrentLanguage(lang);
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[currentLanguage as keyof typeof translations];
    return currentTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;