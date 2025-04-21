import { z } from "zod";

export type Unit = {
  id: string;
  name: string;
  alias: string;
  address: string;
};

export const createUnitFormSchema = z.object({
  name: z.string().min(1).max(100),
  alias: z
    .string()
    .min(1)
    .max(10)
    .regex(/^[a-zA-Z0-9]+$/),
  address: z.string().min(1).max(255),
});

export type CreateUnitFormSchema = z.infer<typeof createUnitFormSchema>; 