
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    home: 'Home',
    playground: 'Playground',
    admin: 'Admin',
    search: 'Search posts...',
    randomPost: 'Random Post',
    goodMorning: 'Good Morning!',
    goodAfternoon: 'Good Afternoon!',
    goodEvening: 'Good Evening!',
    welcome: 'Welcome to VQHBlogZ',
    subtitle: 'Your ultimate destination for cutting-edge technology insights, tutorials, and community discussions.',
    latestPosts: 'Latest Posts',
    filterBy: 'Filter by',
    allCategories: 'All Categories',
    allTags: 'All Tags',
    noPostsFound: 'No posts found matching your criteria.',
    readingProgress: 'Reading Progress',
    textToSpeech: 'Text-to-Speech',
    play: 'Play',
    pause: 'Pause',
    stop: 'Stop',
    comments: 'Comments',
    addComment: 'Add Comment',
    yourName: 'Your Name',
    yourComment: 'Your Comment',
    submitComment: 'Submit Comment',
    poll: 'Poll',
    vote: 'Vote',
    totalVotes: 'Total Votes',
    playgroundTitle: 'JavaScript Playground',
    playgroundSubtitle: 'Test and experiment with JavaScript code in real-time',
    run: 'Run',
    copy: 'Copy',
    reset: 'Reset',
    output: 'Output',
    adminLogin: 'Admin Login',
    password: 'Password',
    login: 'Login',
    dashboard: 'Dashboard',
    totalPosts: 'Total Posts',
    totalCategories: 'Total Categories',
    createPost: 'Create Post',
    editPost: 'Edit Post',
    title: 'Title',
    category: 'Category',
    tags: 'Tags',
    imageUrl: 'Image URL',
    excerpt: 'Excerpt',
    content: 'Content',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    featureNotImplemented: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    commentAdded: 'Comment added successfully!',
    voteSubmitted: 'Vote submitted successfully!',
    postSaved: 'Post saved successfully!',
    postDeleted: 'Post deleted successfully!',
    loginSuccess: 'Login successful!',
    loginError: 'Invalid credentials!',
    codeCopied: 'Code copied to clipboard!',
    noCommentsYet: 'No comments yet. Be the first to share your thoughts!',
  },
  ja: {
    home: 'ホーム',
    playground: 'プレイグラウンド',
    admin: '管理者',
    search: '投稿を検索...',
    randomPost: 'ランダム投稿',
    goodMorning: 'おはようございます！',
    goodAfternoon: 'こんにちは！',
    goodEvening: 'こんばんは！',
    welcome: 'VQHBlogZへようこそ',
    subtitle: '最先端のテクノロジーの洞察、チュートリアル、コミュニティディスカッションの究極の目的地。',
    latestPosts: '最新の投稿',
    filterBy: 'フィルター',
    allCategories: 'すべてのカテゴリ',
    allTags: 'すべてのタグ',
    noPostsFound: '条件に一致する投稿が見つかりません。',
    readingProgress: '読書進捗',
    textToSpeech: 'テキスト読み上げ',
    play: '再生',
    pause: '一時停止',
    stop: '停止',
    comments: 'コメント',
    addComment: 'コメントを追加',
    yourName: 'お名前',
    yourComment: 'コメント',
    submitComment: 'コメント送信',
    poll: '投票',
    vote: '投票する',
    totalVotes: '総投票数',
    playgroundTitle: 'JavaScriptプレイグラウンド',
    playgroundSubtitle: 'JavaScriptコードをリアルタイムでテストし、実験する',
    run: '実行',
    copy: 'コピー',
    reset: 'リセット',
    output: '出力',
    adminLogin: '管理者ログイン',
    password: 'パスワード',
    login: 'ログイン',
    dashboard: 'ダッシュボード',
    totalPosts: '総投稿数',
    totalCategories: '総カテゴリ数',
    createPost: '投稿作成',
    editPost: '投稿編集',
    title: 'タイトル',
    category: 'カテゴリ',
    tags: 'タグ',
    imageUrl: '画像URL',
    excerpt: '抜粋',
    content: 'コンテンツ',
    save: '保存',
    delete: '削除',
    edit: '編集',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    cancel: 'キャンセル',
    confirm: '確認',
    featureNotImplemented: '🚧 この機能はまだ実装されていません。次のプロンプトでリクエストしてください！🚀',
    commentAdded: 'コメントが正常に追加されました！',
    voteSubmitted: '投票が正常に送信されました！',
    postSaved: '投稿が正常に保存されました！',
    postDeleted: '投稿が正常に削除されました！',
    loginSuccess: 'ログインに成功しました！',
    loginError: '認証情報が無効です！',
    codeCopied: 'コードがクリップボードにコピーされました！',
    noCommentsYet: 'まだコメントはありません。一番乗りで感想をシェアしよう！',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const storedLang = localStorage.getItem('vqhblogz-language');
      return storedLang || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vqhblogz-language', language);
      document.documentElement.lang = language;
    } catch (e) {
      console.error("Failed to set language in localStorage", e);
    }
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ja' : 'en');
  }, []);

  const t = useCallback((key) => {
    return translations[language]?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
