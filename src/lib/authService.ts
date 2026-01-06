// Authentication service for user management

export interface UserProfile {
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  company?: string;
  preferences?: {
    language: string;
    notifications: boolean;
    emailUpdates: boolean;
  };
  avatar?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  eventHistory?: Array<{
    id: string;
    eventType: string;
    date: string;
    workers: string[];
    amount?: number;
  }>;
  favorites?: string[]; // Worker IDs
  updated_at: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: Date;
  profile: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

class AuthService {
  private readonly USER_KEY = 'current_user';
  private readonly USERS_KEY = 'registered_users';
  private readonly USER_PROFILES_KEY = 'user_profiles';

  // Get user-specific storage key
  private getUserStorageKey(userId: string, dataType: string): string {
    return `user_${userId}_${dataType}`;
  }

  // Ensure data isolation - prevent cross-user data access
  private validateUserAccess(userId: string): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.id === userId;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Get current user
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  // Get all registered users (for demo purposes)
  private getRegisteredUsers(): User[] {
    try {
      const usersStr = localStorage.getItem(this.USERS_KEY);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch {
      return [];
    }
  }

  // Save registered users
  private saveRegisteredUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getRegisteredUsers();
      const user = users.find(u => u.email === credentials.email);
      
      if (!user) {
        return { success: false, error: 'User not found. Please register first.' };
      }
      
      // In a real app, you would verify password hash
      // For demo, we'll just check if user exists
      
      // Set current user
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Register user
  async register(userData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getRegisteredUsers();
      
      // Check if user already exists
      if (users.some(u => u.email === userData.email)) {
        return { success: false, error: 'User already exists with this email.' };
      }
      
      // Create new user with default profile
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        created_at: new Date(),
        profile: {
          preferences: {
            language: 'en',
            notifications: true,
            emailUpdates: false
          },
          eventHistory: [],
          favorites: [],
          updated_at: new Date()
        }
      };
      
      // Add to registered users
      users.push(newUser);
      this.saveRegisteredUsers(users);
      
      // Set as current user
      localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Update user profile
  async updateProfile(profileData: Partial<UserProfile>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'No user logged in.' };
      }
      
      // Update user profile with validation
      const updatedProfile: UserProfile = {
        ...currentUser.profile,
        ...profileData,
        updated_at: new Date()
      };
      
      const updatedUser: User = {
        ...currentUser,
        profile: updatedProfile
      };
      
      // Save to current user session
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      
      // Update in registered users list
      const users = this.getRegisteredUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex >= 0) {
        users[userIndex] = updatedUser;
        this.saveRegisteredUsers(users);
      }
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Profile update failed.' };
    }
  }

  // Get user profile (with access validation)
  getUserProfile(userId?: string): UserProfile | null {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return null;
      
      // If userId is provided, validate access
      if (userId && userId !== currentUser.id) {
        console.warn('Access denied: Cannot access another user\'s profile');
        return null;
      }
      
      return currentUser.profile || null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Add worker to favorites
  async addToFavorites(workerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'User not logged in' };
      }
      
      const currentFavorites = currentUser.profile.favorites || [];
      if (currentFavorites.includes(workerId)) {
        return { success: false, error: 'Worker already in favorites' };
      }
      
      const updatedProfile = {
        ...currentUser.profile,
        favorites: [...currentFavorites, workerId],
        updated_at: new Date()
      };
      
      await this.updateProfile(updatedProfile);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to add to favorites' };
    }
  }

  // Remove worker from favorites
  async removeFromFavorites(workerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'User not logged in' };
      }
      
      const currentFavorites = currentUser.profile.favorites || [];
      const updatedFavorites = currentFavorites.filter(id => id !== workerId);
      
      const updatedProfile = {
        ...currentUser.profile,
        favorites: updatedFavorites,
        updated_at: new Date()
      };
      
      await this.updateProfile(updatedProfile);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to remove from favorites' };
    }
  }

  // Add event to user history
  async addEventToHistory(eventData: {
    eventType: string;
    workers: string[];
    amount?: number;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'User not logged in' };
      }
      
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
        date: new Date().toISOString()
      };
      
      const currentHistory = currentUser.profile.eventHistory || [];
      const updatedProfile = {
        ...currentUser.profile,
        eventHistory: [newEvent, ...currentHistory].slice(0, 50), // Keep last 50 events
        updated_at: new Date()
      };
      
      await this.updateProfile(updatedProfile);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to add event to history' };
    }
  }

  // Get user-specific data with access control
  getUserData<T>(userId: string, dataType: string, defaultValue: T): T {
    if (!this.validateUserAccess(userId)) {
      console.warn(`Access denied: User ${userId} cannot access ${dataType}`);
      return defaultValue;
    }
    
    try {
      const key = this.getUserStorageKey(userId, dataType);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  // Set user-specific data with access control
  setUserData<T>(userId: string, dataType: string, data: T): boolean {
    if (!this.validateUserAccess(userId)) {
      console.warn(`Access denied: User ${userId} cannot modify ${dataType}`);
      return false;
    }
    
    try {
      const key = this.getUserStorageKey(userId, dataType);
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();