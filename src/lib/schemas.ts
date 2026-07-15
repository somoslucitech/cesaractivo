import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre completo").max(120),
  email: z.string().trim().email("Ingresa un email válido").max(180),
  whatsapp: z
    .string()
    .trim()
    .min(7, "Ingresa un número de WhatsApp válido")
    .max(20)
    .regex(/^\+?[0-9\s-]+$/, "Solo números, espacios y +"),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const paymentMethodSchema = z.enum(["paypal", "apolopay"]);
