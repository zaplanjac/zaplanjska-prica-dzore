// Utility functions for managing user and post data

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'editor';
  displayName: string;
  email: string;
  createdAt: string;
  lastLogin: string | null;
  permissions: string[];
}

export interface AuthorUser {
  id: string;
  email: string;
  password: string;
  displayName: string;
  firstName: string;
  lastName: string;
  bio: string;
  photoURL: string | null;
  createdAt: string;
  lastLogin: string | null;
  isActive: boolean;
  postsCount: number;
}

// Admin/Editor authentication
export const authenticateAdmin = (username: string, password: string): AdminUser | null => {
  // In a real app, this would check against a secure database
  const admins: AdminUser[] = [
    {
      id: "admin-1",
      username: "admin",
      password: "admin2024",
      role: "admin",
      displayName: "Главни администратор",
      email: "admin@citaj-o-zaplanju.rs",
      createdAt: "2024-01-01T00:00:00.000Z",
      lastLogin: null,
      permissions: ["create", "read", "update", "delete", "manage_users"]
    },
    {
      id: "editor-1", 
      username: "editor",
      password: "editor2024",
      role: "editor",
      displayName: "Главни едитор",
      email: "editor@citaj-o-zaplanju.rs",
      createdAt: "2024-01-01T00:00:00.000Z",
      lastLogin: null,
      permissions: ["create", "read", "update"]
    }
  ];

  const user = admins.find(admin => admin.username === username && admin.password === password);
  if (user) {
    // Update last login
    user.lastLogin = new Date().toISOString();
    return user;
  }
  return null;
};

// Author authentication
export const authenticateAuthor = (email: string, password: string): AuthorUser | null => {
  // Get authors from localStorage or use default demo author
  const savedAuthors = localStorage.getItem('authors');
  let authors: AuthorUser[] = [];
  
  if (savedAuthors) {
    try {
      authors = JSON.parse(savedAuthors);
    } catch (error) {
      console.error('Error parsing saved authors:', error);
    }
  }
  
  // Add demo author if not exists
  const demoAuthor: AuthorUser = {
    id: "author-demo-1",
    email: "bilo.koji@email.com",
    password: "password123",
    displayName: "Демо аутор",
    firstName: "Демо",
    lastName: "Аутор",
    bio: "Страствени писац који воли да дели приче о Заплању и његовим људима.",
    photoURL: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: null,
    isActive: true,
    postsCount: 0
  };
  
  if (!authors.find(author => author.email === demoAuthor.email)) {
    authors.push(demoAuthor);
    localStorage.setItem('authors', JSON.stringify(authors));
  }

  const user = authors.find(author => author.email === email && author.password === password && author.isActive);
  if (user) {
    // Update last login
    user.lastLogin = new Date().toISOString();
    // Save updated authors back to localStorage
    localStorage.setItem('authors', JSON.stringify(authors));
    return user;
  }
  return null;
};

// Register new author
export const registerAuthor = (authorData: Omit<AuthorUser, 'id' | 'createdAt' | 'lastLogin' | 'isActive' | 'postsCount'>): AuthorUser => {
  const savedAuthors = localStorage.getItem('authors');
  let authors: AuthorUser[] = [];
  
  if (savedAuthors) {
    try {
      authors = JSON.parse(savedAuthors);
    } catch (error) {
      console.error('Error parsing saved authors:', error);
    }
  }

  const newAuthor: AuthorUser = {
    ...authorData,
    id: `author-${Date.now()}`,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    isActive: true,
    postsCount: 0
  };

  authors.push(newAuthor);
  localStorage.setItem('authors', JSON.stringify(authors));
  
  return newAuthor;
};

// Get all authors
export const getAllAuthors = (): AuthorUser[] => {
  const savedAuthors = localStorage.getItem('authors');
  if (savedAuthors) {
    try {
      return JSON.parse(savedAuthors);
    } catch (error) {
      console.error('Error parsing saved authors:', error);
    }
  }
  return [];
};

// Update author post count
export const updateAuthorPostCount = (authorEmail: string, increment: boolean = true): void => {
  const authors = getAllAuthors();
  const authorIndex = authors.findIndex(author => author.email === authorEmail);
  
  if (authorIndex !== -1) {
    if (increment) {
      authors[authorIndex].postsCount += 1;
    } else {
      authors[authorIndex].postsCount = Math.max(0, authors[authorIndex].postsCount - 1);
    }
    localStorage.setItem('authors', JSON.stringify(authors));
  }
};