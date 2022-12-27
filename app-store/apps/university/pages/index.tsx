import Logo from "@app-store/apps/university/assets/logo.svg";
import Shell from "@app-store/shared/components/Shell";
import { ChartBarIcon } from "@heroicons/react/solid";
import { Button, Card, Progress } from "flowbite-react";

export default function University() {
  return (
    <Shell>
      <nav className="border-b border-white">
        <div className="flex items-center h-16 mx-auto max-w-3xl px-3 md:px-0">
          <img src={Logo.src} className="mr-3 h-8" />
        </div>
      </nav>
      <div className="text-white">
        <div className="mx-auto max-w-3xl px-3 md:px-0">
          <header>
            <div className="py-8">
              <h1 className="text-3xl font-normal pb-2">
                MiniMasters Program in <span className="font-bold">Software Engineering</span>
              </h1>
              <p>
                Our MiniMasters program is designed to give you deep learning and expertise in Software
                Engineering, making you highly qualified and competitive in the job market.
              </p>
            </div>
          </header>
          <section>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="max-w-sm">
                <Card>
                  <h3 className="text-xl font-bold tracking-tight">Your credits</h3>
                  <p className="font-normal text-sm text-gray-400">
                    Earn 100 credits for receiving your MiniMasters degree.
                  </p>
                  <Progress
                    progress={20}
                    size="lg"
                    color="dark"
                    label="20/100 credits"
                    labelPosition="outside"
                  />
                </Card>
              </div>
              <div className="max-w-sm">
                <Card>
                  <ChartBarIcon className="w-8 h-8 text-gray-400" />
                  <h3 className="text-xl font-bold tracking-tight">Advanced level</h3>
                  <p className="font-normal text-sm text-gray-400">
                    Designed for those already know how to code.
                  </p>
                </Card>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold pb-4 pt-8">Modules</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="max-w-sm">
                <Card imgSrc="https://dummyimage.com/600x220/224699/224699.png">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight pb-2">Advanced Full-Stack</h3>
                    <p className="font-normal text-sm text-gray-400">5/20 credits</p>
                  </div>
                  <div>
                    <Button color="light">Open</Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
