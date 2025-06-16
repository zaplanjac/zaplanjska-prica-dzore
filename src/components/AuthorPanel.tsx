import React, { useState } from 'react';
import { Plus, Edit, Trash2, LogOut, BookOpen, Save, X, User, Eye, Calendar, Clock } from 'lucide-react';
import { BlogPostType } from '../types/blog';
import { useAuth } from '../hooks/useAuth';
import { t } from '../utils/textConverter';

interface AuthorPanelProps {
  posts: BlogPostType[];
  onAddPost: (post: BlogPostType) => void;
  onUpdatePost: (post: BlogPostType) => void;
  onDeletePost: (postId: string) => void;
}

export const AuthorPanel: React.FC<AuthorPanelProps> = ({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost
}) => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'profile'>('posts');
  const [formData, setFormData] = useState<Partial<BlogPostType>>({
    title: '',
    excerpt: '',
    content: '',
    author: user?.displayName || user?.email || '',
    category: 'Culture',
    image: '',
    featured: false
  });

  const categories = [
    { value: 'Technology', label: 'Технологија' },
    { value: 'Culture', label: 'Култура' },
    { value: 'Environment', label: 'Природа' },
    { value: 'Science', label: 'Наука' },
    { value: 'Philosophy', label: 'Филозофија' }
  ];
  
  // Filter posts by current author (match by email or display name)
  const authorPosts = posts.filter(post => 
    post.authorEmail === user?.email || 
    post.author === user?.displayName || 
    post.author === user?.email
  );

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
      author: user?.displayName || user?.email || '',
      category: 'Culture',
      image: '',
      featured: false
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
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
      author: user?.displayName || user?.email || formData.author!,
      authorEmail: user?.email || '',
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const totalWords = authorPosts.reduce((total, post) => total + post.content.split(' ').length, 0);
  const averageReadTime = authorPosts.length > 0 ? Math.round(totalWords / authorPosts.length / 200) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-amber-600" />
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Читај о Заплању - Аутор панел
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
                <span className="text-sm text-gray-600">
                  {user?.displayName || user?.email}
                </span>
              </div>
              {!isEditing && (
                <button
                  onClick={handleNew}
                  className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Нова прича</span>
                </button>
              )}
              <button
                onClick={handleLogout}
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
          <>
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === 'posts'
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Моје приче
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Профил
              </button>
            </div>

            {activeTab === 'posts' ? (
              /* Posts List */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-serif font-bold text-gray-900">
                    Ваше приче ({authorPosts.length})
                  </h2>
                </div>

                {authorPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Немате објављених прича
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Започните писање ваше прве приче о Заплању
                    </p>
                    <button
                      onClick={handleNew}
                      className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-200"
                    >
                      Напиши прву причу
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {authorPosts.map((post) => (
                      <div key={post.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                post.featured 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {post.featured ? 'Истакнуто' : categories.find(c => c.value === post.category)?.label || post.category}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {post.date}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {post.readTime}
                              </span>
                            </div>
                            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="text-sm text-gray-500">
                              {post.content.split(' ').length} речи
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
                )}
              </div>
            ) : (
              /* Profile Tab */
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-gray-900">Ваш профил</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Profile Info */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'User'} 
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-amber-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {user?.displayName || 'Аноним'}
                        </h3>
                        <p className="text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          О аутору
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Напишите нешто о себи..."
                          defaultValue="Страствени писац који воли да дели приче о Заплању и његовим људима."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Статистике</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">{authorPosts.length}</div>
                        <div className="text-sm text-gray-600">Објављених прича</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{totalWords.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Укупно речи</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{averageReadTime}</div>
                        <div className="text-sm text-gray-600">Просечно читање (мин)</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {authorPosts.filter(p => p.featured).length}
                        </div>
                        <div className="text-sm text-gray-600">Истакнуте приче</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Категорије</h4>
                      <div className="space-y-2">
                        {categories.map(category => {
                          const count = authorPosts.filter(p => p.category === category.value).length;
                          const percentage = authorPosts.length > 0 ? (count / authorPosts.length) * 100 : 0;
                          
                          return (
                            <div key={category.value} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{category.label}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-full bg-amber-500 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-500 w-8">{count}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Edit Form */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                {editingPost ? 'Уреди причу' : 'Нова прича'}
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
                    placeholder="Унесите наслов приче"
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
                    placeholder="Кратак опис приче"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категорија
                  </label>
                  <select
                    value={formData.category || 'Culture'}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
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
                  <p className="text-sm text-gray-500 mt-1">
                    Препоручујемо слике са Pexels или Unsplash
                  </p>
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
                    Истакнута прича
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-serif text-base leading-relaxed"
                  placeholder="Унесите садржај приче... Користите двоструки ентер за нове параграфе."
                />
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>
                    {(formData.content?.split(' ').length || 0).toLocaleString()} речи
                  </span>
                  <span>
                    Приближно време читања: {Math.max(1, Math.ceil((formData.content?.split(' ').length || 0) / 200))} мин
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};