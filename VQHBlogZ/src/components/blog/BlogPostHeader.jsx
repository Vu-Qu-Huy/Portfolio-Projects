
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';

const BlogPostHeader = ({ post }) => {
  const postDate = post.created_at || post.date;
  const formattedDate = postDate ? new Date(postDate).toLocaleDateString() : 'N/A';

  return (
    <header className="mb-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
      >
        {post.title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6"
      >
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          {post.category}
        </span>
      </motion.div>

      {post.tags && post.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center space-x-1 bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 px-2 py-1 rounded-full text-sm"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </span>
          ))}
        </motion.div>
      )}

      {post.image && (
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          loading="lazy"
        />
      )}
    </header>
  );
};

export default BlogPostHeader;
