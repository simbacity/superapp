import { todoSchema } from "@app-store/apps/todos/api-contracts/todo.schema";
import EditTodoForm from "@app-store/apps/todos/components/EditTodoForm";
import Shell from "@app-store/shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface TodoParams {
  id: string;
}

function useTodoData(id: string) {
  return useQuery(["todos.show"], async () => {
    const response = await axios.get("/api/apps/todos/todos/show", { params: { id } });
    return todoSchema.parse(response.data);
  });
}

export default function TodoEdit({ id }: TodoParams) {
  const { data: todo } = useTodoData(id);

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
