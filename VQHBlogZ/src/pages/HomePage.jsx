
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import BlogCard from '@/components/BlogCard';
import FilterSection from '@/components/FilterSection';
import { supabase } from '@/lib/supabaseClient';

const HomePage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching posts",
          description: error.message,
        });
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(t('goodMorning'));
    } else if (hour < 18) {
      setGreeting(t('goodAfternoon'));
    } else {
      setGreeting(t('goodEvening'));
    }
  }, [t]);

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];
    const searchQuery = searchParams.get('search');

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        (post.title && post.title.toLowerCase().includes(lowercasedQuery)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(lowercasedQuery)) ||
        (post.content && post.content.toLowerCase().includes(lowercasedQuery))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (selectedTag) {
      filtered = filtered.filter(post => post.tags && post.tags.includes(selectedTag));
    }

    return filtered;
  }, [posts, selectedCategory, selectedTag, searchParams]);

  const categories = useMemo(() => [...new Set(posts.map(post => post.category).filter(Boolean))], [posts]);
  const tags = useMemo(() => [...new Set(posts.flatMap(post => post.tags || []).filter(Boolean))], [posts]);

  const handleCategoryChange = useCallback((category) => setSelectedCategory(category), []);
  const handleTagChange = useCallback((tag) => setSelectedTag(tag), []);

  return (
    <>
      <Helmet>
        <title>VQHBlogZ - Modern Technology Insights</title>
        <meta name="description" content="Your ultimate destination for cutting-edge technology insights, tutorials, and community discussions." />
        <meta property="og:title" content="VQHBlogZ - Modern Technology Insights" />
        <meta property="og:description" content="Your ultimate destination for cutting-edge technology insights, tutorials, and community discussions." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-orbitron font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            {greeting}
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl md:text-4xl font-orbitron font-bold mb-6"
          >
            {t('welcome')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </motion.section>

        <FilterSection
          categories={categories}
          tags={tags}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onCategoryChange={handleCategoryChange}
          onTagChange={handleTagChange}
        />

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-3xl font-orbitron font-bold mb-8 text-center">
            {t('latestPosts')}
          </h2>

          {loading ? (
             <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">{t('loading')}</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-muted-foreground">
                {t('noPostsFound')}
              </p>
            </motion.div>
          )}
        </motion.section>
      </div>
    </>
  );
};

export default HomePage;
