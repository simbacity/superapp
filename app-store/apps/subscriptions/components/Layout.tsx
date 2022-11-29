import MenuItem from "@app-store/apps/subscriptions/components/Menu";
import Shell from "@app-store/shared/components/Shell";
import {
  MenuIcon,
  SunIcon,
  DocumentAddIcon,
  ChatAltIcon,
  ChartBarIcon,
  OfficeBuildingIcon,
  CogIcon,
} from "@heroicons/react/outline";
import { useState } from "react";

interface LayoutParams {
  children: React.ReactChild;
}

const sideMenu = [
  { title: "Welcome", icon: <SunIcon className="w-8 mr-2 text-gray-200" />, href: "/apps/subscriptions" },
  {
    title: "New Post",
    description: "Send New Post",
    icon: <DocumentAddIcon className="w-8 mr-2 text-gray-200" />,
    href: "/apps/subscriptions/posts/new",
  },
  {
    title: "Posts",
    description: "Browse Past And Scheculed Posts",
    icon: <ChatAltIcon className="w-8 mr-2 text-gray-200" />,
    href: "/apps/subscriptions/posts",
  },
  {
    title: "Subscriber metrics",
    icon: <ChartBarIcon className="w-8 mr-2 text-gray-200" />,
    href: "/apps/subscriptions/stats",
  },
  {
    title: "Landing page",
    description: "Create And Update Your Sales Page",
    icon: <OfficeBuildingIcon className="w-8 mr-2 text-gray-200" />,
    href: "/apps/subscriptions/pages",
  },
  {
    title: "User settings",
    icon: <CogIcon className="w-8 mr-2 text-gray-200" />,
    href: "/apps/subscriptions/settings",
  },
];

export default function Layout({ children }: LayoutParams) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);

  return (
    <Shell>
      <div className="flex flex-col h-screen">
        <div className="flex px-4 justify-between items-center h-16  w-2/12">
          <p className="text-xl font-bold text-gray-300">Subscriptions</p>
          <button onClick={() => setIsSideMenuVisible(!isSideMenuVisible)}>
            <MenuIcon className="w-8 text-gray-200 bg-gray-500 rounded-md hover:bg-gray-700" />
          </button>
        </div>
        <div className="flex flex-auto pt-8 px-4 overflow-auto">
          <div
            className={`flex flex-col justify-space-between ${isSideMenuVisible ? "w-2/12" : "w-0"} ${
              isSideMenuVisible ? "visible" : "hidden"
            }`}>
            <div className="pt-5">
              {sideMenu.map((item) => (
                <MenuItem key={item.title} params={item} />
              ))}
            </div>
          </div>
          <div className={`overflow-auto bg-slate-500 p-5 ${isSideMenuVisible ? "w-10/12" : "w-full"}`}>
            {children}
          </div>
        </div>
      </div>
    </Shell>
  );
}
