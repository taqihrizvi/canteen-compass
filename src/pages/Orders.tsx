import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Package, CheckCircle, XCircle, ChefHat, Search, User, Star, MessageSquare } from 'lucide-react';
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
  student_name: string;
  student_email: string;
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

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderFeedback, setOrderFeedback] = useState<Record<number, Feedback>>({});

  useEffect(() => {
    const loadData = async () => {
      await fetchOrders();
      await fetchAllFeedback();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/orders', {
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
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFeedback = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/feedback', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const feedbackMap: Record<number, Feedback> = {};
        data.forEach((feedback: Feedback) => {
          feedbackMap[feedback.order_id] = feedback;
        });
        setOrderFeedback(feedbackMap);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
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
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.student_id.toString().includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Orders Management</h1>
        <p className="text-muted-foreground">View and manage all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">{orderStats.preparing}</div>
            <p className="text-sm text-muted-foreground">Preparing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{orderStats.ready}</div>
            <p className="text-sm text-muted-foreground">Ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{orderStats.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, customer name, email, or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold mb-2">No orders found</h2>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here when customers place them'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      Order #{order.id}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {order.student_name} (ID: {order.student_id})
                      </span>
                      <span>•</span>
                      <span>{order.student_email}</span>
                      <span>•</span>
                      <span>{formatDate(order.created_at)}</span>
                      <span>•</span>
                      <span>{formatTime(order.created_at)}</span>
                      <span>•</span>
                      <span className="capitalize">{order.payment_method}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{item.menu_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × £{Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <span className="font-semibold">£{(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Special Instructions */}
                  {order.notes && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-semibold mb-1">Special Instructions:</p>
                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="space-y-1 pt-3 border-t">
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

                  {/* Status Actions */}
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <div className="flex gap-2 pt-4">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            <ChefHat className="h-4 w-4 mr-2" />
                            Start Preparing
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            Cancel Order
                          </Button>
                        </>
                      )}
                      {order.status === 'preparing' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Mark as Ready
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Feedback Section - View Only for Managers */}
                  {order.status === 'completed' && orderFeedback[order.id] && (
                    <div className="pt-4 border-t">
                      <div className="bg-muted p-4 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">Customer Feedback</span>
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
                          <p className="text-sm text-muted-foreground">
                            "{orderFeedback[order.id].comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </DashboardLayout>
  );
};

export default Orders;
