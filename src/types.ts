export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'regular';
  createdAt: string;
  hasPaid: boolean;
  paymentTime: string | null; // ISO string of payment
  expired: boolean; // True after exactly 1 minute
  password?: string; // Save password to verify pre-seeded admin or logins
  isInfinite?: boolean; // Set by Manager to bypass the 1-minute prank timer and stay infinite!
  
  // Custom verification and payment characteristics
  emailVerified?: boolean;
  emailVerificationCode?: string;
  bankTransferReceipt?: string; // base64 receipt/card photo
  bankTransferOTP?: string; // OTP verified
  paymentPendingVerification?: boolean; // waiting for admin approval
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
