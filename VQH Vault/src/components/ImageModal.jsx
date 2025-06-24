import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Download, ExternalLink, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ImageModal = ({ selectedImage, setSelectedImage, toggleFavorite, isFavorite, downloadImage, copyAttribution }) => {
  if (!selectedImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setSelectedImage(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <img 
                src={selectedImage.urls.regular}
                alt={selectedImage.alt_description}
                className="w-full h-auto max-h-[60vh] lg:max-h-[80vh] object-contain"
              />
            </div>
            
            <div className="lg:w-96 p-6 space-y-4 overflow-y-auto">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {selectedImage.alt_description || "Untitled Image"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Photo by{' '}
                  <a
                    href={selectedImage.user.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {selectedImage.user.name || "Unknown Artist"}
                  </a>
                </p>
              </div>
              
              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.slice(0, 10).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs"
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => toggleFavorite(selectedImage)}
                  variant={isFavorite(selectedImage.id) ? "destructive" : "default"}
                  className="w-full"
                >
                  <Heart className={cn(
                    "w-4 h-4 mr-2",
                    isFavorite(selectedImage.id) && "fill-current"
                  )} />
                  {isFavorite(selectedImage.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
                
                <Button
                  onClick={() => downloadImage(selectedImage.urls.regular, `${selectedImage.id}.jpg`)}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                
                <Button
                  onClick={() => copyAttribution(selectedImage)}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Attribution
                </Button>
                
                <Button
                  onClick={() => window.open(selectedImage.user.links.html, '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Unsplash
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};