import { z } from "zod";

const dateSchema = (arg: unknown) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
};

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  status: z.string(),
  category: z.string().nullable(),
  priority: z.string().nullable(),
  dueDate: z.preprocess(dateSchema, z.date().nullable()),
});

export const todoListSchema = z.array(todoSchema);

export const todoRequestSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  status: z.string(),
  category: z.string().nullable(),
  priority: z.string().nullable(),
  dueDate: z.preprocess(dateSchema, z.date().nullable()),
});

export type TodoResponse = z.TypeOf<typeof todoSchema>;
export type TodoListResponse = z.TypeOf<typeof todoListSchema>;
export type TodoRequest = z.TypeOf<typeof todoRequestSchema>;
