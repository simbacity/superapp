import { useSession } from "next-auth/react";
import router from "next/router";
import { ReactNode, useEffect, Fragment } from "react";

export default function Shell(props: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
    if (!loading && !session) window.location.href = "/";
  }, [loading, session]);

  if (!session) {
    return <div className="h1 p-8">Loading...</div>;
  }

  return (
    <>
      <main className="mb-12">{props.children}</main>
      <nav className="fixed bottom-0 left-0 z-50 bg-black w-full h-12 flex items-center justify-center">
        <a onClick={() => router.push("/apps")} className="text-white font-mono cursor-pointer px-8">
          Home
        </a>
      </nav>
    </>
  );
}
