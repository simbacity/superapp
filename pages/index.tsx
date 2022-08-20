import Link from "next/link";

import Globe3D from "@components/landing-page/Globe3D.js";

export default function Index() {
  return (
    <div className="sm:px-6 lg:px-8 flex items-center justify-center min-h-screen px-4 pt-6 pb-32">
      <div className="w-full max-w-4xl">
        <Globe3D />
        <div>
          <h2 className="h2">Welcome to Simba City!</h2>
          <p className="lead-paragraph">
            Simba is a city like Florence, Vienna, or San Francisco but built via the internet.
          </p>
          <p className="lead-paragraph">
            We believe that cities can change people. And the reason why people become successful is that they
            are surrounded by successful people.
          </p>
          <p className="lead-paragraph">
            Being a part of Simba means you’ll be surrounded by a community of highly ambitious people with
            big dreams and the skills to make them a reality.
          </p>
          <h2 className="h2">Who should join?</h2>
          <p className="lead-paragraph">
            - Young developers from anywhere who aspire to work at the best startups in the world
          </p>
          <p className="lead-paragraph">
            - People who have high ambitions and believe that hard work pays off in the long run
          </p>
          <p className="lead-paragraph">
            - People who have a strong spirit of service and are excited to support one another
          </p>
          <h2 className="h2">Ready to build the future?</h2>
        </div>
        <div>
          <Link href="auth/signup">
            <button className="primary-button--large">Become an E-Resident</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
