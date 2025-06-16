import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { BlogPostType } from '../types/blog';
import { t, latinToCyrillic, formatSerbianDate } from '../utils/textConverter';

interface BlogPostProps {
  post: BlogPostType;
  onBackToHome: () => void;
  onViewPost: (postId: string) => void;
  allPosts: BlogPostType[];
}

export const BlogPost: React.FC<BlogPostProps> = ({ post, onBackToHome, onViewPost, allPosts }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto px-6 py-8">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-amber-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Article Header */}
      <header className="mb-12 text-center">
        <div className="mb-6">
          <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
            {t(post.category)}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
          {latinToCyrillic(post.title)}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
          {latinToCyrillic(post.excerpt)}
        </p>
        
        <div className="flex items-center justify-center space-x-6 text-gray-500">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span className="font-medium">{latinToCyrillic(post.author)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{formatSerbianDate(post.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{post.readTime.replace('min read', t('min read'))}</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={post.image}
          alt={latinToCyrillic(post.title)}
          className="w-full h-96 object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg prose-gray max-w-none">
        <div className="font-serif text-gray-900 leading-relaxed" style={{ lineHeight: '1.7' }}>
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6 text-lg md:text-xl">
              {latinToCyrillic(paragraph)}
            </p>
          ))}
        </div>
      </div>

      {/* Author Bio */}
      <div className="mt-16 p-8 bg-gray-50 rounded-2xl">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {latinToCyrillic(post.author).charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{latinToCyrillic(post.author)}</h3>
            <p className="text-gray-600 leading-relaxed">
              {latinToCyrillic('A passionate writer exploring the intersection of technology, culture, and human experience. Always seeking to tell stories that matter and connect with readers on a deeper level.')}
            </p>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16">
          <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
            {t('More in')} {t(post.category)}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => onViewPost(relatedPost.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={relatedPost.image}
                    alt={latinToCyrillic(relatedPost.title)}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-serif font-bold text-gray-900 mb-2 leading-tight group-hover:text-amber-700 transition-colors duration-200">
                    {latinToCyrillic(relatedPost.title)}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {relatedPost.readTime.replace('min read', t('min read'))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="mt-16 flex justify-center space-x-4">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('Back to Stories')}</span>
        </button>
      </div>
    </article>
  );
};