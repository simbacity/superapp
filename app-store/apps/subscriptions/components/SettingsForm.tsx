import {
  UserSettingsRequest,
  userSettingsRequestSchema,
  UserSettingsResponse,
  userSettingsSchema,
} from "@app-store/apps/subscriptions/api-contracts/usersettings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface SettingsFormParams {
  formValues?: UserSettingsResponse;
}

export default function SettingsForm({ formValues }: SettingsFormParams) {
  const form = useForm<UserSettingsRequest>({
    defaultValues: formValues || {},
    resolver: zodResolver(userSettingsRequestSchema),
  });
  const formErrors = form.formState.errors;
  const router = useRouter();
  const updateUserSettings = useUpdateOrCreateUserSettings();

  function onSubmitHandler(data: UserSettingsRequest) {
    updateUserSettings.mutate(data, {
      onSuccess: () => {
        alert("Settings updated successfully.");
      },
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmitHandler, (e) => {
        console.log(e);
      })}>
      <div>
        <h1 className="text-xl font-bold text-gray-300 mb-4">
          Configure the way you present your to your subscribers.
        </h1>
      </div>
      <div>
        <label htmlFor="label_display_name" className="text-sm text-gray-200">
          Display name - this will be displayed at the top of each post it.
        </label>
        <input
          {...form.register("displayName")}
          id="label_display_name"
          name="displayName"
          type="text"
          className="input my-4"
          placeholder="Display name"
        />
        {formErrors.displayName?.message && <p className="error-text">{formErrors.displayName?.message}</p>}
      </div>
      <div>
        <label htmlFor="label_welcome_message" className="text-xs text-gray-200">
          Welcome Message - this is the text the users will get via SMS once they subscribe to you. It is your
          first communication with them - make sure to greet them well :)!
        </label>
        <>
          <input
            {...form.register("welcomeMessage")}
            id="label_welcome_message"
            name="welcomeMessage"
            type="text"
            className="input my-4"
            placeholder="Welcome message"
          />
          {formErrors.welcomeMessage?.message && (
            <p className="error-text">{formErrors.welcomeMessage.message}</p>
          )}
        </>
      </div>
      <div>
        <p className="text-lg text-gray-300">Personal data settings, internal information for HeyDaily use</p>
        <div>
          <label htmlFor="label_name" className="text-xs text-gray-200">
            Name
          </label>
          <>
            <input
              {...form.register("name")}
              id="label_name"
              name="name"
              type="text"
              className="input mb-5"
              placeholder="Name"
            />
            {formErrors.name?.message && <p className="error-text">{formErrors.name.message}</p>}
          </>
        </div>
        <div>
          <label htmlFor="label_content" className="text-xs text-gray-200">
            Surname
          </label>
          <>
            <input
              {...form.register("surname")}
              id="label_surname"
              name="surname"
              type="text"
              className="input mb-5"
              placeholder="Surname"
            />
            {formErrors.surname?.message && <p className="error-text">{formErrors.surname.message}</p>}
          </>
        </div>
        <div>
          <label htmlFor="label_phone" className="text-xs text-gray-200">
            Phone number
          </label>
          <>
            <input
              {...form.register("phone")}
              id="label_phone"
              name="phone"
              type="text"
              className="input mb-5"
              placeholder="Phone number"
            />
            {formErrors.phone?.message && <p className="error-text">{formErrors.phone.message}</p>}
          </>
        </div>
      </div>
      <div>
        <button onClick={() => router.back()} className="invisible-button--medium">
          Cancel
        </button>
        <button type="submit" disabled={updateUserSettings.isLoading} className="default-button--medium">
          Update
        </button>
      </div>
    </form>
  );
}

export function useUpdateOrCreateUserSettings() {
  const queryClient = useQueryClient();

  const updateUserSettings = async (data: UserSettingsRequest) => {
    const response = await axios.post("/api/apps/subscriptions/user-settings/create", data);
    return userSettingsSchema.parse(response.data);
  };

  return useMutation(updateUserSettings, {
    onSuccess: () => {
      queryClient.invalidateQueries(["subscriptions", "userSettings", "show"]);
    },
  });
}
