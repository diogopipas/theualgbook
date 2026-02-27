export const COURSE_TYPES = ["Licenciatura", "Mestrado", "TeSP"] as const;
export type CourseType = (typeof COURSE_TYPES)[number];

export const REACTION_TYPES = [
  "like",
  "love",
  "haha",
  "sad",
  "angry",
] as const;
export type ReactionType = (typeof REACTION_TYPES)[number];

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  sad: "😢",
  angry: "😠",
};

export const VISIBILITY_OPTIONS = ["public", "friends", "only_me"] as const;
export type Visibility = (typeof VISIBILITY_OPTIONS)[number];

export const GROUP_PRIVACY = ["public", "private"] as const;
export type GroupPrivacy = (typeof GROUP_PRIVACY)[number];

export const GROUP_ROLES = ["admin", "moderator", "member"] as const;
export type GroupRole = (typeof GROUP_ROLES)[number];

export const FRIENDSHIP_STATUS = [
  "pending",
  "accepted",
  "rejected",
  "blocked",
] as const;
export type FriendshipStatus = (typeof FRIENDSHIP_STATUS)[number];
