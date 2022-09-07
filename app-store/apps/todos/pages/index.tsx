import { todoListSchema } from "@app-store/apps/todos/api-contracts/todo.schema";
import TodoItem from "@app-store/apps/todos/components/TodoItem";
import Shell from "@app-store/shared/components/Shell";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

function useTodosData() {
  return useQuery(["todo.todos.list"], async () => {
    const response = await axios.get("/api/apps/todos/todos/list");
    return todoListSchema.parse(response.data);
  });
}

export default function Index() {
  const { data: todos } = useTodosData();

  if (!todos) return <div>Loading...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <h1 className="h1">Todo App</h1>
        <section className="pb-6 border-b-4 border-white border-dotted"></section>
        <div className="boxed">
          <div className="flex flex-row flex-wrap py-4">
            <aside className="w-full sm:w-1/3 md:w-1/4 px-2">
              <div className="sticky top-0 p-4 w-full">
                <ul className="py-2 border-b-2">
                  <a className="link">Today</a>
                </ul>
                <ul className="py-2 border-b-2">
                  <a className="link">Tomorrow</a>
                </ul>
                <ul className="py-2 border-b-2">
                  <a className="link">This week</a>
                </ul>
                <ul className="py-2 border-b-2">
                  <a className="link">Upcoming</a>
                </ul>
              </div>
            </aside>
            <main role="main" className="w-full sm:w-2/3 md:w-3/4 pt-1 pl-1">
              <div>
                <button className="default-button--small">All</button>
                <button className="default-button--small">In progress</button>
                <button className="primary-button--small">Complete</button>
                <button className="danger-button--small">Past Due</button>
              </div>
              <div className="flex items-center">
                <Link href="/apps/todos/new">
                  <PlusCircleIcon className="w-11 h-11 text-blue-800 cursor-pointer" />
                </Link>
                <h3 className="h3 px-2">Add a task</h3>
              </div>
              <div>
                {todos.map((item) => (
                  <TodoItem key={item.id} values={item} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Shell>
  );
}
