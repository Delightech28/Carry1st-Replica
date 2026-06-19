import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Lock, Mail, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const success = await login(email.trim(), password);
      if (success) {
        navigate(redirect);
      } else {
        setErrorMsg('Invalid email or password.');
        setIsLoading(false);
      }
    } catch {
      setErrorMsg('Sign-in timeout. Please verify your connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/5 rounded-full blur-[90px] pointer-events-none" />
      
      <Card className="max-w-[420px] w-full bg-[#101018] border-white/5 shadow-2xl rounded-2xl overflow-hidden relative">
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 w-full" />
        
        <CardHeader className="p-6 text-center space-y-1">
          <div className="bg-indigo-600/10 p-2.5 rounded-2xl w-11 h-11 flex items-center justify-center text-indigo-400 border border-indigo-500/10 mx-auto mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-extrabold text-white tracking-tight">
            Sign In
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Access your digital top-up profile and order history.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="px-6 pb-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4.5 h-4.5" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="pl-10 h-10.5 bg-[#0a0a0f] border-white/5 text-gray-200 placeholder:text-gray-600 rounded-xl text-xs font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-medium uppercase tracking-wider flex justify-between">
                <span>Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4.5 h-4.5" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10.5 bg-[#0a0a0f] border-white/5 text-gray-200 placeholder:text-gray-600 rounded-xl text-xs font-sans"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#181825] hover:bg-[#202035] border border-white/5 text-white rounded-xl py-5 shadow-lg relative group transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
            
            <p className="text-center text-xs text-gray-500 font-sans">
              New to Carry1st?{' '}
              <Link to={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-indigo-400 hover:text-white hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
export default LoginView;
