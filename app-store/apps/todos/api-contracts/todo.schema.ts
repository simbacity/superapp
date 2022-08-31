import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  status: z.string(),
  category: z.string(),
  priority: z.string(),
  dueDate: z.date(),
});

export const todoListSchema = z.array(todoSchema);

export const todoCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
  status: z.string(),
  category: z.string(),
  priority: z.string(),
  dueDate: z.date(),
});

export const todoUpdateSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  status: z.string(),
  category: z.string(),
  priority: z.string(),
  dueDate: z.date(),
});

export const todoDeleteSchema = z.object({
  id: z.string(),
});

export type TodoResponse = z.TypeOf<typeof todoSchema>;
export type TodoListResponse = z.TypeOf<typeof todoListSchema>;
export type TodoCreateRequest = z.TypeOf<typeof todoCreateSchema>;
export type TodoUpdateRequest = z.TypeOf<typeof todoUpdateSchema>;
export type TodoDeleteRequest = z.TypeOf<typeof todoDeleteSchema>;
