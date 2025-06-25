import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const LoadingScreen = () => {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  
  const dotVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "100%",
    },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };


  return (
    <div className="flex flex-col justify-center items-center h-screen bg-transparent">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
        >
          VQHBlogZ
        </motion.h1>
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center space-x-2"
        >
            <p className="text-xl font-semibold text-muted-foreground">{t('loading')}</p>
            <motion.div className="flex space-x-1">
                <motion.span variants={dotVariants} transition={dotTransition} className="w-2 h-2 bg-blue-500 rounded-full" />
                <motion.span variants={dotVariants} transition={{...dotTransition, delay: 0.2}} className="w-2 h-2 bg-blue-500 rounded-full" />
                <motion.span variants={dotVariants} transition={{...dotTransition, delay: 0.4}} className="w-2 h-2 bg-blue-500 rounded-full" />
            </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;