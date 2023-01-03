import CodingMoonImage from "@app-store/apps/university/assets/coding-moon.png";
import markdownStyle from "@app-store/apps/university/styles/Markdown.module.css";
import sanitizeContent from "@app-store/apps/university/utils/sanitize";
import Shell from "@app-store/shared/components/Shell";
import { ChevronLeftIcon } from "@heroicons/react/solid";
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
      <nav className="fixed w-full bg-gray-900 border-b border-gray-800 border-white">
        <div className="flex items-center h-14 mx-auto max-w-3xl px-3 md:px-0">
          <Link href="/apps/university/">
            <button
              type="button"
              className="flex items-center py-2.5 pl-1 pr-3 text-sm font-medium focus:outline-none rounded-lg focus:z-10 focus:ring-2 focus:ring-gray-700 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700">
              <ChevronLeftIcon className="h-5 w-5 mr-1" /> Back
            </button>
          </Link>
        </div>
      </nav>
      <div className="text-white pt-12 pb-12">
        <div className="mx-auto max-w-3xl px-3 md:px-0 pt-4">
          <h2 className="text-2xl font-bold pb-4 pt-8">Frontend: Master the basics</h2>
          <div
            className={`${markdownStyle["markdown-body"]} pb-8`}
            dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-8">
            {cards.map((card, index) => {
              return (
                <div className="w-full" key={index}>
                  <Card imgSrc={card.imgSrc}>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight pb-2">{card.title}</h3>
                    </div>
                    <div>
                      <Link href={card.url || "#"}>
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
