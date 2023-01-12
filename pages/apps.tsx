import { useGetAllMessages } from "@app-store/apps/town-square/pages";
import Shell from "@app-store/shared/components/Shell";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // Prefetch & cache messages from Town Square for a faster navigation experience
  useGetAllMessages();

  return (
    <Shell>
      <div className="grid grid-cols-4 gap-4 gap-y-10 max-w-3xl px-2 m-auto pt-10 md:pt-14 md:gap-y-14 text-white text-xs text-center">
        <div>
          <Link href="/apps/town-square">
            <Image
              src="/home-screen/town_square.svg"
              height={60}
              width={60}
              alt="town square"
              className="m-auto"
            />
          </Link>
          <div className="pt-2">Town Square</div>
        </div>
        <div>
          <Link href="/apps/university">
            <Image
              src="/home-screen/university.svg"
              height={60}
              width={60}
              alt="university"
              className="m-auto"
            />
          </Link>
          <div className="pt-2">University</div>
        </div>
        <div>
          <Link href="/apps/jobs">
            <Image src="/home-screen/jobs.svg" height={60} width={60} alt="jobs" className="m-auto" />
          </Link>
          <div className="pt-2">Jobs</div>
        </div>
        <div>
          <Link href="/apps/wallet">
            <Image src="/home-screen/wallet.svg" height={60} width={60} alt="wallet" className="m-auto" />
          </Link>
          <div className="pt-2">Wallet</div>
        </div>
        <div>
          <Link href="/app-store">
            <Image
              src="/home-screen/app_store.svg"
              height={60}
              width={60}
              alt="app store"
              className="m-auto"
            />
          </Link>
          <div className="pt-2">App Store</div>
        </div>
      </div>
    </Shell>
  );
}
