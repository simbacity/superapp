import type { InviteeRequest } from "@api-contracts/invitee.schema";
import axios from "axios";
import type { CtxOrReq } from "next-auth/client/_utils";
import type { AppProviders } from "next-auth/providers";
import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
} from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Confetti from "react-confetti";

import SignInWithGoogleButton from "@components/shared/SignInWithGoogleButton";

interface SignInProps {
  providers: AppProviders;
}

export default function SignIn({ providers }: SignInProps) {
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isInvited, setIsInvited] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const params: InviteeRequest = {
      email,
      token: inviteCode,
    };

    try {
      await axios.post("/api/invitees/create", params);

      setWindowWidth(document.documentElement.clientWidth);
      setWindowHeight(document.documentElement.clientHeight);

      await wait(700);

      setIsInvited(true);
    } catch (e) {
      setErrorMessage("Incorrect invite code.");
    }
  }

  if (!isInvited) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="w-72">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="py-2">
                <label htmlFor="name" className="label">
                  Enter your Gmail address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  className="input"
                />
              </div>
              <div className="py-2">
                <label htmlFor="name" className="label">
                  Enter your invite code
                </label>
                <input
                  id="invite_code"
                  name="invite_code"
                  type="text"
                  required
                  value={inviteCode}
                  onInput={(e) => setInviteCode(e.currentTarget.value)}
                  className="input"
                />
                {errorMessage && (
                  <div className="mt-2 font-mono text-red-700">
                    {errorMessage}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="primary-button--medium mt-2 w-full"
              >
                Sign up with Google
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="paragraph text-sm">
              <Link href="/auth/signin" className="link">
                Already have an account?
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <Confetti
        width={windowWidth}
        height={windowHeight}
        recycle={false}
        numberOfPieces={400}
      />
      <div className="">
        {Object.values(providers).map((provider) => {
          return (
            <div key={provider.name}>
              <SignInWithGoogleButton
                text="Sign up with Google"
                onClick={() => signIn(provider.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function getServerSideProps(context: CtxOrReq) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/apps" },
    };
  }

  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(context),
    },
  };
}
