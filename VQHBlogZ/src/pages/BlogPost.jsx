
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import ProgressBar from '@/components/ProgressBar';
import BlogPostHeader from '@/components/blog/BlogPostHeader';
import PostContent from '@/components/blog/PostContent';
import TTSControls from '@/components/blog/TTSControls';
import Poll from '@/components/blog/Poll';
import CommentsSection from '@/components/blog/CommentsSection';
import { supabase } from '@/lib/supabaseClient';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const postPromise = supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      const commentsPromise = supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      const [{ data: postData, error: postError }, { data: commentsData, error: commentsError }] = await Promise.all([postPromise, commentsPromise]);

      if (postError) throw postError;
      if (commentsError) throw commentsError;
      
      if (!postData) {
        navigate('/');
        return;
      }

      setPost(postData);
      setComments(commentsData || []);
    } catch (err) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: t('error'),
        description: `Failed to load post: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  }, [id, navigate, t, toast]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const handlePollUpdate = useCallback((updatedPost) => {
    setPost(updatedPost);
  }, []);

  const handleCommentAdded = useCallback((updatedComments) => {
    setComments(updatedComments);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p className="text-xl">{t('error')}: {error}</p>
      </div>
    );
  }
  
  if (!post) {
    return null; 
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - VQHBlogZ</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
      </Helmet>

      <ProgressBar />

      <div className="container mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <BlogPostHeader post={post} />
          <TTSControls content={post.content} />
          <PostContent content={post.content} />
          {post.poll && <Poll post={post} onPollUpdate={handlePollUpdate} />}
          <CommentsSection
            postId={id}
            initialComments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </motion.article>
      </div>
    </>
  );
};

export default BlogPost;
