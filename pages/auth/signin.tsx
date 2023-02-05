import { IS_PRODUCTION } from "@app-store/shared/utils/config/constants";
import { CtxOrReq } from "next-auth/client/_utils";
import { Provider } from "next-auth/providers";
import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react";

import SignInAsDummyUser from "@components/shared/SignInAsDummyUser";
import SignInWithGoogleButton from "@components/shared/SignInWithGoogleButton";

interface SignInProps {
  providers: Providers;
}

interface Providers {
  google: Provider;
  credentials: Provider;
}

export default function SignIn({ providers }: SignInProps) {
  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="text-center">
        {!IS_PRODUCTION && <SignInAsDummyUser providerId={providers.credentials.id} />}
        <SignInWithGoogleButton text="Sign in with Google" onClick={() => signIn(providers.google.id)} />
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
