import { z } from 'zod';

// Define the schema
const userRegister = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Export the schema as a value (add this line)
export { userRegister as registerSchema };

// Keep the type export if needed
export type RegisterSchema = z.infer<typeof userRegister>;
