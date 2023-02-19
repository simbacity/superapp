import Shell from "../../../shared/components/Shell";
import { LockClosedIcon } from "@heroicons/react/24/solid";

export default function Jobs() {
  return (
    <Shell>
      <div className="layout py-20 text-center">
        <div>
          <LockClosedIcon className="m-auto mb-4 h-10 w-10 text-white" />
          <h3 className="h3">This app is only available for E-Residents.</h3>
        </div>
      </div>
    </Shell>
  );
}
