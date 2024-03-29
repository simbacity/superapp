import markdownStyle from "@app-store/apps/university/styles/Markdown.module.css";
import sanitizeContent from "../../../../utils/sanitize";
import Shell from "../../../../../../shared/components/Shell";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const content = `
React and TypeScript are a powerful combination for building web applications. TypeScript's strong typing helps to catch errors and bugs before you even run your code, making it easier to maintain and scale applications. It also improves code readability, provides a better developer experience with better tooling support, and helps teams collaborate more effectively by providing a shared language for discussing the shape of data within a codebase. Using React with TypeScript can help teams to build more reliable, maintainable, and scalable applications. Let's continue with a course on using React together with Typescript.

### React & TypeScript course

In this course, you will learn how to use TypeScript to build robust and scalable React applications. It will begin by covering the fundamentals of TypeScript, including how to declare variables and create functions. From there, you will learn how to integrate TypeScript into a React app, utilizing powerful features such as Hooks and prop typing to enhance the functionality of your components. Throughout the course, you will have the opportunity to build an impressive project that showcases your new skills and knowledge. By the end, you will be well-versed in the use of TypeScript to build dynamic and efficient React apps.

**Here's the link to the course:**

<a href="https://www.youtube.com/watch?v=FJDVKeh7RJI" target="_blank">
  <img src="https://img.youtube.com/vi/FJDVKeh7RJI/0.jpg" width="300" alt="React with Typescript course" />
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
            React with TypeScript foundations
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
