import NewPostForm from "@app-store/apps/mini-blog/components/NewPostForm";
import Shell from "@app-store/shared/components/Shell";

interface PostParams {
  id: string;
}
// TODO NEXT:
// -> Add create page
// -> Save and update to database
// -> Refactor api routes /[id]/update, /[id]/delete (instead of /update /delete)
// -> Add delete functionality
// -> Add functionality to see posts from other users in a news feed
export default function PostEdit({ id }: PostParams) {
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
