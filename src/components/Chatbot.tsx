import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Mic, MicOff, Send, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Global type declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionConstructor {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: 'english' | 'hindi' | 'telugu';
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your virtual assistant. I can help you find services, workers, and answer questions in English, Hindi, and Telugu. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      language: 'english'
    }
  ]);

  // Debug: Log when component renders
  console.log('Chatbot rendered:', { isOpen });
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi' | 'telugu'>('english');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Language configurations
  const languageConfig = {
    english: { 
      code: 'en-US', 
      voice: 'en-US',
      greeting: 'Hello! How can I help you?',
      placeholder: 'Type your message...'
    },
    hindi: { 
      code: 'hi-IN', 
      voice: 'hi-IN',
      greeting: 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?',
      placeholder: 'अपना संदेश टाइप करें...'
    },
    telugu: { 
      code: 'te-IN', 
      voice: 'te-IN',
      greeting: 'నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?',
      placeholder: 'మీ సందేశాన్ని టైప్ చేయండి...'
    }
  };

  // Initialize speech synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    console.log('Chatbot initialized:', { synthRef: !!synthRef.current });
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition || 
                              (window as unknown as { SpeechRecognition: typeof SpeechRecognition }).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      console.log('Speech recognition initialized:', !!recognitionRef.current);
    } else {
      console.log('Speech recognition not supported');
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition
  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    recognitionRef.current.lang = languageConfig[selectedLanguage].code;
    setIsListening(true);

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Text to Speech
  const speakText = (text: string, language: 'english' | 'hindi' | 'telugu') => {
    if (!synthRef.current) return;

    // Stop any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageConfig[language].code;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find a voice for the selected language
    const voices = synthRef.current.getVoices();
    const voice = voices.find(v => v.lang.includes(languageConfig[language].voice)) || voices[0];
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Generate bot response based on user input
  const generateResponse = (userMessage: string, language: 'english' | 'hindi' | 'telugu'): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Service-related responses
    if (lowerMessage.includes('catering') || lowerMessage.includes('food') || lowerMessage.includes('खाना') || lowerMessage.includes('ఆహారం')) {
      return language === 'english' ? 
        'I can help you find catering services! We have professional caterers for weddings, parties, and corporate events. Would you like to see our catering professionals?' :
        language === 'hindi' ?
        'मैं आपको कैटरिंग सेवाएं खोजने में मदद कर सकता हूं! हमारे पास शादियों, पार्टियों और कॉर्पोरेट इवेंट्स के लिए पेशेवर कैटरर हैं।' :
        'నేను కేటరింగ్ సేవలను కనుగొనడంలో మీకు సహాయం చేయగలను! మా దగ్గర వివాహాలు, పార్టీలు మరియు కార్పోరేట్ ఈవెంట్‌ల కోసం ప్రొఫెషనల్ క్యాటరర్‌లు ఉన్నారు।';
    }

    if (lowerMessage.includes('dj') || lowerMessage.includes('music') || lowerMessage.includes('संगीत') || lowerMessage.includes('సంగీతం')) {
      return language === 'english' ? 
        'Looking for DJ services? We have experienced DJs for all types of events! They can play various music genres and have professional sound equipment.' :
        language === 'hindi' ?
        'DJ सेवाओं की तलाश कर रहे हैं? हमारे पास सभी प्रकार के इवेंट्स के लिए अनुभवी DJ हैं!' :
        'DJ సేవలు కోసం చూస్तున్నారా? మా దగ్గర అన్ని రకాల ఈవెంట్‌ల కోసం అనుభవజ్ఞులైన DJ లు ఉన్नారు!';
    }

    if (lowerMessage.includes('photography') || lowerMessage.includes('photo') || lowerMessage.includes('फोटो') || lowerMessage.includes('ఫోటో')) {
      return language === 'english' ? 
        'I can help you find professional photographers! We have photographers specializing in weddings, events, portraits, and commercial photography.' :
        language === 'hindi' ?
        'मैं आपको पेशेवर फोटोग्राफर खोजने में मदद कर सकता हूं! हमारे पास विभिन्न प्रकार की फोटोग्राफी में विशेषज्ञ हैं।' :
        'నేను ప్రొఫెషనల్ ఫోటోగ్రాఫర్‌లను కనుగొనడంలో మీకు సహాయం చేయగలను! మా దగ్గర వివాహాలు, ఈవెంట్‌లలో నిపుణులైన ఫోటోగ్రాఫర్‌లు ఉన్నారు.';
    }

    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('मदद') || lowerMessage.includes('సహాయం')) {
      return language === 'english' ? 
        'I can help you with:\n• Finding service providers (DJ, Catering, Photography, etc.)\n• Booking workers for your events\n• Answering questions about our services\n• Navigating the website\n\nWhat would you like to do?' :
        language === 'hindi' ?
        'मैं आपकी इन चीजों में मदद कर सकता हूं:\n• सेवा प्रदाता खोजना\n• इवेंट के लिए वर्कर बुक करना\n• सेवाओं के बारे में सवाल का जवाब\n• वेबसाइट का उपयोग करना' :
        'నేను ఈ విషయాలలో మీకు సహాయం చేయగలను:\n• సేవా ప్రదాతలను కనుగొనడం\n• ఈవెంట్‌ల కోసం వర్కర్‌లను బుక్ చేయడం\n• సేవల గురించి ప్రశ్నలకు సమాధానం\n• వెబ్‌సైట్ నావిగేట్ చేయడం';
    }

    // Default response
    return language === 'english' ? 
      'I understand! Let me help you with that. You can browse our services like Catering, DJ Services, Photography, and more. Is there a specific service you\'re looking for?' :
      language === 'hindi' ?
      'मैं समझ गया! मैं आपकी मदद करता हूं। आप हमारी सेवाएं जैसे कैटरिंग, DJ सेवाएं, फोटोग्राफी देख सकते हैं।' :
      'నేను అర్థం చేసుకున్నాను! నేను మీకు సహాయం చేస్తాను। మీరు మా సేవలైన కేటరింగ్, DJ సేవలు, ఫోటోగ్రఫీ చూడవచ్చు।';
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    console.log('Sending message:', inputText);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate and add bot response
    setTimeout(() => {
      const botResponse = generateResponse(inputText, selectedLanguage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Auto speak bot response
      setTimeout(() => {
        speakText(botResponse, selectedLanguage);
      }, 500);
    }, 1000);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 hover:from-amber-900 hover:via-amber-800 hover:to-amber-700 shadow-lg z-50"
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-6 w-6 text-amber-100" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[32rem] flex flex-col z-50 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 text-amber-100 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Virtual Assistant</CardTitle>
            <p className="text-sm text-white/80">Available in 3 languages</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-amber-100 hover:bg-amber-600/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Language Selector */}
        <div className="flex gap-2 mt-2">
          {(['english', 'hindi', 'telugu'] as const).map((lang) => (
            <Badge
              key={lang}
              variant={selectedLanguage === lang ? "secondary" : "outline"}
              className={`cursor-pointer text-xs ${
                selectedLanguage === lang ? 'bg-amber-100 text-amber-900' : 'border-amber-100 text-amber-100 hover:bg-amber-600/20'
              }`}
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang === 'english' ? 'EN' : lang === 'hindi' ? 'हि' : 'తె'}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100'
                    : 'bg-amber-50 text-amber-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                {!message.isUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-6 px-2 text-xs"
                    onClick={() => speakText(message.text, message.language)}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    {isSpeaking ? 'Speaking...' : 'Speak'}
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={languageConfig[selectedLanguage].placeholder}
              className="flex-1"
            />
            <Button
              onClick={isListening ? stopListening : startListening}
              variant="outline"
              size="sm"
              className={`px-3 ${isListening ? 'bg-red-100 text-red-600' : ''}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button onClick={handleSendMessage} size="sm" className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;