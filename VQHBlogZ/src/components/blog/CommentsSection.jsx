
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CommentsSection = ({ postId, initialComments, onCommentAdded }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.message.trim()) return;
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author: newComment.name.trim(),
          content: newComment.message.trim()
        })
        .select()
        .single();

      if (error) throw error;

      const newCommentsList = [...comments, data];
      setComments(newCommentsList);
      onCommentAdded(newCommentsList);
      setNewComment({ name: '', message: '' });
      toast({ title: t('success'), description: t('commentAdded') });
    } catch (error) {
      toast({ variant: 'destructive', title: t('error'), description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }, [newComment, postId, comments, onCommentAdded, t, toast]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="glass-effect rounded-xl p-6 mt-12"
    >
      <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
        <MessageCircle className="w-5 h-5" />
        <span>{t('comments')} ({comments.length})</span>
      </h3>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <h4 className="text-lg font-medium">{t('addComment')}</h4>
        <div className="grid grid-cols-1">
          <Input
            placeholder={t('yourName')}
            value={newComment.name}
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            required
            disabled={isSubmitting}
            aria-label={t('yourName')}
          />
        </div>
        <Textarea
          placeholder={t('yourComment')}
          value={newComment.message}
          onChange={(e) => setNewComment({ ...newComment, message: e.target.value })}
          rows={4}
          required
          disabled={isSubmitting}
          aria-label={t('yourComment')}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('loading') : t('submitComment')}
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-muted-foreground whitespace-pre-wrap break-words">{comment.content}</p>
          </motion.div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {t('noCommentsYet')}
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default CommentsSection;
