import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FilterSection = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange
}) => {
  const { t } = useLanguage();
  const ALL_ITEMS_VALUE = 'all';

  const handleCategoryChange = (value) => {
    if (value === ALL_ITEMS_VALUE) {
      onCategoryChange('');
    } else {
      onCategoryChange(value);
    }
  };

  const handleTagChange = (value) => {
    if (value === ALL_ITEMS_VALUE) {
      onTagChange('');
    } else {
      onTagChange(value);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="mb-12"
    >
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">{t('filterBy')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('allCategories')}
            </label>
            <Select value={selectedCategory || ALL_ITEMS_VALUE} onValueChange={handleCategoryChange}>
              <SelectTrigger className="glass-effect">
                <SelectValue placeholder={t('allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ITEMS_VALUE}>{t('allCategories')}</SelectItem>
                {categories.filter(c => c).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('allTags')}
            </label>
            <Select value={selectedTag || ALL_ITEMS_VALUE} onValueChange={handleTagChange}>
              <SelectTrigger className="glass-effect">
                <SelectValue placeholder={t('allTags')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ITEMS_VALUE}>{t('allTags')}</SelectItem>
                {tags.filter(t => t).map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {(selectedCategory || selectedTag) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCategory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCategoryChange('')}
                className="glass-effect"
              >
                {selectedCategory} ×
              </Button>
            )}
            {selectedTag && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTagChange('')}
                className="glass-effect"
              >
                {selectedTag} ×
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default FilterSection;