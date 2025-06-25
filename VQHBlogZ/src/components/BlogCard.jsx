
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';

const BlogCard = ({ post }) => {
  const postDate = post.created_at || post.date;
  const formattedDate = postDate ? new Date(postDate).toLocaleDateString() : 'N/A';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-effect rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
    >
      <Link to={`/post/${post.id}`} className="flex flex-col flex-grow">
        <div className="relative overflow-hidden">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
            />
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 mt-auto">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center space-x-1 bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 px-2 py-1 rounded-full text-xs"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
