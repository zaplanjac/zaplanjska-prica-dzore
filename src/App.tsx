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
import { useAuth } from './hooks/useAuth';
import { blogPosts } from './data/blogPosts';
import { BlogPostType } from './types/blog';

export type View = 'home' | 'post';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentPostId, setCurrentPostId] = useState<string>('');
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const { user } = useAuth();

  // Load posts from localStorage on component mount, with fallback to default posts
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        // Ensure we have posts, if not use default
        if (parsedPosts && parsedPosts.length > 0) {
          setPosts(parsedPosts);
        } else {
          setPosts(blogPosts);
          localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        }
      } catch (error) {
        console.error('Error parsing saved posts:', error);
        setPosts(blogPosts);
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
      }
    } else {
      // No saved posts, use default and save them
      setPosts(blogPosts);
      localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
  }, [posts]);

  const handleViewPost = (postId: string) => {
    setCurrentPostId(postId);
    setCurrentView('post');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentPostId('');
    window.scrollTo(0, 0);
  };

  const handleAddPost = (newPost: BlogPostType) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleUpdatePost = (updatedPost: BlogPostType) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const handleAuthorLogin = (user: any) => {
    console.log('Author logged in:', user);
  };

  const currentPost = posts.find(post => post.id === currentPostId);

  return (
    <Router>
      <div className="min-h-screen bg-cream-50 text-gray-900">
        <Routes>
          {/* Main Blog Routes */}
          <Route path="/" element={
            <>
              <Header onBackToHome={handleBackToHome} showBackButton={currentView === 'post'} />
              <main>
                {currentView === 'home' && (
                  <Homepage onViewPost={handleViewPost} posts={posts} />
                )}
                
                {currentView === 'post' && currentPost && (
                  <BlogPost 
                    post={currentPost} 
                    onBackToHome={handleBackToHome}
                    onViewPost={handleViewPost}
                    allPosts={posts}
                  />
                )}
              </main>
              <BackToTop />
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <AdminLogin 
              onLogin={() => setIsAdminAuthenticated(true)}
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
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          } />

          {/* Author Routes */}
          <Route path="/author/login" element={
            <AuthorLogin onLogin={handleAuthorLogin} />
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