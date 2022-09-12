import { TodoRequest, todoRequestSchema, todoSchema } from "@app-store/apps/todos/api-contracts/todo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

type TodoCreateRequestParams = Omit<TodoRequest, "status">;
const todoCreateSchemaNoStatus = todoRequestSchema.omit({ status: true });

export function useCreateTodo() {
  const queryClient = useQueryClient();

  const createTodo = async (data: TodoCreateRequestParams) => {
    const response = await axios.post("/api/apps/todos/todos/create", data);
    return todoSchema.parse(response);
  };

  return useMutation(createTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todo", "todos", "list"]);
    },
  });
}

export default function TodoForm() {
  const router = useRouter();
  const form = useForm<TodoCreateRequestParams>({ resolver: zodResolver(todoCreateSchemaNoStatus) });
  const formErrors = form.formState.errors;
  const createTodo = useCreateTodo();

  function onSubmit(data: TodoCreateRequestParams) {
    createTodo.mutate(data, {
      onSuccess: (response) => {
        router.push(`/apps/todos/${response.id}`);
      },
    });
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
            defaultValue={options[0].value}
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
            createTodo.isLoading ? "default-button--medium--disabled" : "default-button--medium"
          }`}>
          Save
        </button>
      </div>
    </form>
  );
}
