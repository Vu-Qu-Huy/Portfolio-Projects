
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Moon, Sun, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = ({ currentView, setCurrentView, favoritesCount, viewMode, setViewMode, darkMode, setDarkMode }) => {
  return (
    <header className="sticky top-0 z-40 glass-effect border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.h1
            className="text-2xl md:text-3xl font-bold gradient-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            InspoVault
          </motion.h1>

          <div className="flex items-center gap-4">
            <Button
              variant={currentView === 'search' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('search')}
              className="hidden sm:flex"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>

            <Button
              variant={currentView === 'favorites' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('favorites')}
              className="relative"
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === 'masonry' ? 'grid' : 'masonry')}
                className="hidden md:flex"
              >
                {viewMode === 'masonry' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
