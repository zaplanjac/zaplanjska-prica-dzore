import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, LogOut, BookOpen, Save, X, Eye, Shield, User, Users, Mail, Calendar, ToggleLeft, ToggleRight, Download, Upload } from 'lucide-react';
import { BlogPostType } from '../types/blog';
import { useNavigate } from 'react-router-dom';
import { getAllAuthors, AuthorUser, updateAuthor, deleteAuthor, createAuthor } from '../utils/dataManager';
import { exportFileSystemData, importFileSystemData } from '../utils/fileStorage';

interface AdminPanelProps {
  posts: BlogPostType[];
  onAddPost: (post: BlogPostType) => void;
  onUpdatePost: (post: BlogPostType) => void;
  onDeletePost: (postId: string) => void;
  onLogout: () => void;
  userType: 'admin' | 'editor';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onLogout,
  userType
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'authors' | 'backup'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null);
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorUser | null>(null);
  const [authors, setAuthors] = useState<AuthorUser[]>([]);
  
  const [formData, setFormData] = useState<Partial<BlogPostType>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    image: '',
    featured: false
  });

  const [authorFormData, setAuthorFormData] = useState<Partial<AuthorUser>>({
    email: '',
    password: '',
    displayName: '',
    firstName: '',
    lastName: '',
    bio: '',
    isActive: true
  });

  // Load authors on component mount
  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const allAuthors = await getAllAuthors();
      setAuthors(allAuthors);
    } catch (error) {
      console.error('Error loading authors:', error);
    }
  };

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
      category: 'Story', // Default category since we removed categories
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

  // Author management functions
  const handleEditAuthor = (author: AuthorUser) => {
    setEditingAuthor(author);
    setAuthorFormData({
      email: author.email,
      password: author.password,
      displayName: author.displayName,
      firstName: author.firstName,
      lastName: author.lastName,
      bio: author.bio,
      isActive: author.isActive
    });
    setIsEditingAuthor(true);
  };

  const handleNewAuthor = () => {
    setEditingAuthor(null);
    setAuthorFormData({
      email: '',
      password: '',
      displayName: '',
      firstName: '',
      lastName: '',
      bio: '',
      isActive: true
    });
    setIsEditingAuthor(true);
  };

  const handleSaveAuthor = async () => {
    if (!authorFormData.email || !authorFormData.password || !authorFormData.firstName || !authorFormData.lastName) {
      alert('Молимо попуните сва обавезна поља');
      return;
    }

    // Check if email already exists (for new authors)
    if (!editingAuthor) {
      const existingAuthor = authors.find(author => author.email === authorFormData.email);
      if (existingAuthor) {
        alert('Аутор са овом email адресом већ постоји');
        return;
      }
    }

    const authorData: Omit<AuthorUser, 'id' | 'createdAt' | 'lastLogin' | 'postsCount'> = {
      email: authorFormData.email!,
      password: authorFormData.password!,
      displayName: authorFormData.displayName || `${authorFormData.firstName} ${authorFormData.lastName}`,
      firstName: authorFormData.firstName!,
      lastName: authorFormData.lastName!,
      bio: authorFormData.bio || '',
      photoURL: null,
      isActive: authorFormData.isActive !== false
    };

    try {
      if (editingAuthor) {
        await updateAuthor(editingAuthor.id, authorData);
      } else {
        await createAuthor(authorData);
      }
      
      await loadAuthors(); // Reload authors list
      setIsEditingAuthor(false);
      setEditingAuthor(null);
    } catch (error) {
      alert('Грешка при чувању аутора');
      console.error('Error saving author:', error);
    }
  };

  const handleCancelAuthor = () => {
    setIsEditingAuthor(false);
    setEditingAuthor(null);
  };

  const handleDeleteAuthor = async (authorId: string) => {
    const author = authors.find(a => a.id === authorId);
    if (!author) return;

    if (window.confirm(`Да ли сте сигурни да желите да обришете аутора "${author.displayName}"?`)) {
      try {
        await deleteAuthor(authorId);
        await loadAuthors(); // Reload authors list
      } catch (error) {
        alert('Грешка при брисању аутора');
        console.error('Error deleting author:', error);
      }
    }
  };

  const toggleAuthorStatus = async (authorId: string) => {
    const author = authors.find(a => a.id === authorId);
    if (!author) return;

    try {
      await updateAuthor(authorId, { ...author, isActive: !author.isActive });
      await loadAuthors(); // Reload authors list
    } catch (error) {
      alert('Грешка при промени статуса аутора');
      console.error('Error updating author status:', error);
    }
  };

  // Backup and restore functions
  const handleExportData = () => {
    try {
      const data = exportFileSystemData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `citaj-o-zaplanju-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Подаци су успешно извезени!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Грешка при извозу података');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        importFileSystemData(data);
        alert('Подаци су успешно увезени! Освежите страницу да видите промене.');
        // Reset file input
        event.target.value = '';
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Грешка при увозу података. Проверите формат фајла.');
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/'); // Редиректовање на почетну страницу
  };

  // Администратор може да види све постове, едитор само своје
  const visiblePosts = userType === 'admin' ? posts : posts.filter(post => post.author === 'Editor');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-amber-600" />
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  Читај о Заплању - {userType === 'admin' ? 'Админ панел' : 'Едитор панел'}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  {userType === 'admin' ? (
                    <Shield className="w-4 h-4 text-red-600" />
                  ) : (
                    <User className="w-4 h-4 text-blue-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    userType === 'admin' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {userType === 'admin' ? 'Администратор' : 'Едитор'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isEditing && !isEditingAuthor && (
                <>
                  {activeTab === 'posts' && (
                    <button
                      onClick={handleNew}
                      className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Нови пост</span>
                    </button>
                  )}
                  {activeTab === 'authors' && userType === 'admin' && (
                    <button
                      onClick={handleNewAuthor}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Нови аутор</span>
                    </button>
                  )}
                </>
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
        {!isEditing && !isEditingAuthor ? (
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
                Постови
              </button>
              {userType === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('authors')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      activeTab === 'authors'
                        ? 'bg-white text-amber-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Аутори
                  </button>
                  <button
                    onClick={() => setActiveTab('backup')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      activeTab === 'backup'
                        ? 'bg-white text-amber-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Резервне копије
                  </button>
                </>
              )}
            </div>

            {activeTab === 'posts' ? (
              /* Posts List */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-serif font-bold text-gray-900">
                    {userType === 'admin' ? `Сви постови (${visiblePosts.length})` : `Ваши постови (${visiblePosts.length})`}
                  </h2>
                  {userType === 'admin' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                      <p className="text-red-700 text-sm font-medium">
                        Као администратор можете брисати све постове
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-6">
                  {visiblePosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              post.featured 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {post.featured ? 'Истакнуто' : 'Прича'}
                            </span>
                            <span className="text-sm text-gray-500">{post.date}</span>
                            <span className="text-sm text-gray-500">Аутор: {post.author}</span>
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
                          {/* Администратор може да брише све постове, едитор само своје */}
                          {(userType === 'admin' || post.author === 'Editor') && (
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Обриши"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'authors' ? (
              /* Authors List */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-serif font-bold text-gray-900">
                    Управљање ауторима ({authors.length})
                  </h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                    <p className="text-blue-700 text-sm font-medium">
                      Можете додавати, уређивати и брисати ауторе
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {authors.map((author) => (
                    <div key={author.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                              author.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}>
                              {author.firstName.charAt(0)}{author.lastName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-xl font-serif font-bold text-gray-900">
                                {author.displayName}
                              </h3>
                              <p className="text-gray-600">{author.email}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              author.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {author.isActive ? 'Активан' : 'Неактиван'}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <span className="text-sm text-gray-500">Име и презиме:</span>
                              <p className="font-medium">{author.firstName} {author.lastName}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Број постова:</span>
                              <p className="font-medium">{author.postsCount}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Регистрован:</span>
                              <p className="font-medium">{new Date(author.createdAt).toLocaleDateString('sr-RS')}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Последња пријава:</span>
                              <p className="font-medium">
                                {author.lastLogin ? new Date(author.lastLogin).toLocaleDateString('sr-RS') : 'Никад'}
                              </p>
                            </div>
                          </div>
                          
                          {author.bio && (
                            <div className="mb-3">
                              <span className="text-sm text-gray-500">Биографија:</span>
                              <p className="text-gray-700 mt-1">{author.bio}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => toggleAuthorStatus(author.id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              author.isActive 
                                ? 'text-orange-600 hover:bg-orange-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={author.isActive ? 'Деактивирај' : 'Активирај'}
                          >
                            {author.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleEditAuthor(author)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Уреди"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAuthor(author.id)}
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
              /* Backup and Restore */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-serif font-bold text-gray-900">
                    Резервне копије података
                  </h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                    <p className="text-blue-700 text-sm font-medium">
                      Извезите или увезите све податке апликације
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Export Data */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Download className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-gray-900">
                          Извези податке
                        </h3>
                        <p className="text-gray-600">Сачувајте резервну копију</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Извезите све податке (ауторе, постове, админе) у JSON фајл. 
                      Овај фајл можете користити за враћање података или пренос на други сервер.
                    </p>
                    
                    <button
                      onClick={handleExportData}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Извези све податке</span>
                    </button>
                  </div>

                  {/* Import Data */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-gray-900">
                          Увези податке
                        </h3>
                        <p className="text-gray-600">Вратите резервну копију</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Увезите податке из претходно извезеног JSON фајла. 
                      <strong className="text-red-600">Пажња:</strong> Ово ће заменити све тренутне податке!
                    </p>
                    
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="text-yellow-600">⚠️</div>
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">Важно упозорење:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Увоз ће заменити све тренутне податке</li>
                              <li>Препоручујемо да прво извезете тренутне податке</li>
                              <li>После увоза освежите страницу</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Overview */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
                    Преглед података
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">{posts.length}</div>
                      <div className="text-sm text-gray-600">Постова</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{authors.length}</div>
                      <div className="text-sm text-gray-600">Аутора</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {authors.filter(a => a.isActive).length}
                      </div>
                      <div className="text-sm text-gray-600">Активних аутора</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : isEditingAuthor ? (
          /* Author Edit Form */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                {editingAuthor ? 'Уреди аутора' : 'Нови аутор'}
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveAuthor}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Save className="w-5 h-5" />
                  <span>Сачувај</span>
                </button>
                <button
                  onClick={handleCancelAuthor}
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
                    Email адреса *
                  </label>
                  <input
                    type="email"
                    value={authorFormData.email || ''}
                    onChange={(e) => setAuthorFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="autor@example.com"
                    disabled={!!editingAuthor} // Disable email editing for existing authors
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Лозинка *
                  </label>
                  <input
                    type="password"
                    value={authorFormData.password || ''}
                    onChange={(e) => setAuthorFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Унесите лозинку"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Име *
                    </label>
                    <input
                      type="text"
                      value={authorFormData.firstName || ''}
                      onChange={(e) => setAuthorFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Име"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Презиме *
                    </label>
                    <input
                      type="text"
                      value={authorFormData.lastName || ''}
                      onChange={(e) => setAuthorFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Презиме"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Приказно име
                  </label>
                  <input
                    type="text"
                    value={authorFormData.displayName || ''}
                    onChange={(e) => setAuthorFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Како ће се приказивати име (опционо)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Ако није унето, користиће се "Име Презиме"
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={authorFormData.isActive !== false}
                    onChange={(e) => setAuthorFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                    Активан аутор
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Биографија
                </label>
                <textarea
                  value={authorFormData.bio || ''}
                  onChange={(e) => setAuthorFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Кратка биографија аутора..."
                />
              </div>
            </div>
          </div>
        ) : (
          /* Post Edit Form */
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