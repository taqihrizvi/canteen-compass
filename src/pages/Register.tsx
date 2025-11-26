import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ChefHat, Mail, Lock, User, ArrowLeft, CheckCircle2, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  // Remove register from useAuth since it doesn't exist
  const { isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Registration is disabled - only admins can create users
    setError('Account registration is disabled. Please contact your administrator to create an account.');
    return;
  };

  const benefits = [
    { icon: Sparkles, text: 'Personalized meal recommendations' },
    { icon: TrendingUp, text: 'Track your order history' },
    { icon: Shield, text: 'Secure & private data' }
  ];

  return (
    <div className="min-h-screen flex bg-[#EDF2F9] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Left Side - Branding & Benefits */}
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
              <p className="text-white/80">Join Our Community</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Start your journey to smarter meal choices
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Create your free account and get access to personalized recommendations, exclusive offers, and seamless ordering.
          </p>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white font-medium">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-white/70 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.9★</p>
              <p className="text-white/70 text-sm">User Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-white/70 text-sm">Canteens</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
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
              <CardTitle className="text-3xl font-bold text-center">Account Registration Disabled</CardTitle>
              <CardDescription className="text-center text-base">
                Only administrators can create new user accounts
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>Registration is currently disabled.</strong> For security and access control, 
                    only system administrators can create new user accounts. Please contact your administrator 
                    to get an account created for you.
                  </AlertDescription>
                </Alert>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Already have credentials?</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    If your administrator has created an account for you, you can sign in directly using the login page.
                  </p>
                </div>

                <div className="space-y-2" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                  <Label htmlFor="name" className="text-base">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2" style={{ opacity: 0.5, pointerEvents: 'none' }}>
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

                <div className="space-y-2" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                  <Label htmlFor="password" className="text-base">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                  <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    disabled
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-relaxed text-muted-foreground cursor-pointer"
                  >
                    I agree to the{' '}
                    <Button variant="link" className="px-0 h-auto text-sm" type="button">
                      Terms of Service
                    </Button>
                    {' '}and{' '}
                    <Button variant="link" className="px-0 h-auto text-sm" type="button">
                      Privacy Policy
                    </Button>
                  </label>
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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
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
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-semibold">
                      Sign in instead
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border">
              <p className="text-xl font-bold text-primary">Free</p>
              <p className="text-xs text-muted-foreground">Forever</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border">
              <p className="text-xl font-bold text-primary">Instant</p>
              <p className="text-xs text-muted-foreground">Setup</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border">
              <p className="text-xl font-bold text-primary">Secure</p>
              <p className="text-xs text-muted-foreground">100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
