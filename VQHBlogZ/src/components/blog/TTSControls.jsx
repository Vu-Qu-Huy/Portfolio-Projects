
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const TTSControls = ({ content }) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (synth) {
      setSpeechSynthesis(synth);
      synth.onvoiceschanged = () => {
        // Voices loaded
      };
    }
    
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, []);

  const handleTTS = useCallback((action) => {
    if (!speechSynthesis || !content) return;

    switch (action) {
      case 'play':
        if (isPaused) {
          speechSynthesis.resume();
        } else {
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(content.replace(/<[^>]+>/g, ''));
          utterance.lang = document.documentElement.lang || 'en-US';
          utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
          };
          utterance.onerror = () => {
            setIsPlaying(false);
            setIsPaused(false);
          };
          speechSynthesis.speak(utterance);
        }
        setIsPlaying(true);
        setIsPaused(false);
        break;
      case 'pause':
        speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
        break;
      case 'stop':
        speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        break;
      default:
        break;
    }
  }, [speechSynthesis, content]);

  if (!speechSynthesis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="tts-controls glass-effect rounded-lg p-4 mb-8"
    >
      <h3 className="text-lg font-semibold mb-3">{t('textToSpeech')}</h3>
      <div className="flex space-x-2">
        <Button
          variant={isPlaying ? "secondary" : "default"}
          size="sm"
          onClick={() => handleTTS('play')}
          disabled={isPlaying && !isPaused}
          aria-label={t('play')}
        >
          <Play className="w-4 h-4 mr-2" />
          {t('play')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleTTS('pause')}
          disabled={!isPlaying}
          aria-label={t('pause')}
        >
          <Pause className="w-4 h-4 mr-2" />
          {t('pause')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTTS('stop')}
          disabled={!isPlaying && !isPaused}
          aria-label={t('stop')}
        >
          <Square className="w-4 h-4 mr-2" />
          {t('stop')}
        </Button>
      </div>
    </motion.div>
  );
};

export default TTSControls;
