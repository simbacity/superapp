import CodingMoonImage from "@app-store/apps/university/assets/coding-moon.png";
import markdownStyle from "@app-store/apps/university/styles/Markdown.module.css";
import sanitizeContent from "../../../utils/sanitize";
import Shell from "../../../../../shared/components/Shell";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Button, Card } from "flowbite-react";
import Link from "next/link";

const content = `
Hiring junior developers can be a costly and time-consuming process for companies because senior developers often need to devote significant resources to training and mentorship. This is why it's so important for junior developers to focus on mastering the basics and becoming productive team members as quickly as possible.

One way to quickly establish yourself as a valuable member of a development team is by becoming highly skilled at building frontend components. These tasks often don't require a deep understanding of the existing codebase or business logic, and instead rely on writing clean, efficient code within a closed context.

By consistently delivering high-quality work that requires minimal review and feedback, you can demonstrate your skills and earn the trust and respect of your colleagues. Let's get started on the path to achieving this level of expertise!
`;

const cards = [
  {
    title: "CSS foundations",
    imgSrc: CodingMoonImage.src,
    url: "/apps/university/modules/frontend-master-the-basics/lessons/css-foundations",
  },
  {
    title: "React foundations",
    imgSrc: CodingMoonImage.src,
    url: "/apps/university/modules/frontend-master-the-basics/lessons/react-foundations",
  },
  {
    title: "JavaScript & TypeScript foundations",
    imgSrc: CodingMoonImage.src,
    url: "/apps/university/modules/frontend-master-the-basics/lessons/javascript-and-typescript-foundations",
  },
  {
    title: "React with TypeScript foundations",
    imgSrc: CodingMoonImage.src,
    url: "/apps/university/modules/frontend-master-the-basics/lessons/react-with-typescript-foundations",
  },
  {
    title: "UI design foundations",
    imgSrc: CodingMoonImage.src,
    url: "/apps/university/modules/frontend-master-the-basics/lessons/ui-design-foundations",
  },
  {
    title: "Final project: Build a component library",
    imgSrc: CodingMoonImage.src,
    url: "/apps/university/modules/frontend-master-the-basics/lessons/final-project",
  },
];

export default function Module() {
  const sanitizedHtmlContent = sanitizeContent(content);

  return (
    <Shell>
      <nav className="fixed w-full border-b border-white bg-gray-900">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-3 md:px-0">
          <Link href="/apps/university/">
            <button
              type="button"
              className="flex items-center rounded-lg border-gray-600 py-2.5 pl-1 pr-3 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-700"
            >
              <ChevronLeftIcon className="mr-1 h-5 w-5" /> Back
            </button>
          </Link>
        </div>
      </nav>
      <div className="pt-12 pb-12 text-white">
        <div className="mx-auto max-w-3xl px-3 pt-4 md:px-0">
          <h2 className="pb-4 pt-8 text-2xl font-bold">
            Frontend: Master the basics
          </h2>
          <div
            className={`${markdownStyle["markdown-body"] || ""} pb-8`}
            dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
          />
          <div className="grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2">
            {cards.map((card, index) => {
              return (
                <div className="w-full" key={index}>
                  <Card imgSrc={card.imgSrc}>
                    <div>
                      <h3 className="pb-2 text-xl font-bold tracking-tight">
                        {card.title}
                      </h3>
                    </div>
                    <div>
                      <Link href={card.url || "#"} className="inline-block">
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
