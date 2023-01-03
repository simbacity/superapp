import CodingMoonImage from "@app-store/apps/university/assets/coding-moon.png";
import LockedBackgroundImage from "@app-store/apps/university/assets/locked-background.png";
import Logo from "@app-store/apps/university/assets/logo.svg";
import Shell from "@app-store/shared/components/Shell";
import { ChartBarIcon } from "@heroicons/react/solid";
import { Button, Card, Progress } from "flowbite-react";
import Link from "next/link";

const cards = [
  { title: "Frontend: Master the basics", imgSrc: CodingMoonImage.src },
  { title: "Full-Stack: Master the basics", imgSrc: LockedBackgroundImage.src },
  { title: "Full-Stack: Advanced concepts", imgSrc: LockedBackgroundImage.src },
  { title: "Working in complex environments", imgSrc: LockedBackgroundImage.src },
  { title: "Final project", imgSrc: LockedBackgroundImage.src },
];

export default function University() {
  return (
    <Shell>
      <nav className="border-b border-white">
        <div className="flex items-center h-16 mx-auto max-w-3xl px-3 md:px-0">
          <img src={Logo.src} className="mr-3 h-8" />
        </div>
      </nav>
      <div className="text-white pb-12">
        <div className="mx-auto max-w-3xl px-3 md:px-0">
          <header>
            <div className="py-8">
              <h1 className="text-3xl font-normal pb-2">
                Mastery Program in <span className="font-bold">Software Engineering</span>
              </h1>
              <p>
                Our Mastery program is designed to give you deep learning and expertise in Software
                Engineering, making you highly qualified and competitive in the global job market.
              </p>
            </div>
          </header>
          <section>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <Card>
                  <h3 className="text-xl font-bold tracking-tight">Your credits</h3>
                  <p className="font-normal text-sm text-gray-400">
                    Earn 100 credits for receiving your Mastery degree.
                  </p>
                  <Progress
                    progress={0}
                    size="lg"
                    color="dark"
                    label="0/100 credits"
                    labelPosition="outside"
                  />
                </Card>
              </div>
              <div className="w-full">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-8">
              {cards.map((card, index) => {
                return (
                  <div className="w-full" key={index}>
                    <Card imgSrc={card.imgSrc}>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight pb-2">{card.title}</h3>
                        <p className="font-normal text-sm text-gray-400">0/20 credits</p>
                      </div>
                      <div>
                        <Link
                          href={index === 0 ? "/apps/university/modules/frontend-master-the-basics" : "#"}
                          className="inline-block">
                          <Button color="light" disabled={index !== 0}>
                            Open
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
