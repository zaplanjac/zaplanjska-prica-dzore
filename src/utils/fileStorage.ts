// Utility functions for persistent file storage
import { BlogPostType } from '../types/blog';

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

// File paths for data storage
const DATA_PATHS = {
  authors: '/src/data/users/authors.json',
  admins: '/src/data/passwords-editors.json',
  posts: '/src/data/published-posts/posts.json'
};

// Helper function to read JSON file
const readJSONFile = async (filePath: string): Promise<any> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to read file: ${filePath}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

// Helper function to write JSON file (simulated - in real app would use API)
const writeJSONFile = async (filePath: string, data: any): Promise<void> => {
  try {
    // In a real application, this would make an API call to save the file
    // For now, we'll use localStorage as a fallback but also log the data structure
    console.log(`Writing to ${filePath}:`, JSON.stringify(data, null, 2));
    
    // Store in localStorage with file path as key for persistence
    const storageKey = filePath.replace('/src/data/', '').replace('.json', '');
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    // Also store in a special key for file system simulation
    const fileSystemData = JSON.parse(localStorage.getItem('fileSystem') || '{}');
    fileSystemData[filePath] = data;
    localStorage.setItem('fileSystem', JSON.stringify(fileSystemData));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
};

// Authors management
export const loadAuthors = async (): Promise<AuthorUser[]> => {
  // First try to load from simulated file system
  const fileSystemData = JSON.parse(localStorage.getItem('fileSystem') || '{}');
  if (fileSystemData[DATA_PATHS.authors]) {
    return fileSystemData[DATA_PATHS.authors].authors || [];
  }
  
  // Fallback to localStorage
  const localData = localStorage.getItem('users/authors');
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      return parsed.authors || [];
    } catch (error) {
      console.error('Error parsing authors from localStorage:', error);
    }
  }
  
  // Fallback to default data
  try {
    const defaultData = await readJSONFile(DATA_PATHS.authors);
    if (defaultData && defaultData.authors) {
      return defaultData.authors;
    }
  } catch (error) {
    console.error('Error loading default authors:', error);
  }
  
  // Return empty array if all else fails
  return [];
};

export const saveAuthors = async (authors: AuthorUser[]): Promise<void> => {
  const data = { authors };
  await writeJSONFile(DATA_PATHS.authors, data);
};

export const createAuthor = async (authorData: Omit<AuthorUser, 'id' | 'createdAt' | 'lastLogin' | 'postsCount'>): Promise<AuthorUser> => {
  const authors = await loadAuthors();
  
  // Check if email already exists
  if (authors.find(author => author.email === authorData.email)) {
    throw new Error('Author with this email already exists');
  }

  const newAuthor: AuthorUser = {
    ...authorData,
    id: `author-${Date.now()}`,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    postsCount: 0
  };

  authors.push(newAuthor);
  await saveAuthors(authors);
  
  return newAuthor;
};

export const updateAuthor = async (authorId: string, updateData: Partial<Omit<AuthorUser, 'id' | 'createdAt'>>): Promise<void> => {
  const authors = await loadAuthors();
  const authorIndex = authors.findIndex(author => author.id === authorId);
  
  if (authorIndex === -1) {
    throw new Error('Author not found');
  }

  authors[authorIndex] = {
    ...authors[authorIndex],
    ...updateData
  };

  await saveAuthors(authors);
};

export const deleteAuthor = async (authorId: string): Promise<void> => {
  const authors = await loadAuthors();
  const filteredAuthors = authors.filter(author => author.id !== authorId);
  
  if (filteredAuthors.length === authors.length) {
    throw new Error('Author not found');
  }

  await saveAuthors(filteredAuthors);
};

// Posts management
export const loadPosts = async (): Promise<BlogPostType[]> => {
  // First try to load from simulated file system
  const fileSystemData = JSON.parse(localStorage.getItem('fileSystem') || '{}');
  if (fileSystemData[DATA_PATHS.posts]) {
    return fileSystemData[DATA_PATHS.posts].posts || [];
  }
  
  // Fallback to localStorage
  const localData = localStorage.getItem('published-posts/posts');
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      return parsed.posts || [];
    } catch (error) {
      console.error('Error parsing posts from localStorage:', error);
    }
  }
  
  // Fallback to default data
  try {
    const defaultData = await readJSONFile(DATA_PATHS.posts);
    if (defaultData && defaultData.posts) {
      return defaultData.posts;
    }
  } catch (error) {
    console.error('Error loading default posts:', error);
  }
  
  // Return empty array if all else fails
  return [];
};

export const savePosts = async (posts: BlogPostType[]): Promise<void> => {
  const data = { posts };
  await writeJSONFile(DATA_PATHS.posts, data);
};

export const addPost = async (post: BlogPostType): Promise<void> => {
  const posts = await loadPosts();
  posts.unshift(post); // Add to beginning of array
  await savePosts(posts);
  
  // Update author post count
  if (post.authorEmail) {
    await updateAuthorPostCount(post.authorEmail, true);
  }
};

export const updatePost = async (updatedPost: BlogPostType): Promise<void> => {
  const posts = await loadPosts();
  const postIndex = posts.findIndex(post => post.id === updatedPost.id);
  
  if (postIndex === -1) {
    throw new Error('Post not found');
  }

  posts[postIndex] = updatedPost;
  await savePosts(posts);
};

export const deletePost = async (postId: string): Promise<void> => {
  const posts = await loadPosts();
  const postToDelete = posts.find(post => post.id === postId);
  const filteredPosts = posts.filter(post => post.id !== postId);
  
  if (filteredPosts.length === posts.length) {
    throw new Error('Post not found');
  }

  await savePosts(filteredPosts);
  
  // Update author post count
  if (postToDelete && postToDelete.authorEmail) {
    await updateAuthorPostCount(postToDelete.authorEmail, false);
  }
};

// Update author post count
export const updateAuthorPostCount = async (authorEmail: string, increment: boolean = true): Promise<void> => {
  const authors = await loadAuthors();
  const authorIndex = authors.findIndex(author => author.email === authorEmail);
  
  if (authorIndex !== -1) {
    if (increment) {
      authors[authorIndex].postsCount += 1;
    } else {
      authors[authorIndex].postsCount = Math.max(0, authors[authorIndex].postsCount - 1);
    }
    await saveAuthors(authors);
  }
};

// Admin authentication
export const authenticateAdmin = async (username: string, password: string): Promise<AdminUser | null> => {
  // Load admins from file system
  const fileSystemData = JSON.parse(localStorage.getItem('fileSystem') || '{}');
  let admins: AdminUser[] = [];
  
  if (fileSystemData[DATA_PATHS.admins]) {
    admins = fileSystemData[DATA_PATHS.admins].editors || [];
  } else {
    // Fallback to default admins
    try {
      const defaultData = await readJSONFile(DATA_PATHS.admins);
      if (defaultData && defaultData.editors) {
        admins = defaultData.editors;
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      // Fallback to hardcoded admins
      admins = [
        {
          id: "admin-1",
          username: "admin",
          password: "1Flasicradule!",
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
    }
  }

  const user = admins.find(admin => admin.username === username && admin.password === password);
  if (user) {
    // Update last login
    user.lastLogin = new Date().toISOString();
    
    // Save updated admins
    const updatedAdmins = admins.map(admin => 
      admin.id === user.id ? user : admin
    );
    await writeJSONFile(DATA_PATHS.admins, { editors: updatedAdmins });
    
    return user;
  }
  return null;
};

// Author authentication
export const authenticateAuthor = async (email: string, password: string): Promise<AuthorUser | null> => {
  const authors = await loadAuthors();
  const user = authors.find(author => author.email === email && author.password === password && author.isActive);
  
  if (user) {
    // Update last login
    user.lastLogin = new Date().toISOString();
    await saveAuthors(authors);
    return user;
  }
  return null;
};

// Initialize default data if needed
export const initializeDefaultData = async (): Promise<void> => {
  try {
    // Check if we have any data
    const authors = await loadAuthors();
    const posts = await loadPosts();
    
    // If no authors, create demo author
    if (authors.length === 0) {
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
      
      await saveAuthors([demoAuthor]);
    }
    
    // If no posts, we can load default posts from blogPosts.ts if needed
    console.log(`Initialized data: ${authors.length} authors, ${posts.length} posts`);
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
};

// Export file system data for backup/restore
export const exportFileSystemData = (): string => {
  const fileSystemData = localStorage.getItem('fileSystem') || '{}';
  return fileSystemData;
};

export const importFileSystemData = (data: string): void => {
  try {
    const parsedData = JSON.parse(data);
    localStorage.setItem('fileSystem', JSON.stringify(parsedData));
    console.log('File system data imported successfully');
  } catch (error) {
    console.error('Error importing file system data:', error);
    throw new Error('Invalid data format');
  }
};