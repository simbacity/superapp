import {
  todoCreateSchema,
  TodoResponse,
  TodoUpdateRequest,
} from "@app-store/apps/todos/api-contracts/todo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

interface TodoFormParams {
  defaultValues: TodoResponse;
}

async function useMutateTodo(data: TodoUpdateRequest) {
  const response = await axios.patch("/api/apps/todos/todos/update", data);
  return response;
}

export default function TodoForm({ defaultValues }: TodoFormParams) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<TodoUpdateRequest>({ defaultValues, resolver: zodResolver(todoCreateSchema) });

  const { mutate, isLoading } = useMutation(useMutateTodo, {
    onSuccess: () => router.back(),
  });

  function onSubmit(data: TodoUpdateRequest) {
    mutate({ ...data, id: defaultValues.id });
  }

  const options = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="label_title" className="label">
          Title (*)
        </label>
        <input {...register("title")} id="label_title" name="title" type="text" className="input" />
        {errors.title?.message && <p className="error-text">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="label_content" className="label">
          Content (*)
        </label>
        <textarea
          {...register("content")}
          className="textarea"
          name="content"
          placeholder="You can break down the todo"
        />
        {errors.content?.message && <p className="error-text">{errors.content.message}</p>}
      </div>
      <div>
        <label htmlFor="label_category" className="label">
          Category
        </label>
        <input {...register("category")} id="label_category" name="category" type="text" className="input" />
      </div>
      <div>
        <label htmlFor="label_status" className="label">
          Status
        </label>
        <Controller
          control={control}
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
            {...register("dueDate")}
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
            control={control}
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
          className={`${isLoading ? "default-button--medium--disabled" : "default-button--medium"}`}>
          Update
        </button>
      </div>
    </form>
  );
}
