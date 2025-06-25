import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const PostContent = ({ content }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Find all <pre> blocks with class 'ql-syntax' added by Quill
      const codeBlocks = contentRef.current.querySelectorAll('pre.ql-syntax');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [content]);

  return (
    <motion.div
      ref={contentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="prose dark:prose-invert max-w-none mb-12 blog-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default PostContent;