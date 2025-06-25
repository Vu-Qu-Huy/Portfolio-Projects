
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, FileText, Folder, Calendar, Save, X, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import RichTextEditor from '@/components/RichTextEditor';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '', category: '', tags: '', image: '', excerpt: '', content: '', poll: null
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching posts', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        navigate('/admin');
        return;
      }
      fetchPosts();
    };
    checkSessionAndFetch();
  }, [navigate, fetchPosts]);

  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];
  const totalPosts = posts.length;

  const handleCreatePost = useCallback(() => {
    setEditingPost(null);
    setFormData({ title: '', category: '', tags: '', image: '', excerpt: '', content: '', poll: null });
    setIsEditModalOpen(true);
  }, []);

  const handleEditPost = useCallback((post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      tags: post.tags ? post.tags.join(', ') : '',
      image: post.image,
      excerpt: post.excerpt,
      content: post.content,
      poll: post.poll,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleSavePost = useCallback(async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ variant: 'destructive', title: t('error'), description: 'Title and content are required' });
      return;
    }

    const postData = {
      title: formData.title.trim(),
      category: formData.category.trim() || 'General',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      image: formData.image.trim() || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop&q=80`,
      excerpt: formData.excerpt.trim() || formData.content.substring(0, 150).replace(/<[^>]+>/g, '') + '...',
      content: formData.content,
      poll: formData.poll,
    };

    try {
      let result;
      if (editingPost) {
        result = await supabase.from('posts').update(postData).eq('id', editingPost.id).select().single();
      } else {
        result = await supabase.from('posts').insert(postData).select().single();
      }
      
      const { data, error } = result;
      if (error) throw error;

      fetchPosts();
      setIsEditModalOpen(false);
      toast({ title: t('success'), description: t('postSaved') });
    } catch (error) {
      toast({ variant: 'destructive', title: t('error'), description: error.message });
    }
  }, [formData, editingPost, fetchPosts, t, toast]);

  const handleDeletePost = useCallback(async (postId) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
      setPosts(posts.filter(p => p.id !== postId));
      toast({ title: t('success'), description: t('postDeleted') });
    } catch (error) {
      toast({ variant: 'destructive', title: t('error'), description: error.message });
    }
  }, [posts, t, toast]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>{t('dashboard')} - VQHBlogZ Admin</title>
        <meta name="description" content="Admin dashboard for VQHBlogZ" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-orbitron font-bold mb-4 md:mb-0">Admin {t('dashboard')}</h1>
            <div className="flex space-x-4">
              <Button onClick={handleCreatePost}><Plus className="w-4 h-4 mr-2" />{t('createPost')}</Button>
              <Button variant="outline" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-effect rounded-xl p-6 flex items-center space-x-4">
                <FileText className="w-8 h-8 text-blue-400" />
                <div><p className="text-2xl font-bold">{totalPosts}</p><p className="text-muted-foreground">{t('totalPosts')}</p></div>
            </div>
            <div className="glass-effect rounded-xl p-6 flex items-center space-x-4">
                <Folder className="w-8 h-8 text-green-400" />
                <div><p className="text-2xl font-bold">{categories.length}</p><p className="text-muted-foreground">{t('totalCategories')}</p></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">All Posts</h2>
            {loading ? <p>{t('loading')}</p> : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <motion.div key={post.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex-1 mb-4 md:mb-0">
                      <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">{post.category}</span>
                        <span className="flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{new Date(post.created_at).toLocaleDateString()}</span></span>
                        <span>{post.tags ? post.tags.length : 0} tags</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Button onClick={handleCreatePost}><Plus className="w-4 h-4 mr-2" />Create your first post</Button>
              </div>
            )}
          </motion.div>
        </motion.div>
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingPost ? t('editPost') : t('createPost')}</DialogTitle></DialogHeader>
            <div className="space-y-6 py-4">
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder={t('title')} />
              <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder={t('category')} />
              <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Tags (comma-separated)" />
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder={t('imageUrl')} />
              <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder={t('excerpt')} rows={3} />
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder={t('content')}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}><X className="w-4 h-4 mr-2" />{t('cancel')}</Button>
              <Button onClick={handleSavePost}><Save className="w-4 h-4 mr-2" />{t('save')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminDashboard;
