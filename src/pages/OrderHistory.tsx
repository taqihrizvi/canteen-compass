import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock, Package, CheckCircle, XCircle, ChefHat, Star, MessageSquare, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: number;
  menu_id: number | null;
  menu_name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  student_id: number;
  total_price: number;
  subtotal: number;
  service_fee: number;
  payment_method: string;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

interface Feedback {
  id: number;
  order_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

const OrderHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<Record<number, Feedback>>({});

  useEffect(() => {
    const loadData = async () => {
      await fetchOrders();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      fetchAllFeedback();
    }
  }, [orders.length]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load order history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFeedback = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      // Fetch feedback for each order
      const feedbackPromises = orders.map(async (order) => {
        try {
          const response = await fetch(`http://localhost:3001/api/feedback/order/${order.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          // Only return data if response is ok (200), ignore 404s (no feedback yet)
          if (response.ok) {
            return await response.json();
          }
          // Silently ignore 404 - it just means no feedback exists yet
          return null;
        } catch (error) {
          // Silently ignore errors for individual feedback fetches
          return null;
        }
      });

      const feedbackResults = await Promise.all(feedbackPromises);
      const feedbackMap: Record<number, Feedback> = {};
      feedbackResults.forEach((feedback) => {
        if (feedback) {
          feedbackMap[feedback.order_id] = feedback;
        }
      });
      setOrderFeedback(feedbackMap);
    } catch (error) {
      // Only log critical errors, not individual 404s
      console.error('Error fetching feedback:', error);
    }
  };

  const openFeedbackModal = (orderId: number) => {
    // Only allow opening modal if no feedback exists
    if (orderFeedback[orderId]) {
      return;
    }
    setSelectedOrderId(orderId);
    setFeedbackRating(0);
    setFeedbackComment('');
    setFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setFeedbackModal(false);
    setSelectedOrderId(null);
    setFeedbackRating(0);
    setHoverRating(0);
    setFeedbackComment('');
  };

  const submitFeedback = async () => {
    if (!selectedOrderId || feedbackRating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setSubmittingFeedback(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: selectedOrderId,
          rating: feedbackRating,
          comment: feedbackComment || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: "Success",
        description: "Thank you for your feedback!",
      });

      await fetchAllFeedback();
      closeFeedbackModal();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleReorder = (order: Order) => {
    // Transform order items to cart format
    const cartItems = order.items
      .filter(item => item.menu_id !== null) // Only include menu items, not combos
      .map(item => ({
        id: item.menu_id!,
        name: item.menu_name,
        price: item.price,
        quantity: item.quantity,
        image_url: '', // No image info in order history
        category: '',
        description: '',
        is_available: true,
        prep_time: 0,
        allergens: [],
        calories: 0,
        tags: []
      }));

    if (cartItems.length === 0) {
      toast({
        title: "Cannot reorder",
        description: "This order contains items that are no longer available",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Items added to cart",
      description: `${cartItems.length} item(s) added to your cart`,
    });

    // Navigate to checkout with cart state
    navigate('/checkout', { state: { cart: cartItems } });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'preparing':
        return <ChefHat className="h-5 w-5 text-orange-500" />;
      case 'ready':
        return <Package className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      cancelled: 'destructive',
      preparing: 'secondary',
      ready: 'default',
      pending: 'secondary'
    };
    const colors: Record<string, string> = {
      ready: 'bg-blue-500 text-white hover:bg-blue-600',
      preparing: 'bg-orange-500 text-white hover:bg-orange-600',
    };

    return (
      <Badge variant={variants[status] || 'secondary'} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDF2F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#EDF2F9]">
        <div className="border-b bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-muted-foreground mt-1">
              View your past orders and reorder your favorites
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground">Start ordering from the menu!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF2F9]">
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-1">
            View your past orders and reorder your favorites
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      Order #{order.id}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>{formatDate(order.created_at)}</span>
                      <span>•</span>
                      <span>{formatTime(order.created_at)}</span>
                      <span>•</span>
                      <span className="capitalize">{order.payment_method}</span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.menu_name || 'Item Name Not Available'}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × £{Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <span className="font-semibold">£{(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.notes && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-semibold mb-1">Special Instructions:</p>
                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </div>
                  )}
                  <div className="space-y-1 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>£{Number(order.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Fee:</span>
                      <span>£{Number(order.service_fee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t text-lg font-bold">
                      <span>Total:</span>
                      <span>£{Number(order.total_price).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Feedback Section */}
                  {order.status === 'completed' && (
                    <div className="pt-4 border-t">
                      {orderFeedback[order.id] ? (
                        <div className="bg-muted p-4 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">Your Feedback</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${star <= orderFeedback[order.id].rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                  }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({orderFeedback[order.id].rating}/5)
                            </span>
                          </div>
                          {orderFeedback[order.id].comment && (
                            <p className="text-sm text-muted-foreground mb-2">
                              "{orderFeedback[order.id].comment}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => openFeedbackModal(order.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Add Feedback
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Reorder Button */}
                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => handleReorder(order)}
                      className="w-full"
                      variant="outline"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      <Dialog open={feedbackModal} onOpenChange={setFeedbackModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Feedback</DialogTitle>
            <DialogDescription>
              How was your order? Share your experience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Star Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors ${star <= (hoverRating || feedbackRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    onClick={() => setFeedbackRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
                {feedbackRating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {feedbackRating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Comment (Optional)
              </label>
              <Textarea
                placeholder="Tell us about your experience..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="min-h-[100px] bg-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeFeedbackModal}
              disabled={submittingFeedback}
            >
              Cancel
            </Button>
            <Button
              onClick={submitFeedback}
              disabled={submittingFeedback || feedbackRating === 0}
            >
              {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderHistory;
