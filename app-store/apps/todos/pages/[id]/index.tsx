import { todoSchema } from "@app-store/apps/todos/api-contracts/todo.schema";
import Shell from "@app-store/shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface TodoParams {
  id: string;
}

function useTodoData(id: string) {
  return useQuery(["todos.show"], async () => {
    const response = await axios.get("/api/apps/todos/show", { params: { id } });
    return todoSchema.parse(response.data);
  });
}

export default function Todo({ id }: TodoParams) {
  const { data: todo } = useTodoData(id);

  if (!todo) return <div>Loading....</div>;

  return (
    <Shell>
      <div></div>
    </Shell>
  );
}
