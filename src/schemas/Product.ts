import { z } from 'zod'

export const product = z.object({
  name: z.string().min(2, "At least 2 characters"),
  description: z.string().optional(),
  quantity: z.number().min(1, "At least 1 product"),
  date: z.string(),
  category: z.boolean(),
  image: z.any().optional(),
  price: z.number()
})

export type ProductSchema = z.infer<typeof product>