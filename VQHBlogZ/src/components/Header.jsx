
import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Moon, Sun, Globe, Dice6, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  }, [searchQuery, navigate]);

  const handleRandomPost = useCallback(async () => {
    const { data, error, count } = await supabase.from('posts').select('id', { count: 'exact', head: true });

    if (error || count === 0) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('noPostsFound'),
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * count);
    const { data: randomPostData, error: randomPostError } = await supabase.from('posts').select('id').range(randomIndex, randomIndex).single();

    if (randomPostError || !randomPostData) {
       toast({
        variant: "destructive",
        title: t('error'),
        description: randomPostError?.message || t('noPostsFound'),
      });
      return;
    }
    
    navigate(`/post/${randomPostData.id}`);
    setIsMenuOpen(false);
  }, [navigate, t, toast]);

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/playground', label: t('playground') },
    { to: '/admin', label: t('admin') },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass-effect border-b"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-orbitron font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
            >
              VQHBlogZ
            </motion.h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="hover:text-blue-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 glass-effect"
              />
            </div>
          </form>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRandomPost}
              className="hidden md:flex"
              title={t('randomPost')}
            >
              <Dice6 className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              title={language === 'en' ? '日本語' : 'English'}
            >
              <Globe className="w-5 h-5" />
              <span className="ml-1 text-xs font-bold">
                {language === 'en' ? 'JP' : 'EN'}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 space-y-4"
          >
            <nav className="flex flex-col space-y-2">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className="hover:text-blue-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-effect"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={handleRandomPost} title={t('randomPost')}>
                <Dice6 className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
