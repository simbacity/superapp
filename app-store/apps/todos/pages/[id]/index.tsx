import { todoSchema } from "@app-store/apps/todos/api-contracts/todo.schema";
import daysjs from "@app-store/apps/todos/utils/Days";
import Shell from "@app-store/shared/components/Shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

interface TodoParams {
  id: string;
}

export function useGetTodo(id: string) {
  const getTodo = async (id: string) => {
    const response = await axios.get(`/api/apps/todos/todos/${id}/show`);
    return todoSchema.parse(response.data);
  };

  return useQuery(["todo", "todos", "show", id], () => getTodo(id));
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const deleteTodo = async (id: string) => {
    const response = await axios.delete(`/api/apps/todos/todos/${id}/delete`);
    return todoSchema.parse(response.data);
  };

  return useMutation((id: string) => deleteTodo(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["todo", "todos", "list"]);
    },
  });
}

export default function Todo({ id }: TodoParams) {
  const router = useRouter();
  const { data: todo } = useGetTodo(id);
  const deleteTodo = useDeleteTodo();

  const onDeleteHandler = (id: string) => {
    deleteTodo.mutate(id, {
      onSuccess: () => {
        router.push("/apps/todos");
      },
    });
  };

  if (!todo) return <div>Loading....</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <nav className="border-b-4 border-white border-dotted pb-4 mb-6">
          <Link href="/apps/todos">
            <a className="link">All Todos</a>
          </Link>
        </nav>
        <main>
          <>
            <p className="h3">{todo.title}</p>
            <p className="paragraph">{todo.content}</p>
            <p className="paragraph">Category: {todo.category}</p>
            <p className="paragraph text-sm">Priority: {todo.priority}</p>
            <p className="paragraph text-sm">Due Date: {daysjs(todo.dueDate).format("lll")}</p>
            {todo.status === "todo" && <p className="paragraph text-sm">Status: To Do</p>}
            {todo.status === "inprogress" && <p className="paragraph text-sm">Status: In progress</p>}
            {todo.status === "done" && <p className="paragraph text-sm">Status: Done</p>}
          </>
          <div>
            <Link href={`/apps/todos/${todo.id}/edit`}>
              <a className="link mr-4">[edit]</a>
            </Link>
            <button className="danger-button--small" onClick={() => onDeleteHandler(id)}>
              Delete
            </button>
          </div>
        </main>
      </div>
    </Shell>
  );
}
