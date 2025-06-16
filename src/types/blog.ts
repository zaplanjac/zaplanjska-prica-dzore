export interface BlogPostType {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured?: boolean;
  authorEmail?: string; // Add author email for filtering posts by author
}

export interface AuthorProfile {
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  joinDate: string;
  postsCount: number;
}