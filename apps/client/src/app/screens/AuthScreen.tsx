import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { FenixLogo } from '../components/shell';

export default function AuthScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(registerEmail, registerPassword, displayName || undefined);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-atmosphere px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-10 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <section className="border-y border-white/15 py-8">
          <FenixLogo variant="wordmark" tone="light" className="justify-center" />
          <div className="mt-8">
            <p className="font-display text-2xl">Your life, saved securely.</p>
            <p className="mt-2 text-sm text-white/65">Sign in to continue the stories you have built.</p>
          </div>
          <Tabs defaultValue="login" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {error ? (
                <div role="alert" className="mb-4 rounded-md border border-destructive/60 bg-destructive/15 px-3 py-2 text-sm text-white">
                  {error}
                </div>
              ) : null}

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="border-white/25 bg-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      minLength={8}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="border-white/25 bg-white/10 text-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isSubmitting ? 'Signing in…' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Display Name</Label>
                    <Input
                      id="register-name"
                      autoComplete="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Optional"
                      className="border-white/25 bg-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="border-white/25 bg-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="border-white/25 bg-white/10 text-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isSubmitting ? 'Creating account…' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
          </Tabs>
          <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-5 text-xs text-white/55">
            <ShieldCheck className="h-4 w-4 text-fenix-emerald" />
            Your saved lives stay connected to this account.
          </div>
        </section>
      </div>
    </main>
  );
}
