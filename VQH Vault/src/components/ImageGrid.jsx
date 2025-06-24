import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ImageGrid = ({ images, viewMode, setSelectedImage, toggleFavorite, isFavorite, loading, hasMore, loadMore, currentView }) => {
  if (images.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-2xl font-bold mb-2">
          {currentView === 'favorites' ? 'No favorites yet' : 'No images found'}
        </h3>
        <p className="text-muted-foreground">
          {currentView === 'favorites' 
            ? 'Start exploring and save images you love!'
            : 'Try searching for something else or check out trending tags above.'
          }
        </p>
      </motion.div>
    );
  }
  
  return (
    <section className="container mx-auto px-4 pb-8">
      {currentView === 'favorites' && images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold gradient-text mb-4">Your Favorites</h2>
          <p className="text-muted-foreground">
            {`${images.length} saved image${images.length !== 1 ? 's' : ''} in your collection`}
          </p>
        </motion.div>
      )}
      
      <div className={cn(
        viewMode === 'masonry' ? 'masonry-grid' : 'image-grid'
      )}>
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={`${image.id}-${index}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer",
                viewMode === 'masonry' ? 'masonry-item' : ''
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image.urls.small}
                alt={image.alt_description}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-sm mb-2 truncate">
                    {image.alt_description}
                  </p>
                  <p className="text-white/80 text-xs">
                    by {image.user.name}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(image);
                  }}
                  className={cn(
                    "absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300",
                    isFavorite(image.id) 
                      ? "bg-red-500 text-white" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  )}
                >
                  <Heart className={cn(
                    "w-4 h-4",
                    isFavorite(image.id) && "fill-current"
                  )} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {currentView === 'search' && hasMore && images.length > 0 && (
        <div className="text-center mt-8">
          <Button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 text-lg rounded-xl"
          >
            {loading ? 'Loading...' : 'Load More Images'}
          </Button>
        </div>
      )}
    </section>
  );
};