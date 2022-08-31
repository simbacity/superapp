import { todoListSchema } from "@app-store/apps/todos/api-contracts/todo.schema";
import Shell from "@app-store/shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// import Link from "next/link";

function useTodosData() {
  return useQuery(["todo.todos.list"], async () => {
    const response = await axios.get("/api/apps/todos/list");
    return todoListSchema.parse(response);
  });
}

export default function Index() {
  const { data: todos } = useTodosData();

  if (!todos) return <div>Loading...</div>;

  return (
    <Shell>
      <div></div>
    </Shell>
  );
}
