
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TRENDING_TAGS } from '@/config/constants';

export const SearchSection = ({ searchQuery, setSearchQuery, handleSearch, handleTagClick, loading }) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          Discover Beautiful Photography
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Search, save, and get inspired by stunning images from talented photographers worldwide
        </p>

        <form onSubmit={handleSearch} className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for mountains, cities, nature..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:border-purple-500 focus:outline-none transition-all duration-300"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
            <Tag className="w-5 h-5" />
            Trending Inspiration
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {TRENDING_TAGS.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900 transition-all duration-300 border border-purple-200 dark:border-purple-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
