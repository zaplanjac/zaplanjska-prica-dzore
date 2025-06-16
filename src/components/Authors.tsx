import React, { useState } from 'react';
import { User, BookOpen, Calendar, TrendingUp, Search, Filter, Mail, MapPin } from 'lucide-react';
import { BlogPostType } from '../types/blog';
import { t, latinToCyrillic } from '../utils/textConverter';

interface AuthorsProps {
  posts: BlogPostType[];
  onViewPost: (postId: string) => void;
}

export const Authors: React.FC<AuthorsProps> = ({ posts, onViewPost }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'posts' | 'recent'>('posts');

  // Extract unique authors from posts
  const authors = posts.reduce((acc, post) => {
    const authorKey = post.authorEmail || post.author;
    if (!acc[authorKey]) {
      acc[authorKey] = {
        name: post.author,
        email: post.authorEmail || '',
        posts: [],
        totalWords: 0,
        categories: new Set<string>(),
        latestPost: post.date
      };
    }
    
    acc[authorKey].posts.push(post);
    acc[authorKey].totalWords += post.content.split(' ').length;
    acc[authorKey].categories.add(post.category);
    
    // Update latest post date
    if (new Date(post.date) > new Date(acc[authorKey].latestPost)) {
      acc[authorKey].latestPost = post.date;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const authorsList = Object.values(authors).filter(author => 
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort authors
  const sortedAuthors = [...authorsList].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'posts':
        return b.posts.length - a.posts.length;
      case 'recent':
        return new Date(b.latestPost).getTime() - new Date(a.latestPost).getTime();
      default:
        return 0;
    }
  });

  const totalAuthors = authorsList.length;
  const totalPosts = posts.length;
  const averagePostsPerAuthor = totalAuthors > 0 ? Math.round(totalPosts / totalAuthors) : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <section className="text-center mb-12">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <User className="w-8 h-8 text-amber-600" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            Наши аутори
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Упознајте талентоване писце који деле своје приче о Заплању, његовим људима и култури.
        </p>
      </section>

      {/* Statistics */}
      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{totalAuthors}</div>
            <div className="text-gray-600">Активних аутора</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{totalPosts}</div>
            <div className="text-gray-600">Објављених прича</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{averagePostsPerAuthor}</div>
            <div className="text-gray-600">Просечно по аутору</div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Претражи ауторе..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'posts' | 'recent')}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                <option value="posts">Сортирај по броју прича</option>
                <option value="name">Сортирај по имену</option>
                <option value="recent">Сортирај по активности</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Authors Grid */}
      <section>
        {sortedAuthors.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Нема аутора који одговарају претрази
            </h3>
            <p className="text-gray-500">
              Покушајте са другачијим термином претраге
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAuthors.map((author, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  {/* Author Avatar */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {latinToCyrillic(author.name).charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-gray-900">
                        {latinToCyrillic(author.name)}
                      </h3>
                      {author.email && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Mail className="w-4 h-4 mr-1" />
                          {author.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Author Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">{author.posts.length}</div>
                      <div className="text-sm text-gray-600">Прича</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(author.totalWords / 1000)}к
                      </div>
                      <div className="text-sm text-gray-600">Речи</div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Категорије:</h4>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(author.categories).map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {t(category)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Latest Activity */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Последња активност: {author.latestPost}</span>
                  </div>

                  {/* Recent Posts */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Најновије приче:</h4>
                    <div className="space-y-2">
                      {author.posts.slice(0, 2).map((post: BlogPostType) => (
                        <button
                          key={post.id}
                          onClick={() => onViewPost(post.id)}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-amber-700">
                            {latinToCyrillic(post.title)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {post.readTime} • {post.date}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* View All Posts Button */}
                  {author.posts.length > 2 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium">
                        Погледај све приче ({author.posts.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="mt-16">
        <div className="bg-gradient-to-r from-amber-50 to-cream-100 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Желите да постанете аутор?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Придружите се нашој заједници писаца и поделите ваше приче о Заплању. 
            Свако има причу коју вреди испричати.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/author/login"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors duration-200"
            >
              Пријавите се као аутор
            </a>
            <a
              href="/author/register"
              className="bg-white text-amber-600 px-6 py-3 rounded-lg font-medium border border-amber-600 hover:bg-amber-50 transition-colors duration-200"
            >
              Региструјте се
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};