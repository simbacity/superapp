import CodingMoonImage from "@app-store/apps/university/assets/coding-moon.png";
import Shell from "@app-store/shared/components/Shell";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { Button, Card } from "flowbite-react";
import Link from "next/link";

const cards = [
  { title: "CSS basics", imgSrc: CodingMoonImage.src, url: "https://www.youtube.com/watch?v=OXGznpKZ_sA" },
  { title: "React basics", imgSrc: CodingMoonImage.src, url: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
  {
    title: "Typescript basics",
    imgSrc: CodingMoonImage.src,
    url: "https://www.youtube.com/watch?v=30LWjhZzg50",
  },
  {
    title: "React & Typescript basics",
    imgSrc: CodingMoonImage.src,
    url: "https://www.youtube.com/watch?v=FJDVKeh7RJI",
  },
  {
    title: "Final project: Build a component library",
    imgSrc: CodingMoonImage.src,
    url: "https://atlassian.design/components/avatar-group/examples",
  },
];

export default function Module() {
  return (
    <Shell>
      <div className="text-white pb-12">
        <div className="mx-auto max-w-3xl px-3 md:px-0 pt-4">
          <Link href="/apps/university/">
            <Button color="gray" className="pr-2">
              <ChevronLeftIcon className="h-5 w-5 mr-1" /> Back
            </Button>
          </Link>
          <h2 className="text-2xl font-bold pb-4 pt-8">Frontend: Master the basics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-8">
            {cards.map((card, index) => {
              return (
                <div className="w-full" key={index}>
                  <Card imgSrc={card.imgSrc}>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight pb-2">{card.title}</h3>
                    </div>
                    <div>
                      <Link href="#">
                        <Button color="light">Open</Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Shell>
  );
}
