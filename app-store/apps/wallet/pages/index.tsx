import Shell from "@app-store/shared/components/Shell";
import { LockClosedIcon } from "@heroicons/react/solid";

export default function Jobs() {
  return (
    <Shell>
      <div className="layout py-20 text-center">
        <div>
          <LockClosedIcon className="w-10 h-10 text-white m-auto mb-4" />
          <h3 className="h3">This app is only available for E-Residents.</h3>
        </div>
      </div>
    </Shell>
  );
}
