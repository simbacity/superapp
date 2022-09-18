import { todoListSchema, TodoResponse } from "@app-store/apps/todos/api-contracts/todo.schema";
import TodoItem from "@app-store/apps/todos/components/TodoItem";
import dayjs from "@app-store/apps/todos/utils/Days";
import Shell from "@app-store/shared/components/Shell";
import { XCircleIcon } from "@heroicons/react/outline";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export function useGetAllTodos() {
  const getAllTodos = async () => {
    const response = await axios.get("/api/apps/todos/todos/list");
    return todoListSchema.parse(response.data);
  };

  return useQuery(["todo", "todos", "list"], () => getAllTodos());
}

const durationFilterHandler = (filter: string, data: TodoResponse[] | undefined) => {
  if (!data) return;
  if (filter === "today") {
    return { data: data.filter((item) => dayjs(item.dueDate).isToday()) };
  }
  if (filter === "tomorrow") {
    return { data: data.filter((item) => dayjs(item.dueDate).isTomorrow()) };
  }
  if (filter === "this-week") {
    return { data: data.filter((item) => dayjs(item.dueDate).week() === dayjs().week()) };
  }
  if (filter === "upcoming") {
    return { data: data.filter((item) => dayjs().isBefore(item.dueDate, "day")) };
  }
};

export default function Index() {
  const { data: todos } = useGetAllTodos();
  const [todoData, setTodoData] = useState<TodoResponse[] | undefined>([]);
  const [durationFilter, setDurationFilter] = useState("");

  useEffect(() => {
    setTodoData(todos);
  }, [todos]);

  const filterHandler = (filter: string) => {
    setDurationFilter(filter);
    const data = durationFilterHandler(filter, todos);
    setTodoData(data?.data);
  };

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
                  <a className="link" onClick={() => filterHandler("today")}>
                    Today
                  </a>
                </ul>
                <ul className="py-2 border-b-2">
                  <a className="link" onClick={() => filterHandler("tomorrow")}>
                    Tomorrow
                  </a>
                </ul>
                <ul className="py-2 border-b-2">
                  <a className="link" onClick={() => filterHandler("this-week")}>
                    This week
                  </a>
                </ul>
                <ul className="py-2 border-b-2">
                  <a className="link" onClick={() => filterHandler("upcoming")}>
                    Upcoming
                  </a>
                </ul>
              </div>
            </aside>
            <main role="main" className="w-full sm:w-2/3 md:w-3/4 pt-1 pl-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Link href="/apps/todos/new">
                    <PlusCircleIcon className="w-11 h-11 text-blue-800 cursor-pointer" />
                  </Link>
                  <h3 className="h3 px-2">Add a task</h3>
                </div>
                {!!durationFilter && (
                  <div className="flex items-center bg-blue-800 p-1">
                    <p className="text-white text-sm mr-2">{durationFilter}</p>
                    <XCircleIcon
                      className="w-5 h-5 text-white cursor-pointer"
                      onClick={() => {
                        setDurationFilter("");
                        setTodoData(todos);
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                {todoData?.map((item) => (
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
