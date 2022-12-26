import { CtxOrReq } from "next-auth/client/_utils";
import { AppProviders } from "next-auth/providers";
import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react";

import SignInWithGoogleButton from "@components/shared/SignInWithGoogleButton";

interface SignInProps {
  providers: AppProviders;
}

export default function SignIn({ providers }: SignInProps) {
  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="text-center">
        {Object.values(providers).map((provider) => {
          return (
            <div key={provider.name}>
              <SignInWithGoogleButton text="Sign in with Google" onClick={() => signIn(provider.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
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
