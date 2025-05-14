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

export const itemVariantSchema = z.object({
  name: z.string().min(1).max(100),
  article: z.nullable(z.string().min(1).max(100)),
  ean13: z.nullable(z.number().min(1000000000000).max(9999999999999)),
});

export const instanceSchema = z.object({
  variantId: z.string(),
  cellId: z.string().nullable(),
});
