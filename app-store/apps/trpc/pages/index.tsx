import { trpc } from "@app-store/shared/utils/trpc";

export default function Index() {
  const hello = trpc.hello.useQuery({ text: "client" });

  if (!hello.data) return <div className="h1">Loading...</div>;

  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}
