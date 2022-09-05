import NewPostForm from "@app-store/apps/mini-blog/components/NewPostForm";
import Shell from "@app-store/shared/components/Shell";

export default function PostEdit() {
  return (
    <Shell>
      <div className="layout py-8">
        <h1 className="h1">New post</h1>
        <main>
          <NewPostForm />
        </main>
      </div>
    </Shell>
  );
}
