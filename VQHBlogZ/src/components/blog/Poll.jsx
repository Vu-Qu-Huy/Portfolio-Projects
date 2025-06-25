
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const Poll = ({ post, onPollUpdate }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const storageKey = `vqhblogz-voted-posts`;

  useEffect(() => {
    try {
      const votedPosts = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setHasVoted(votedPosts.includes(post.id));
    } catch (e) {
      console.error("Failed to parse voted posts from localStorage", e);
      setHasVoted(false);
    }
  }, [post.id, storageKey]);

  const handleVote = useCallback(async () => {
    if (!selectedOption || hasVoted) return;

    const optionIndex = post.poll.options.indexOf(selectedOption);
    if (optionIndex === -1) return;

    const updatedVotes = [...post.poll.votes];
    updatedVotes[optionIndex]++;

    const updatedPoll = { ...post.poll, votes: updatedVotes };

    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ poll: updatedPoll })
        .eq('id', post.id)
        .select()
        .single();
        
      if (error) throw error;

      onPollUpdate(data);
      const votedPosts = JSON.parse(localStorage.getItem(storageKey) || '[]');
      votedPosts.push(post.id);
      localStorage.setItem(storageKey, JSON.stringify(votedPosts));
      setHasVoted(true);
      toast({ title: t('success'), description: t('voteSubmitted') });
    } catch (error) {
      toast({ variant: 'destructive', title: t('error'), description: error.message });
    }
  }, [selectedOption, hasVoted, post, onPollUpdate, storageKey, t, toast]);

  if (!post.poll || !post.poll.options || !post.poll.votes) return null;

  const totalVotes = post.poll.votes.reduce((sum, v) => sum + v, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="glass-effect rounded-xl p-6 mb-12"
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5" />
        <span>{t('poll')}</span>
      </h3>
      <p className="mb-4">{post.poll.question}</p>
      
      {!hasVoted ? (
        <div className="space-y-3">
          {post.poll.options.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-accent">
              <input
                type="radio"
                name={`poll-${post.id}`}
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-4 h-4"
              />
              <span>{option}</span>
            </label>
          ))}
          <Button onClick={handleVote} disabled={!selectedOption} className="mt-4">
            {t('vote')}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {post.poll.options.map((option, index) => {
            const voteCount = post.poll.votes[index] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes * 100).toFixed(1) : 0;
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <span>{option}</span>
                  <span>{percentage}% ({voteCount})</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          <p className="text-sm text-muted-foreground mt-4">
            {t('totalVotes')}: {totalVotes}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Poll;
