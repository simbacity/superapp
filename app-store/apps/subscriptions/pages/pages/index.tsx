import Layout from "@app-store/apps/subscriptions/components/Layout";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

export default function LandingPage() {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <ExclamationCircleIcon className="w-20 text-red-800" />
        <h1 className="h1 text-gray-300 mb-8">Your landing page will be displayed here</h1>
        <p className="text-md text-gray-300">
          Your account is in trial state and after being fully onboarded you will be able to create your own
          landing page in here.
        </p>
      </div>
    </Layout>
  );
}
