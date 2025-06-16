import React, { useState } from 'react';
import { Plus, Edit, Trash2, LogOut, BookOpen, Save, X, Eye } from 'lucide-react';
import { BlogPostType } from '../types/blog';
import { t } from '../utils/textConverter';

interface AdminPanelProps {
  posts: BlogPostType[];
  onAddPost: (post: BlogPostType) => void;
  onUpdatePost: (post: BlogPostType) => void;
  onDeletePost: (postId: string) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onLogout
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPostType>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Technology',
    image: '',
    featured: false
  });

  const categories = ['Technology', 'Culture', 'Environment', 'Science', 'Philosophy'];

  const handleEdit = (post: BlogPostType) => {
    setEditingPost(post);
    setFormData(post);
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'Technology',
      image: '',
      featured: false
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.author) {
      alert('Молимо попуните сва обавезна поља');
      return;
    }

    const now = new Date();
    const serbianMonths = [
      'јануар', 'фебруар', 'март', 'април', 'мај', 'јун',
      'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'
    ];
    
    const currentDate = `${now.getDate()} ${serbianMonths[now.getMonth()]} ${now.getFullYear()} год`;
    const readTime = Math.max(1, Math.ceil(formData.content!.split(' ').length / 200));

    const postData: BlogPostType = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.title!,
      excerpt: formData.excerpt!,
      content: formData.content!,
      author: formData.author!,
      date: editingPost?.date || currentDate,
      readTime: `${readTime} min read`,
      category: formData.category!,
      image: formData.image || 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1600',
      featured: formData.featured || false
    };

    if (editingPost) {
      onUpdatePost(postData);
    } else {
      onAddPost(postData);
    }

    setIsEditing(false);
    setEditingPost(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleDelete = (postId: string) => {
    if (window.confirm('Да ли сте сигурни да желите да обришете овај пост?')) {
      onDeletePost(postId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-amber-600" />
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                {t('Readwell')} - Админ панел
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNew}
                className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Нови пост</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Одјави се</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!isEditing ? (
          /* Posts List */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif font-bold text-gray-900">Постови ({posts.length})</h2>
            </div>

            <div className="grid gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          post.featured 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.featured ? 'Истакнуто' : t(post.category)}
                        </span>
                        <span className="text-sm text-gray-500">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Уреди"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Обриши"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Edit Form */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                {editingPost ? 'Уреди пост' : 'Нови пост'}
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Save className="w-5 h-5" />
                  <span>Сачувај</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                  <span>Откажи</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Наслов *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Унесите наслов поста"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Кратак опис *
                  </label>
                  <textarea
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Кратак опис поста"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Аутор *
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Име аутора"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категорија
                  </label>
                  <select
                    value={formData.category || 'Technology'}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {t(category)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL слике
                  </label>
                  <input
                    type="url"
                    value={formData.image || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                    Истакнути пост
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Садржај *
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                  placeholder="Унесите садржај поста... Користите двоструки ентер за нове параграфе."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Приближно време читања: {Math.max(1, Math.ceil((formData.content?.split(' ').length || 0) / 200))} мин
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};