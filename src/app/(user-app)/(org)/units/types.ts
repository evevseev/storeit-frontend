import { z } from "@/lib/zod";

export const aliasRegex = z.string().min(1).max(100).regex(/^[^\s]+$/, { message: 'Название не должно содержать пробелы' })
