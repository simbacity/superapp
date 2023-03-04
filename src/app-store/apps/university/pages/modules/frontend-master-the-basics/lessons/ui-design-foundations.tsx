import markdownStyle from "@app-store/apps/university/styles/Markdown.module.css";
import sanitizeContent from "../../../../utils/sanitize";
import Shell from "../../../../../../shared/components/Shell";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const content = `
As a developer, it's crucial to have a strong understanding of design principles. Not only will this improve communication with designers and help you understand their vision, but it'll also give you a better intuition for translating designs into code. This leads to more polished and accurate results, which means less time spent on revisions. Taking the time to learn about design will make you a more effective and efficient developer. The next course will help you to brush up on your design skills.

### About the course

In this course you will delve into the core principles of user interface design. From layout and typography to color theory and user experience, this course covers all the essential topics needed to create visually stunning and intuitive interfaces. You will learn how to apply design principles to your HTML and CSS code, creating layouts that are both aesthetically pleasing and effective at communicating your message.

**Here's the link to the course:**

<a href="https://scrimba.com/learn/design" target="_blank">
  <img src="https://selftaughttxg.com/static/46b88740da996467b06e1251e4a58c45/25be5/UI_Design_Fundamentals.png" width="300" alt="React with Typescript course" />
</a>
`;
export default function ReactWithTypescriptFoundations() {
  const sanitizedHtmlContent = sanitizeContent(content);

  return (
    <Shell>
      <nav className="fixed w-full border-b border-gray-800 border-white bg-gray-900">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-3 md:px-0">
          <Link href="/apps/university/modules/frontend-master-the-basics">
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
            UI design foundations
          </h2>
          <div
            className={markdownStyle["markdown-body"]}
            dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
          />
        </div>
      </div>
    </Shell>
  );
}
