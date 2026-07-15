export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: 'regular';
  createdAt: string;
  passwordHash: string;
}

export interface SupportMessage {
  id: string;
  userId: string;
  username: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  replyText?: string;
}

export interface AdventureLink {
  id: string;
  url: string;
  name: string;
  createdAt: string;
  isCompleted: boolean;
  userId: string; // Belongs to specific user
}

export interface FavoriteDish {
  id: string;
  name: string;
  image: string; // Base64 representation or standard fallback icon
  createdAt: string;
  userId: string; // Belongs to specific user
}

export interface FavoritePhoto {
  id: string;
  title: string;
  url: string; // Base64 representation or standard fallback url
  createdAt: string;
  userId: string; // Belongs to specific user
}
