export interface Profile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  course: string | null;
  course_type: "Licenciatura" | "Mestrado" | "TeSP" | null;
  department: string | null;
  enrollment_year: number | null;
  // Basic Info
  birthday: string | null;
  hometown: string | null;
  relationship_status: "Solteiro/a" | "Numa relação" | "Comprometido/a" | "Casado/a" | "Complicado" | null;
  // Personal Info
  activities: string | null;
  interests: string | null;
  favorite_music: string | null;
  favorite_books: string | null;
  favorite_quotes: string | null;
  // Education Info
  high_school: string | null;
  // Work Info
  work_company: string | null;
  work_period: string | null;
  work_description: string | null;
  is_online: boolean;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  group_id: string | null;
  content: string;
  image_urls: string[];
  visibility: "public" | "friends" | "only_me";
  created_at: string;
  updated_at: string;
  author?: Profile;
  reactions_count?: Record<string, number>;
  user_reaction?: string | null;
  comments_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  replies?: Comment[];
}

export interface Reaction {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  type: "like" | "love" | "haha" | "sad" | "angry";
  created_at: string;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "rejected" | "blocked";
  created_at: string;
  updated_at: string;
  requester?: Profile;
  addressee?: Profile;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  privacy: "public" | "private";
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  is_member?: boolean;
  user_role?: string | null;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "moderator" | "member";
  joined_at: string;
  profile?: Profile;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants?: Profile[];
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  sender?: Profile;
}

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string;
  type:
    | "friend_request"
    | "friend_accepted"
    | "post_reaction"
    | "comment"
    | "comment_reaction"
    | "group_invite"
    | "group_post"
    | "message";
  entity_id: string | null;
  entity_type: string | null;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
}
