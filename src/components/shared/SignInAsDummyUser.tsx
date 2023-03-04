import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

interface SignInAsDummyUserProps {
  providerId: string;
}

interface FormData {
  email: string;
}

export default function SignInAsDummyUser({
  providerId,
}: SignInAsDummyUserProps) {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { email: "dummy@example.com" },
  });

  const onSubmit = async (data: FormData) => {
    return signIn(providerId, { email: data.email, callbackUrl: "/apps" });
  };

  return (
    <div className="mb-4 max-w-xl border-8 border-solid border-red-600 bg-gray-700 p-8 text-center">
      <div>
        <h1 className="h3">Only available in development mode</h1>
        <p className="paragraph">
          This will sign you in as a dummy user. You can create as many users as
          you like by using different email addresses.
        </p>
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("email")}
            type="email"
            name="email"
            className="input w-full"
          />
          <button type="submit" className="primary-button--medium w-full">
            Sign in as dummy user
          </button>
        </form>
      </div>
    </div>
  );
}
