import { useSession } from "next-auth/react";
import router from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

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
      <nav className="fixed bottom-0 left-0 z-50 -mb-px flex h-12 w-full items-center justify-center border-t border-black bg-black">
        <a
          onClick={() => router.push("/apps")}
          className="cursor-pointer px-8 font-mono text-white"
        >
          Home
        </a>
      </nav>
    </>
  );
}
