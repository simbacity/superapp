import {
  todoRequestSchema,
  TodoResponse,
  TodoRequest,
  todoSchema,
} from "@app-store/apps/todos/api-contracts/todo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

interface TodoFormParams {
  defaultValues: TodoResponse;
}

export function useUpdateTodo() {
  interface UpdateTodoParams {
    id: string;
    data: TodoRequest;
  }

  const queryClient = useQueryClient();

  const updateTodo = async ({ id, data }: UpdateTodoParams) => {
    const response = await axios.patch(`/api/apps/todos/todos/${id}/update`, data);
    return todoSchema.parse(response.data);
  };

  return useMutation(updateTodo, {
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries(["todo", "todos", "show", id]);
      queryClient.invalidateQueries(["todo", "todos", "list"]);
    },
  });
}

export default function TodoForm({ defaultValues }: TodoFormParams) {
  const router = useRouter();
  const form = useForm<TodoRequest>({ defaultValues, resolver: zodResolver(todoRequestSchema) });
  const formErrors = form.formState.errors;
  const updateTodo = useUpdateTodo();

  function onSubmit(data: TodoRequest) {
    updateTodo.mutate(
      { id: defaultValues.id, data },
      {
        onSuccess: () => {
          router.push("/apps/todos");
        },
      }
    );
  }

  const options = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="label_title" className="label">
          Title (*)
        </label>
        <input {...form.register("title")} id="label_title" name="title" type="text" className="input" />
        {formErrors.title?.message && <p className="error-text">{formErrors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="label_content" className="label">
          Content (*)
        </label>
        <textarea
          {...form.register("content")}
          className="textarea"
          name="content"
          placeholder="You can break down the todo"
        />
        {formErrors.content?.message && <p className="error-text">{formErrors.content.message}</p>}
      </div>
      <div>
        <label htmlFor="label_category" className="label">
          Category
        </label>
        <input
          {...form.register("category")}
          id="label_category"
          name="category"
          type="text"
          className="input"
        />
      </div>
      <div>
        <label htmlFor="label_status" className="label">
          Status
        </label>
        <Controller
          control={form.control}
          name="status"
          render={({ field: { onChange, name, ref } }) => (
            <Select
              ref={ref}
              className="select"
              name={name}
              onChange={(val) => onChange(val?.value)}
              options={[
                { value: "todo", label: "To Do" },
                { value: "inprogress", label: "In Progress" },
                { value: "done", label: "Done" },
              ]}
            />
          )}
        />
      </div>
      <div className="flex">
        <div className="s:w-full md:w-1/2 mr-2">
          <label htmlFor="label_dueDate" className="label">
            Due Date
          </label>
          <input
            {...form.register("dueDate")}
            id="label_dueDate"
            name="dueDate"
            type="datetime-local"
            className="input"
          />
        </div>
        <div className="s:w-full md:w-1/2 ml-2">
          <label htmlFor="label_priority" className="label">
            Priority
          </label>
          <Controller
            control={form.control}
            name="priority"
            render={({ field: { onChange, name, ref } }) => (
              <Select
                ref={ref}
                className="select"
                name={name}
                onChange={(val) => onChange(val?.value)}
                defaultValue={options[0]}
                options={options}
              />
            )}
          />
        </div>
      </div>
      <div>
        <button onClick={() => router.back()} className="invisible-button--medium">
          Cancel
        </button>
        <button
          type="submit"
          className={`${
            updateTodo.isLoading ? "default-button--medium--disabled" : "default-button--medium"
          }`}>
          Update
        </button>
      </div>
    </form>
  );
}
