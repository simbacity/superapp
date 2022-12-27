import Shell from "@app-store/shared/components/Shell";
import { signOut } from "next-auth/react";
import Link from "next/link";
import router from "next/router";

export default function AppStore() {
  const signOutAndRedirectToHome = () => {
    signOut().then(() => router.push("/"));
  };

  return (
    <Shell>
      <div className="layout">
        <div className="py-8">
          <h1 className="h1">Apps | Simba City</h1>
          <section className="pb-6 border-b-4 border-white border-dotted"></section>
          <section className="py-6 border-b-4 border-white border-dotted">
            <h2 className="h2">Town Square</h2>
            <p className="lead-paragraph">The place where we communicate. Similar to Discord, Slack, etc.</p>
            <Link href="/apps/town-square" className="default-button--medium">
              Open App
            </Link>
          </section>
          <section className="py-6 border-b-4 border-white border-dotted">
            <h2 className="h2">Mini Blog</h2>
            <p className="lead-paragraph">
              A minimalistic blog. You can use it as a boilerplate when building a Simba App.
            </p>
            <Link href="/apps/mini-blog" className="default-button--medium">
              Open App
            </Link>
          </section>
          <section className="py-6 border-b-4 border-white border-dotted">
            <h2 className="h2">Simba Design System</h2>
            <p className="lead-paragraph">
              Learn about the design language and components we use for Simba Apps.
            </p>
            <Link href="/apps/simba-design-system" className="default-button--medium">
              Open App
            </Link>
          </section>
        </div>
        <a onClick={() => signOutAndRedirectToHome()} className="invisible-button--medium">
          Sign out
        </a>
      </div>
    </Shell>
  );
}
