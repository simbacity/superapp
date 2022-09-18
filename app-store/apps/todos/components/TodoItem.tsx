import { TodoResponse } from "@app-store/apps/todos/api-contracts/todo.schema";
import dayjs from "@app-store/apps/todos/utils/Days";
import { ArrowCircleRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

interface TodoItemParams {
  values: Omit<TodoResponse, "content">;
}

export default function TodoItem({ values }: TodoItemParams) {
  const { id, title, status, category, priority, dueDate } = values;

  return (
    <div
      key={id}
      className="sm:w-full md:w-2/3 border border-white border-solid flex justify-between items-start p-2 my-4">
      <div className="flex items-center">
        <div
          className={`rounded-sm w-4 h-4 ${
            status === "todo" ? "bg-blue-800" : status === "inprogress" ? "bg-blue-400" : "bg-green-800"
          } mr-4`}
        />
        <div>
          <p className="paragraph m-0">{title}</p>
          <div className="flex">
            {!!dueDate && <p className="paragraph text-sm m-0 mr-4">Due: {dayjs(dueDate).format("lll")}</p>}
            {!!priority && (
              <p
                className={`paragraph text-sm m-0 ${
                  priority === "high" ? "text-red-500" : priority === "medium" ? "text-yellow-500" : ""
                }`}>
                Priority: {priority}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="paragraph m-0 text-sm">
          {category}/{status}
        </p>
        <Link href={`/apps/todos/${id}`}>
          <ArrowCircleRightIcon className="w-8 h-8 text-white items-start cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
