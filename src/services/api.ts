// API Service Layer for Canteen Compass
// This file contains mock API services that can be replaced with real backend calls

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'staff';
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  dietaryPreferences?: string[];
  purchaseHistory?: Purchase[];
}

export interface Purchase {
  id: string;
  userId: string;
  items: MenuItem[];
  total: number;
  date: Date;
  location: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  category: string;
  tags: string[];
  image?: string;
  available: boolean;
}

export interface Forecast {
  date: string;
  predicted: number;
  actual?: number;
  confidence: number;
  factors: ExternalFactor[];
}

export interface ExternalFactor {
  type: 'weather' | 'event' | 'seasonality' | 'dayOfWeek' | 'promotion';
  value: string;
  impact: string;
}

export interface Recommendation {
  itemId: string;
  matchScore: number;
  reasons: string[];
  discount?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  current: number;
  optimal: number;
  unit: string;
  status: 'critical' | 'low' | 'good' | 'overstock';
  usage: 'high' | 'medium' | 'low';
  margin: number;
  costPerUnit: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  preference: string;
  suggestion: string;
  avgSpend: number;
  frequency: string;
}

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            email,
            name: email.split('@')[0],
            role: 'customer',
            loyaltyTier: 'silver',
            dietaryPreferences: ['vegetarian'],
          },
          token: 'mock-jwt-token',
        });
      }, 1000);
    });
  },

  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: Date.now().toString(),
            email,
            name,
            role: 'customer',
            loyaltyTier: 'bronze',
            dietaryPreferences: [],
          },
          token: 'mock-jwt-token',
        });
      }, 1000);
    });
  },

  async logout(): Promise<void> {
    // TODO: Replace with actual API call
    return Promise.resolve();
  },
};

// Recommendations API
export const recommendationsAPI = {
  async getPersonalizedMeals(userId: string): Promise<(MenuItem & { matchScore: number; reasons: string[] })[]> {
    // TODO: Replace with actual ML model API call
    return Promise.resolve([]);
  },

  async getCombos(userId: string): Promise<any[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },

  async getTrending(): Promise<any[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },
};

// Forecast API
export const forecastAPI = {
  async getDailyForecast(days: number = 7): Promise<Forecast[]> {
    // TODO: Replace with Prophet model API call
    return Promise.resolve([]);
  },

  async getHourlyForecast(date: string): Promise<any[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },

  async getCategoryForecast(): Promise<any[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },

  async getStaffingRecommendation(): Promise<any[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },
};

// Inventory API
export const inventoryAPI = {
  async getAll(): Promise<InventoryItem[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },

  async getReorderSuggestions(): Promise<any[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },

  async updateStock(itemId: string, quantity: number): Promise<void> {
    // TODO: Replace with actual API call
    return Promise.resolve();
  },

  async getMarginAnalysis(): Promise<any[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },
};

// Customer API
export const customerAPI = {
  async getSegments(): Promise<CustomerSegment[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },

  async getHighValueCustomers(): Promise<User[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([]);
  },

  async getCustomerAnalytics(userId: string): Promise<any> {
    // TODO: Replace with actual API call
    return Promise.resolve({});
  },
};

// Scenario Simulation API
export const scenarioAPI = {
  async simulatePromotion(params: any): Promise<any> {
    // TODO: Replace with actual simulation model
    return Promise.resolve({});
  },

  async simulateNewProduct(params: any): Promise<any> {
    // TODO: Replace with actual simulation model
    return Promise.resolve({});
  },

  async simulateExternalFactor(params: any): Promise<any> {
    // TODO: Replace with actual simulation model
    return Promise.resolve({});
  },
};

// AI Insights API (OpenAI Integration)
export const aiInsightsAPI = {
  async generateInsight(context: any): Promise<string> {
    // TODO: Replace with OpenAI API call
    return Promise.resolve('AI-generated insight placeholder');
  },

  async generateRecommendations(context: any): Promise<string[]> {
    // TODO: Replace with OpenAI API call
    return Promise.resolve([]);
  },

  async analyzeData(data: any): Promise<any> {
    // TODO: Replace with OpenAI API call
    return Promise.resolve({});
  },
};

// Weather API
export const weatherAPI = {
  async getCurrentWeather(location: string): Promise<any> {
    // TODO: Replace with actual weather API call
    return Promise.resolve({
      temp: 18,
      condition: 'cloudy',
      description: 'Partly cloudy',
    });
  },

  async getForecast(location: string, days: number): Promise<any[]> {
    // TODO: Replace with actual weather API call
    return Promise.resolve([]);
  },
};

// Export all APIs
export default {
  auth: authAPI,
  recommendations: recommendationsAPI,
  forecast: forecastAPI,
  inventory: inventoryAPI,
  customer: customerAPI,
  scenario: scenarioAPI,
  aiInsights: aiInsightsAPI,
  weather: weatherAPI,
};
