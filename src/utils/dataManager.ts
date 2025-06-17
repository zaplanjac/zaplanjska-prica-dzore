// Updated data manager to use persistent file storage
import { 
  loadAuthors, 
  saveAuthors, 
  createAuthor as createAuthorFile, 
  updateAuthor as updateAuthorFile, 
  deleteAuthor as deleteAuthorFile,
  loadPosts,
  savePosts,
  addPost as addPostFile,
  updatePost as updatePostFile,
  deletePost as deletePostFile,
  authenticateAdmin as authenticateAdminFile,
  authenticateAuthor as authenticateAuthorFile,
  updateAuthorPostCount as updateAuthorPostCountFile,
  initializeDefaultData,
  AuthorUser,
  AdminUser
} from './fileStorage';

// Re-export types
export type { AuthorUser, AdminUser };

// Admin/Editor authentication
export const authenticateAdmin = async (username: string, password: string): Promise<AdminUser | null> => {
  return await authenticateAdminFile(username, password);
};

// Author authentication
export const authenticateAuthor = async (email: string, password: string): Promise<AuthorUser | null> => {
  return await authenticateAuthorFile(email, password);
};

// Register new author
export const registerAuthor = async (authorData: Omit<AuthorUser, 'id' | 'createdAt' | 'lastLogin' | 'isActive' | 'postsCount'>): Promise<AuthorUser> => {
  return await createAuthorFile(authorData);
};

// Get all authors
export const getAllAuthors = async (): Promise<AuthorUser[]> => {
  return await loadAuthors();
};

// Create new author (admin function)
export const createAuthor = async (authorData: Omit<AuthorUser, 'id' | 'createdAt' | 'lastLogin' | 'postsCount'>): Promise<AuthorUser> => {
  return await createAuthorFile(authorData);
};

// Update author (admin function)
export const updateAuthor = async (authorId: string, updateData: Partial<Omit<AuthorUser, 'id' | 'createdAt'>>): Promise<void> => {
  await updateAuthorFile(authorId, updateData);
};

// Delete author (admin function)
export const deleteAuthor = async (authorId: string): Promise<void> => {
  await deleteAuthorFile(authorId);
};

// Update author post count
export const updateAuthorPostCount = async (authorEmail: string, increment: boolean = true): Promise<void> => {
  await updateAuthorPostCountFile(authorEmail, increment);
};

// Posts management
export const getAllPosts = async () => {
  return await loadPosts();
};

export const addPost = async (post: any) => {
  await addPostFile(post);
};

export const updatePost = async (post: any) => {
  await updatePostFile(post);
};

export const deletePost = async (postId: string) => {
  await deletePostFile(postId);
};

// Initialize data on app start
export const initializeData = async (): Promise<void> => {
  await initializeDefaultData();
};