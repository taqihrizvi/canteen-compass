import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ChefHat, Mail, Lock, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);

      // Get the user to check their role
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      toast({
        title: 'Welcome back!',
        description:
          user?.role === 'admin' ? 'Redirecting to Dashboard...' :
            user?.role === 'canteen_manager' ? 'Redirecting to Manager Dashboard...' :
              'Redirecting to Menu...',
      });

      // Redirect based on role
      if (user?.role === 'admin') {
        navigate('/dashboard');
      } else if (user?.role === 'canteen_manager') {
        navigate('/manager/sales');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const demoAccounts = [
    { email: 'admin@canteen.ai', role: 'Admin', description: 'Full dashboard access' },
    { email: 'manager@canteen.ai', role: 'Manager', description: 'Sales & menu management' },
    { email: 'john.smith@student.edu', role: 'Student', description: 'Menu & ordering' }
  ];

  return (
    <div className="min-h-screen flex bg-[#EDF2F9] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#1B56A5] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="relative z-10">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-8"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CanteenAI</h1>
              <p className="text-white/80">AI-Powered Management</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Welcome back to the future of canteen management
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Sign in to access your personalized dashboard, smart recommendations, and powerful analytics.
          </p>

          <div className="space-y-4">
            {[
              'AI-powered demand forecasting',
              'Real-time inventory tracking',
              'Personalized menu recommendations',
              'Advanced analytics & insights'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/70 text-sm">
            Trusted by 500+ canteens worldwide
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            className="lg:hidden mb-6"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-center lg:hidden mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ChefHat className="w-7 h-7 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Demo Accounts Info */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Demo Accounts</span>
                  </div>
                  <div className="space-y-2">
                    {demoAccounts.map((account, index) => (
                      <div key={index} className="flex items-start justify-between text-xs">
                        <div>
                          <p className="font-medium text-blue-900 dark:text-blue-100">{account.email}</p>
                          <p className="text-blue-600 dark:text-blue-400">{account.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {account.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Password: <span className="font-semibold">Admin@123</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-base">Password</Label>
                    <Button variant="link" className="px-0 text-xs text-primary" type="button">
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="relative w-full">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                    or
                  </span>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline font-semibold">
                      Create one now
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing in, you agree to our{' '}
            <Button variant="link" className="px-1 h-auto text-xs" type="button">
              Terms of Service
            </Button>
            and{' '}
            <Button variant="link" className="px-1 h-auto text-xs" type="button">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
