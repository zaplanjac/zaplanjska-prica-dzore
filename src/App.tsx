import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Homepage } from './components/Homepage';
import { BlogPost } from './components/BlogPost';
import { BackToTop } from './components/BackToTop';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { AuthorPanel } from './components/AuthorPanel';
import { AuthorLogin } from './components/AuthorLogin';
import { AuthorRegistration } from './components/AuthorRegistration';
import { Authors } from './components/Authors';
import { DevelopmentHistory } from './components/DevelopmentHistory';
import { useAuth } from './hooks/useAuth';
import { blogPosts } from './data/blogPosts';
import { BlogPostType } from './types/blog';
import { getAllPosts, addPost, updatePost, deletePost, initializeData } from './utils/dataManager';

export type View = 'home' | 'post' | 'authors' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentPostId, setCurrentPostId] = useState<string>('');
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'editor'>('editor');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Initialize data and load posts on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Initialize default data if needed
        await initializeData();
        
        // Load posts from persistent storage
        const savedPosts = await getAllPosts();
        
        if (savedPosts && savedPosts.length > 0) {
          setPosts(savedPosts);
        } else {
          // If no saved posts, use default posts and save them
          setPosts(blogPosts);
          // Save default posts to persistent storage
          for (const post of blogPosts) {
            await addPost(post);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to default posts
        setPosts(blogPosts);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const handleViewPost = (postId: string) => {
    setCurrentPostId(postId);
    setCurrentView('post');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentPostId('');
    setSelectedCategory('all'); // Reset category filter when going back to home
    window.scrollTo(0, 0);
  };

  const handleViewAuthors = () => {
    setCurrentView('authors');
    window.scrollTo(0, 0);
  };

  const handleViewHistory = () => {
    setCurrentView('history');
    window.scrollTo(0, 0);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('home'); // Make sure we're on home view when filtering
    window.scrollTo(0, 0);
  };

  const handleAddPost = async (newPost: BlogPostType) => {
    try {
      await addPost(newPost);
      setPosts(prevPosts => [newPost, ...prevPosts]);
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Грешка при додавању поста');
    }
  };

  const handleUpdatePost = async (updatedPost: BlogPostType) => {
    try {
      await updatePost(updatedPost);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Грешка при ажурирању поста');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Грешка при брисању поста');
    }
  };

  const handleAuthorLogin = (user: any) => {
    console.log('Author logged in:', user);
  };

  const handleAdminLogin = (type: 'admin' | 'editor') => {
    setUserType(type);
    setIsAdminAuthenticated(true);
  };

  const currentPost = posts.find(post => post.id === currentPostId);

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Учитавање...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-cream-50 text-gray-900">
        <Routes>
          {/* Main Blog Routes */}
          <Route path="/" element={
            <>
              <Header 
                onBackToHome={handleBackToHome} 
                onViewAuthors={handleViewAuthors}
                onViewHistory={handleViewHistory}
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
                showBackButton={currentView !== 'home'} 
              />
              <main>
                {currentView === 'home' && (
                  <Homepage 
                    onViewPost={handleViewPost} 
                    posts={filteredPosts}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                  />
                )}
                
                {currentView === 'post' && currentPost && (
                  <BlogPost 
                    post={currentPost} 
                    onBackToHome={handleBackToHome}
                    onViewPost={handleViewPost}
                    allPosts={posts}
                  />
                )}

                {currentView === 'authors' && (
                  <Authors posts={posts} onViewPost={handleViewPost} />
                )}

                {currentView === 'history' && (
                  <DevelopmentHistory />
                )}
              </main>
              <BackToTop />
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <AdminLogin 
              onLogin={handleAdminLogin}
              isAuthenticated={isAdminAuthenticated}
            />
          } />
          
          <Route path="/admin" element={
            isAdminAuthenticated ? (
              <AdminPanel 
                posts={posts}
                onAddPost={handleAddPost}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
                onLogout={() => setIsAdminAuthenticated(false)}
                userType={userType}
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          } />

          {/* Author Routes */}
          <Route path="/author/login" element={
            <AuthorLogin onLogin={handleAuthorLogin} />
          } />

          <Route path="/author/register" element={
            <AuthorRegistration />
          } />
          
          <Route path="/author" element={
            user ? (
              <AuthorPanel 
                posts={posts}
                onAddPost={handleAddPost}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
              />
            ) : (
              <Navigate to="/author/login" replace />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;