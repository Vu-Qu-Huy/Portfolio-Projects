
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Lock, User, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';

const AdminLogin = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin/dashboard');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('loginSuccess'),
      });
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message || t('loginError'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, navigate, t, toast]);

  return (
    <>
      <Helmet>
        <title>{t('adminLogin')} - VQHBlogZ</title>
        <meta name="description" content="Admin login for VQHBlogZ" />
      </Helmet>

      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-150px)]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl font-orbitron font-bold mb-2">
                {t('adminLogin')}
              </h1>
              <p className="text-muted-foreground">
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email"
                    className="pl-10"
                    required
                  />
                </div>
                 <p className="text-xs text-muted-foreground mt-1">
                  Demo email: admin@example.com (Create this user in your Supabase project)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="password">
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t('loading') : t('login')}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
