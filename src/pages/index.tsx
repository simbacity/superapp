import dynamic from "next/dynamic";
import Link from "next/link";
import { env } from "../env.mjs";

const Globe3D = dynamic(() => import("@components/landing-page/Globe3D.js"));

export default function Index() {
  const IS_DEVELOPMENT = env.NEXT_PUBLIC_NODE_ENV === "development";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-6 pb-32 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div style={{ width: 200, height: 200 }}>
          <Globe3D />
        </div>
        <div>
          <h2 className="h2">Welcome to Simba City!</h2>
          <p className="lead-paragraph">
            Simba is a city like Florence, Vienna, or San Francisco but built
            via the internet.
          </p>
          <p className="lead-paragraph">
            We believe that cities can change people. And the reason why people
            become successful is that they are surrounded by successful people.
          </p>
          <p className="lead-paragraph">
            Being a part of Simba means you’ll be surrounded by a community of
            highly ambitious people with big dreams and the grit to make them a
            reality.
          </p>
          <h2 className="h2">Who should join?</h2>
          <p className="lead-paragraph">
            - Young developers from anywhere who aspire to work at the best
            startups in the world
          </p>
          <p className="lead-paragraph">
            - People who have high ambitions and believe that hard work pays off
            in the long run
          </p>
          <p className="lead-paragraph">
            - People who have a strong spirit of service and are excited to
            support one another
          </p>
          <h2 className="h2">Ready to build the future?</h2>
        </div>
        {IS_DEVELOPMENT && (
          <Link href="auth/signin" className="danger-button--large">
            Development mode sign in
          </Link>
        )}
        <div>
          <Link href="auth/signup">
            <button className="primary-button--large">
              Become an E-Resident
            </button>
          </Link>
          <Link href="auth/signin">
            <button className="invisible-button--large">
              Sign in as Student
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
