import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Wallet, Building2, CheckCircle2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  // Get cart from location state or empty array
  const cart: CartItem[] = location.state?.cart || [];
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = 0.50;
  const total = subtotal + serviceFee;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      const orderData = {
        items: cart,
        subtotal: subtotal,
        serviceFee: serviceFee,
        total: total,
        paymentMethod: paymentMethod,
        notes: orderNotes
      };

      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${order.id} has been confirmed and will be ready soon.`,
      });
      
      // Navigate to orders page to see the order
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some items to your cart before checking out</p>
              <Button onClick={() => navigate('/menu')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/menu')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Review your order and complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details and Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start justify-between py-3 border-b last:border-0">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{item.title}</h4>
                            {item.category === 'Combo' && (
                              <Badge variant="secondary" className="mt-1">Combo Deal</Badge>
                            )}
                          </div>
                          <span className="font-semibold ml-4">£{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          £{item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">Pay with your card</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Campus Wallet</p>
                        <p className="text-sm text-muted-foreground">Use your campus balance</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Pay at Counter</p>
                        <p className="text-sm text-muted-foreground">Pay when you collect</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="bg-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" className="bg-white" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" className="bg-white" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
                <CardDescription>Any special requests or dietary notes?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., No onions, extra sauce..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="bg-white min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Total */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>£{serviceFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">Ready in 10-15 minutes</p>
                      <p className="text-muted-foreground">We'll notify you when your order is ready</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
