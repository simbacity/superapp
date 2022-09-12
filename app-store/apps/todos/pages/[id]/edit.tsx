import EditTodoForm from "@app-store/apps/todos/components/EditTodoForm";
import { useGetTodo } from "@app-store/apps/todos/pages/[id]";
import Shell from "@app-store/shared/components/Shell";

interface TodoParams {
  id: string;
}

export default function TodoEdit({ id }: TodoParams) {
  const { data: todo } = useGetTodo(id);

  if (!todo) return <div>No todos....</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <main>
          <EditTodoForm defaultValues={todo} />
        </main>
      </div>
    </Shell>
  );
}
