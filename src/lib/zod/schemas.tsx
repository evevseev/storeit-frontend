import { z } from "zod";

export const unitSchema = z.object({
  name: z.string().min(1).max(100),
  alias: z.string().min(1).max(100),
  address: z.string().min(1).max(100),
});

export const storageGroupSchema = z.object({
  name: z.string().min(1).max(100),
  alias: z.string().min(1).max(100),
});

export const cellsGroupSchema = z.object({
  name: z.string().min(1).max(100),
  alias: z.string().min(1).max(100),
});
