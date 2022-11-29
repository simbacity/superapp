import Layout from "@app-store/apps/subscriptions/components/Layout";
import Shell from "@app-store/shared/components/Shell";
import { InformationCircleIcon, ChatIcon, ChatAltIcon } from "@heroicons/react/outline";
import Link from "next/link";

interface CardParams {
  params: {
    title: string;
    icon: React.ReactElement;
    href: string;
  };
}

export default function Index() {
  const Card = ({ params }: CardParams) => (
    <Link href={params.href}>
      <div className="flex flex-col bg-slate-800 w-56 h-48 rounded-lg items-center justify-center cursor-pointer">
        <h1 className="text-white text-xl font-bold">{params.title}</h1>
        {params.icon}
      </div>
    </Link>
  );

  return (
    <Shell>
      <Layout>
        <div>
          <div className="rounded-lg bg-slate-800 py-7">
            <h1 className="text-xl text-white border-b border-gray-300 px-4 pb-7">
              Welcome to the HeyDaily dashboard
            </h1>
            <p className="text-md text-gray-200 px-4 py-7">
              Here you can create and schedule posts, design your profile, build your landing page and see how
              many subscribers you have. For a complete tour check out: this video where you can find all
              necessary informations.
            </p>
            <div className="flex items-center border rounded-md mx-4 p-4">
              <InformationCircleIcon className="w-8 text-slate-100" />
              <p className="text-md text-gray-200 ml-2">
                Info
                <br />
                Your account is currently in a restricted trial mode. To activate it completely so you start
                getting subscribers please complete this form if you’ve not done so already.
              </p>
            </div>
          </div>
          <div className="flex justify-around my-14">
            <Card
              params={{
                title: "MultiMedia Post",
                href: "/apps/subscriptions/posts/new",
                icon: <ChatIcon className="w-20 text-blue-600" />,
              }}
            />
            <Card
              params={{
                title: "Quick SMS Message",
                href: "/apps/subscriptions/posts/new",
                icon: <ChatAltIcon className="w-20 text-blue-600" />,
              }}
            />
          </div>
        </div>
      </Layout>
    </Shell>
  );
}
