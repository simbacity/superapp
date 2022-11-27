import { Disclosure, Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import router from "next/router";
import { ReactNode, useEffect, Fragment } from "react";

const DEFAULT_PROFILE_IMAGE = "https://www.gravatar.com/avatar?d=mp&s=50";
const DEFAULT_USER_NAME = "Simba user";

export default function Shell(props: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
    if (!loading && !session) window.location.href = "/";
  }, [loading, session]);

  const signOutAndRedirectToHome = () => {
    signOut().then(() => router.push("/"));
  };

  if (!session) {
    return <div className="h1 p-8">Loading...</div>;
  }

  return (
    <>
      <Disclosure as="nav">
        {() => (
          <div className="fixed bottom-0 right-0 z-50">
            <Menu as="div" className="relative mx-3 mb-4">
              <div>
                <Menu.Button
                  tabIndex={10}
                  className="bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-blue-500 flex items-center max-w-xs text-sm rounded-full border-2 border-slate-600">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-14 h-14 rounded-full"
                    referrerPolicy="no-referrer"
                    src={session?.user.image || DEFAULT_PROFILE_IMAGE}
                    alt={session?.user.name || DEFAULT_USER_NAME}
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="-translate-y-full absolute right-0 -top-4 w-48 py-1 mt-2 origin-top-right bg-white border-2 border-slate-300">
                  <Menu.Item key="close-app">
                    {({ active }) => (
                      <a
                        onClick={() => router.push("/apps")}
                        className={`${
                          active ? "bg-slate-300" : "bg-white"
                        } text-slate-700 block px-6 py-4 font-mono cursor-pointer hover:bg-slate-200 focus:bg-slate-300 active:bg-slate-300`}>
                        Home
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item key="sign-out">
                    {({ active }) => (
                      <a
                        onClick={() => signOutAndRedirectToHome()}
                        className={`${
                          active ? "bg-slate-300" : "bg-white"
                        } text-slate-700 block px-6 py-4 font-mono cursor-pointer hover:bg-slate-200 focus:bg-slate-300 active:bg-slate-300`}>
                        Sign out
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        )}
      </Disclosure>

      <main>{props.children}</main>
    </>
  );
}
