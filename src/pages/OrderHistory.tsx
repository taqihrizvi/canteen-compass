import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, CheckCircle, XCircle } from 'lucide-react';

const OrderHistory = () => {
  const { user } = useAuth();

  const orders = [
    {
      id: 'ORD-001',
      date: '2025-11-24',
      time: '12:30 PM',
      status: 'completed',
      items: [
        { name: 'Chicken Curry with Rice', quantity: 1, price: 8.99 },
        { name: 'Greek Yogurt Parfait', quantity: 1, price: 4.99 }
      ],
      total: 14.48
    },
    {
      id: 'ORD-002',
      date: '2025-11-23',
      time: '1:15 PM',
      status: 'completed',
      items: [
        { name: 'Vegetarian Buddha Bowl', quantity: 1, price: 6.99 },
        { name: 'Acai Bowl', quantity: 1, price: 7.49 }
      ],
      total: 14.98
    },
    {
      id: 'ORD-003',
      date: '2025-11-22',
      time: '12:00 PM',
      status: 'completed',
      items: [
        { name: 'Fish & Chips', quantity: 1, price: 9.99 }
      ],
      total: 10.49
    },
    {
      id: 'ORD-004',
      date: '2025-11-21',
      time: '1:45 PM',
      status: 'cancelled',
      items: [
        { name: 'Margherita Pizza Slice', quantity: 2, price: 7.00 }
      ],
      total: 7.50
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      cancelled: 'destructive',
      pending: 'secondary'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
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
                      <span>{order.date}</span>
                      <span>•</span>
                      <span>{order.time}</span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">£{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 text-lg font-bold">
                    <span>Total:</span>
                    <span>£{order.total.toFixed(2)}</span>
                  </div>
                </div>
                {order.status === 'completed' && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Package className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                    <Button variant="outline" size="sm">
                      View Receipt
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
