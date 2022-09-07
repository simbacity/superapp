import NewTodoForm from "@app-store/apps/todos/components/NewTodoForm";
import Shell from "@app-store/shared/components/Shell";

export default function NewTodo() {
  return (
    <Shell>
      <div className="layout py-8">
        <h1 className="h1">New Todo</h1>
        <main>
          <NewTodoForm />
        </main>
      </div>
    </Shell>
  );
}
