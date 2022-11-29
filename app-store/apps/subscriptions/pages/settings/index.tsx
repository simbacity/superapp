import { userSettingsSchema } from "@app-store/apps/subscriptions/api-contracts/usersettings.schema";
import Layout from "@app-store/apps/subscriptions/components/Layout";
import SettingsForm from "@app-store/apps/subscriptions/components/SettingsForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function PostEdit() {
  const { data: session } = useSession();

  const { data: userSettings } = useGetUserSettings(session?.user.id);

  return (
    <Layout>
      <div className="bg-slate-800 rounded-md py-7">
        <h1 className="text-xl text-white border-b border-gray-300 px-4 pb-7">Settings</h1>
        <div className="flex justify-center">
          <div className="w-1/2 py-8">
            <SettingsForm formValues={userSettings} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function useGetUserSettings(id?: string) {
  const getUserSettings = async (id?: string) => {
    const response = await axios.get(`/api/apps/subscriptions/user-settings/${id}/show`);
    return userSettingsSchema.parse(response.data);
  };

  return useQuery(["subscriptions", "userSettings", "show", id], () => getUserSettings(id));
}
