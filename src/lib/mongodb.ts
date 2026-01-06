import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient | null = null;
let database: Db | null = null;

// Get MongoDB connection string from environment
const getConnectionString = (): string => {
  const connectionString = import.meta.env.VITE_MONGODB_CONNECTION_STRING;
  
  if (!connectionString) {
    const username = import.meta.env.VITE_MONGODB_USERNAME;
    const password = import.meta.env.VITE_MONGODB_PASSWORD;
    const clusterUrl = import.meta.env.VITE_MONGODB_CLUSTER_URL;
    const databaseName = import.meta.env.VITE_MONGODB_DATABASE_NAME;
    
    if (!username || !password || !clusterUrl) {
      throw new Error('MongoDB connection details are missing in environment variables');
    }
    
    return `mongodb+srv://${username}:${password}@${clusterUrl}/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;
  }
  
  return connectionString;
};

// Connect to MongoDB
export const connectToMongoDB = async (): Promise<Db> => {
  if (database) {
    return database;
  }

  try {
    const connectionString = getConnectionString();
    const databaseName = import.meta.env.VITE_MONGODB_DATABASE_NAME || 'telugu_workers_hub';
    
    console.log('🔄 Connecting to MongoDB...');
    
    client = new MongoClient(connectionString, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    database = client.db(databaseName);
    
    // Test the connection
    await database.admin().ping();
    console.log('✅ Successfully connected to MongoDB!');
    
    return database;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = (): Db => {
  if (!database) {
    throw new Error('Database not connected. Call connectToMongoDB first.');
  }
  return database;
};

// Get a specific collection
export const getCollection = async <T = Record<string, unknown>>(collectionName: string): Promise<Collection<T>> => {
  const db = await connectToMongoDB();
  return db.collection<T>(collectionName);
};

// Close connection
export const closeMongoDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    database = null;
    console.log('📴 MongoDB connection closed');
  }
};

// Check connection status
export const isConnected = (): boolean => {
  return database !== null;
};

// Initialize sample data if collections are empty
export const initializeSampleData = async (): Promise<void> => {
  try {
    const db = await connectToMongoDB();
    
    // Initialize Categories collection
    const categoriesCollection = await getCollection('categories');
    const categoriesCount = await categoriesCollection.countDocuments();
    
    if (categoriesCount === 0) {
      console.log('📝 Initializing sample categories...');
      const sampleCategories = [
        { _id: '1', name: 'Wedding', description: 'Complete wedding planning services', image_url: '/images/wedding/wedding1.jpg' },
        { _id: '2', name: 'Birthday', description: 'Birthday party planning services', image_url: '/images/birthday/birthday1.jpg' },
        { _id: '3', name: 'Corporate', description: 'Corporate event management', image_url: '/images/corporate/corporate1.jpg' },
        { _id: '4', name: 'Anniversary', description: 'Anniversary celebration planning', image_url: '/images/anniversary/anniversary1.jpg' },
        { _id: '5', name: 'Engagement', description: 'Engagement ceremony planning', image_url: '/images/engagement/engagement1.jpg' },
        { _id: '6', name: 'Reception', description: 'Reception party management', image_url: '/images/reception/reception1.jpg' },
        { _id: '7', name: 'Haldi', description: 'Traditional haldi ceremony', image_url: '/images/haldi/haldi1.jpg' },
        { _id: '8', name: 'Baby Shower', description: 'Baby shower celebration', image_url: '/images/babyshower/babyshower1.jpg' }
      ];
      
      await categoriesCollection.insertMany(sampleCategories);
      console.log('✅ Sample categories inserted');
    }

    // Initialize Workers collection with sample data
    const workersCollection = await getCollection('workers');
    const workersCount = await workersCollection.countDocuments();
    
    if (workersCount === 0) {
      console.log('📝 Initializing sample workers...');
      const sampleWorkers = [
        {
          _id: '1',
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
          profile_image_url: '/images/workers/worker1.jpg',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          _id: '2',
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
          profile_image_url: '/images/workers/worker2.jpg',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          _id: '3',
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
          profile_image_url: '/images/workers/worker3.jpg',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      await workersCollection.insertMany(sampleWorkers);
      console.log('✅ Sample workers inserted');
    }
    
    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
    throw error;
  }
};
