import { APP_CONFIG } from './config';

// Check if database is configured
export const isDatabaseConfigured = (): boolean => {
  return !!(import.meta.env.VITE_MONGODB_CONNECTION_STRING && 
            import.meta.env.VITE_MONGODB_USERNAME && 
            import.meta.env.VITE_MONGODB_PASSWORD);
};

// Local storage keys for browser-based data persistence
const STORAGE_KEYS = {
  CATEGORIES: 'telugu_workers_categories',
  WORKERS: 'telugu_workers_workers',
  INITIALIZED: 'telugu_workers_initialized'
};

// Data type definitions
export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface Worker {
  id: string;
  name: string;
  category_id: string;
  rating: number;
  experience_years: number;
  location: string;
  phone: string;
  email: string;
  description: string;
  price_range: string;
  skills: string[];
  availability: boolean;
  projects_completed: number;
  response_time: string;
  specialization?: string;
  profile_image_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Sample data for initialization
const SAMPLE_CATEGORIES: Category[] = [
  { id: '1', name: 'Wedding', description: 'Complete wedding planning services', image_url: '/images/wedding/wedding1.jpg' },
  { id: '2', name: 'Birthday', description: 'Birthday party planning services', image_url: '/images/birthday/birthday1.jpg' },
  { id: '3', name: 'Corporate', description: 'Corporate event management', image_url: '/images/corporate/corporate1.jpg' },
  { id: '4', name: 'Anniversary', description: 'Anniversary celebration planning', image_url: '/images/anniversary/anniversary1.jpg' },
  { id: '5', name: 'Engagement', description: 'Engagement ceremony planning', image_url: '/images/engagement/engagement1.jpg' },
  { id: '6', name: 'Reception', description: 'Reception party management', image_url: '/images/reception/reception1.jpg' },
  { id: '7', name: 'Haldi', description: 'Traditional haldi ceremony', image_url: '/images/haldi/haldi1.jpg' },
  { id: '8', name: 'Baby Shower', description: 'Baby shower celebration', image_url: '/images/babyshower/babyshower1.jpg' }
];

const SAMPLE_WORKERS: Worker[] = [
  {
    id: '1',
    name: 'Ravi Kumar',
    category_id: '1',
    rating: 4.8,
    experience_years: 5,
    location: 'Hyderabad',
    phone: '+91 9876543210',
    email: 'ravi@example.com',
    description: 'Expert wedding planner with 5+ years experience',
    price_range: '₹50,000 - ₹2,00,000',
    skills: ['Wedding Planning', 'Decoration', 'Coordination'],
    availability: true,
    projects_completed: 150,
    response_time: 'Within 1 hour',
    specialization: 'Wedding Planning',
    profile_image_url: '/images/workers/worker1.jpg'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    category_id: '2',
    rating: 4.9,
    experience_years: 8,
    location: 'Mumbai',
    phone: '+91 8765432109',
    email: 'priya@example.com',
    description: 'Professional birthday party organizer',
    price_range: '₹15,000 - ₹75,000',
    skills: ['Party Planning', 'Theme Decoration', 'Entertainment'],
    availability: true,
    projects_completed: 200,
    response_time: 'Within 30 minutes',
    specialization: 'Birthday Celebrations',
    profile_image_url: '/images/workers/worker2.jpg'
  },
  {
    id: '3',
    name: 'Arun Reddy',
    category_id: '3',
    rating: 4.7,
    experience_years: 12,
    location: 'Bangalore',
    phone: '+91 7654321098',
    email: 'arun@example.com',
    description: 'Corporate event management specialist',
    price_range: '₹1,00,000 - ₹5,00,000',
    skills: ['Corporate Events', 'Conference Management', 'Team Building'],
    availability: true,
    projects_completed: 95,
    response_time: 'Within 2 hours',
    specialization: 'Corporate Events',
    profile_image_url: '/images/workers/worker3.jpg'
  },
  {
    id: '4',
    name: 'Sunitha Devi',
    category_id: '4',
    rating: 4.6,
    experience_years: 6,
    location: 'Chennai',
    phone: '+91 6543210987',
    email: 'sunitha@example.com',
    description: 'Anniversary celebration planning expert',
    price_range: '₹25,000 - ₹1,00,000',
    skills: ['Anniversary Planning', 'Romantic Setups', 'Photography'],
    availability: true,
    projects_completed: 85,
    response_time: 'Within 1 hour',
    specialization: 'Anniversary Celebrations',
    profile_image_url: '/images/workers/worker4.jpg'
  }
];

// Initialize localStorage with sample data if not already done
const initializeLocalStorage = () => {
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    return; // Already initialized
  }

  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SAMPLE_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(SAMPLE_WORKERS));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  console.log('✅ Local storage initialized with sample data');
};

// Generate unique ID for new entries
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Categories Service with localStorage for browser compatibility
export class CategoriesService {
  static async getAll(): Promise<Category[]> {
    try {
      // Initialize storage if not done
      initializeLocalStorage();
      
      // Get categories from localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const categories = JSON.parse(stored);
        console.log(`✅ Loaded ${categories.length} categories from storage`);
        return categories;
      }
      
      console.log('📂 Using sample categories data (fallback)');
      return SAMPLE_CATEGORIES;
    } catch (error) {
      console.warn('⚠️ Error loading categories, using sample data:', error);
      return SAMPLE_CATEGORIES;
    }
  }

  static async getById(id: string): Promise<Category | null> {
    const categories = await this.getAll();
    return categories.find(cat => cat.id === id) || null;
  }
}

// Workers Service with localStorage for browser compatibility and real data persistence
export class WorkersService {
  static async getAll(): Promise<Worker[]> {
    try {
      // Initialize storage if not done
      initializeLocalStorage();
      
      // Get workers from localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.WORKERS);
      if (stored) {
        const workers = JSON.parse(stored);
        console.log(`✅ Loaded ${workers.length} workers from storage`);
        return workers;
      }
      
      console.log('👥 Using sample workers data (fallback)');
      return SAMPLE_WORKERS;
    } catch (error) {
      console.warn('⚠️ Error loading workers, using sample data:', error);
      return SAMPLE_WORKERS;
    }
  }

  static async getByCategory(categoryId: string): Promise<Worker[]> {
    const workers = await this.getAll();
    return workers.filter(worker => worker.category_id === categoryId);
  }

  static async getFeatured(limit: number = 6): Promise<Worker[]> {
    const workers = await this.getAll();
    return workers
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  static async getById(id: string): Promise<Worker | null> {
    const workers = await this.getAll();
    return workers.find(worker => worker.id === id) || null;
  }

  static async addWorker(workerData: Omit<Worker, 'id' | 'rating' | 'projects_completed' | 'created_at' | 'updated_at'>): Promise<Worker | null> {
    try {
      const workers = await this.getAll();
      
      // Generate new worker with unique ID
      const newWorker: Worker = {
        ...workerData,
        id: generateId(),
        rating: 0, // New workers start with 0 rating
        projects_completed: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Add to workers array
      workers.push(newWorker);
      
      // Save back to localStorage
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
      
      console.log('✅ Worker added successfully:', newWorker.id);
      return newWorker;
    } catch (error) {
      console.error('❌ Error adding worker:', error);
      return null;
    }
  }

  static async updateWorker(id: string, updateData: Partial<Worker>): Promise<Worker | null> {
    try {
      const workers = await this.getAll();
      const index = workers.findIndex(worker => worker.id === id);
      
      if (index === -1) {
        return null;
      }
      
      // Update worker data
      workers[index] = {
        ...workers[index],
        ...updateData,
        updated_at: new Date()
      };
      
      // Save back to localStorage
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
      
      console.log('✅ Worker updated successfully:', id);
      return workers[index];
    } catch (error) {
      console.error('❌ Error updating worker:', error);
      return null;
    }
  }

  static async deleteWorker(id: string): Promise<boolean> {
    try {
      const workers = await this.getAll();
      const filteredWorkers = workers.filter(worker => worker.id !== id);
      
      if (filteredWorkers.length === workers.length) {
        return false; // Worker not found
      }
      
      // Save filtered workers back to localStorage
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(filteredWorkers));
      
      console.log('✅ Worker deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('❌ Error deleting worker:', error);
      return false;
    }
  }
}

// Connection status for debugging
export const getConnectionStatus = async () => {
  const configured = isDatabaseConfigured();
  
  return {
    configured,
    connected: true, // Always connected in browser mode
    message: configured 
      ? 'Using browser storage with database configuration available'
      : 'Using browser storage - Database not configured',
    connectionString: configured 
      ? import.meta.env.VITE_MONGODB_CONNECTION_STRING?.replace(/:[^:@]*@/, ':***@') || 'Not available'
      : 'Not configured'
  };
};

// Log database status for debugging
if (APP_CONFIG.debugMode) {
  getConnectionStatus().then(status => {
    console.log('📊 Data Service Status:', status);
  });
}