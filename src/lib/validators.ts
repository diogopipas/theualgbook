import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .refine((e) => e.endsWith("@ualg.pt"), {
      message: "Apenas emails @ualg.pt são permitidos",
    }),
  password: z
    .string()
    .min(8, "A password deve ter pelo menos 8 caracteres"),
  course: z
    .string()
    .min(2, "O curso deve ter pelo menos 2 caracteres"),
  courseType: z.enum(["Licenciatura", "Mestrado", "TeSP"], {
    error: "Seleciona um tipo de curso",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "A password é obrigatória"),
});

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100),
  username: z
    .string()
    .min(3, "O username deve ter pelo menos 3 caracteres")
    .max(30)
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "O username só pode conter letras, números, pontos e underscores"
    ),
  bio: z.string().max(500).optional(),
  course: z.string().optional(),
  courseType: z
    .enum(["Licenciatura", "Mestrado", "TeSP"])
    .optional()
    .nullable(),
  department: z.string().optional(),
  enrollmentYear: z.number().int().min(2000).max(2030).optional().nullable(),
  // Basic Info
  birthday: z.string().optional().nullable(),
  hometown: z.string().max(100).optional().nullable(),
  relationshipStatus: z
    .enum(["Solteiro/a", "Numa relação", "Comprometido/a", "Casado/a", "Complicado"])
    .optional()
    .nullable(),
  // Personal Info
  activities: z.string().max(500).optional().nullable(),
  interests: z.string().max(500).optional().nullable(),
  favoriteMusic: z.string().max(500).optional().nullable(),
  favoriteBooks: z.string().max(500).optional().nullable(),
  favoriteQuotes: z.string().max(500).optional().nullable(),
  // Education Info
  highSchool: z.string().max(200).optional().nullable(),
  // Work Info
  workCompany: z.string().max(200).optional().nullable(),
  workPeriod: z.string().max(100).optional().nullable(),
  workDescription: z.string().max(500).optional().nullable(),
});

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "O post não pode estar vazio")
    .max(5000, "O post deve ter no máximo 5000 caracteres"),
  visibility: z.enum(["public", "friends", "only_me"]).default("friends"),
  groupId: z.string().uuid().optional().nullable(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "O comentário não pode estar vazio")
    .max(2000, "O comentário deve ter no máximo 2000 caracteres"),
  postId: z.string().uuid(),
  parentId: z.string().uuid().optional().nullable(),
});

export const groupSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do grupo deve ter pelo menos 3 caracteres")
    .max(100),
  description: z.string().max(1000).optional(),
  privacy: z.enum(["public", "private"]).default("public"),
});

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "A mensagem não pode estar vazia")
    .max(5000),
  conversationId: z.string().uuid(),
});
