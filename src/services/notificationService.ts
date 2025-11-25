import { toast } from 'sonner';

export const notificationService = {
  // Customer Notifications
  customer: {
    orderPlaced: (orderNumber: string) => {
      toast.success('Order Placed!', {
        description: `Your order #${orderNumber} has been confirmed.`,
        duration: 5000,
      });
    },
    
    orderReady: (orderNumber: string) => {
      toast.success('Order Ready! 🎉', {
        description: `Your order #${orderNumber} is ready for pickup.`,
        duration: 7000,
        action: {
          label: 'View Order',
          onClick: () => console.log('View order'),
        },
      });
    },
    
    promotion: (title: string, description: string) => {
      toast('Special Offer! 🎁', {
        description: `${title}: ${description}`,
        duration: 8000,
        action: {
          label: 'View Menu',
          onClick: () => console.log('View menu'),
        },
      });
    },
    
    recommendedCombo: (comboName: string, savings: number) => {
      toast.success('Recommended for You! ⭐', {
        description: `Try our ${comboName} and save £${savings.toFixed(2)}`,
        duration: 6000,
      });
    },
    
    loyaltyReward: (points: number) => {
      toast.success('Loyalty Points Earned! 🏆', {
        description: `You've earned ${points} points with this order.`,
        duration: 5000,
      });
    },
  },

  // Admin Notifications
  admin: {
    lowStock: (itemName: string, quantity: number) => {
      toast.warning('Low Stock Alert! ⚠️', {
        description: `${itemName} is running low (${quantity} remaining). Consider reordering.`,
        duration: 10000,
        action: {
          label: 'Reorder',
          onClick: () => console.log('Reorder', itemName),
        },
      });
    },
    
    forecastDeviation: (percentage: number) => {
      const type = percentage > 0 ? 'above' : 'below';
      toast.warning('Forecast Deviation! 📊', {
        description: `Sales are ${Math.abs(percentage)}% ${type} forecast. Adjust staffing or inventory.`,
        duration: 8000,
      });
    },
    
    topPerformer: (itemName: string, sales: number) => {
      toast.success('Top Performer Alert! 🌟', {
        description: `${itemName} is trending! ${sales} sales today.`,
        duration: 6000,
      });
    },
    
    peakHourAlert: (hour: string, expectedCustomers: number) => {
      toast('Peak Hour Incoming! 🔥', {
        description: `Expect ${expectedCustomers} customers around ${hour}. Ensure adequate staffing.`,
        duration: 10000,
        action: {
          label: 'View Forecast',
          onClick: () => console.log('View forecast'),
        },
      });
    },
    
    newCustomer: (customerName: string) => {
      toast.success('New Customer! 🎊', {
        description: `${customerName} just registered. Send a welcome offer!`,
        duration: 5000,
      });
    },
    
    highValue: (customerName: string, totalSpent: number) => {
      toast.success('High-Value Customer! 💎', {
        description: `${customerName} has spent £${totalSpent}. Consider offering premium rewards.`,
        duration: 7000,
      });
    },
  },

  // General Notifications
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
      duration: 4000,
    });
  },

  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
      duration: 5000,
    });
  },

  info: (title: string, description?: string) => {
    toast.info(title, {
      description,
      duration: 4000,
    });
  },

  warning: (title: string, description?: string) => {
    toast.warning(title, {
      description,
      duration: 5000,
    });
  },
};

// Demo function to showcase notifications
export const showDemoNotifications = (role: 'customer' | 'admin') => {
  if (role === 'customer') {
    setTimeout(() => notificationService.customer.orderPlaced('ORD-123'), 1000);
    setTimeout(() => notificationService.customer.recommendedCombo('Lunch Power Combo', 2.50), 3000);
    setTimeout(() => notificationService.customer.loyaltyReward(25), 5000);
  } else {
    setTimeout(() => notificationService.admin.lowStock('Chicken Breast', 8), 1000);
    setTimeout(() => notificationService.admin.topPerformer('Caesar Salad', 45), 3000);
    setTimeout(() => notificationService.admin.peakHourAlert('12:00 PM', 120), 5000);
  }
};
