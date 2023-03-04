import markdownStyle from "@app-store/apps/university/styles/Markdown.module.css";
import sanitizeContent from "../../../../utils/sanitize";
import Shell from "../../../../../../shared/components/Shell";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const content = `
It's time to focus on React! Mastering the basics of React will open up a world of job opportunities and enable you to build frontend features like a pro. Plus, having a strong foundation in React will set you up for success as you continue to grow and develop as a developer. Ready to get started? Let's dive into the next two courses!

### React fundamentals with Bob Ziroll

This course provides a comprehensive review of the essential concepts in React, helping you solidify your understanding of the framework. With over 140 interactive coding challenges and eight engaging projects, you'll have the opportunity to put your skills to the test and build a strong foundation in modern React development. By the end, you'll have a solid understanding of the basics and be ready to tackle more advanced React concepts.

**Here's the link to the course:**

<a href="https://scrimba.com/learn/learnreact" target="_blank">
  <img src="https://pbs.twimg.com/media/FD7JxC-VEAU6Zo1.jpg" width="300" alt="React fundamentals course" />
</a>

### Advanced React taught by Meta Staff
In this course, you'll become proficient in using different types of React components and understanding when to use them. You'll also learn to create your own custom hooks and build forms with React. Additionally, you'll explore techniques for composing components and delve into React testing and tooling. By the end, you'll have built a web application that consumes API data and become proficient in advanced React concepts.

**Here's the link to the course:**

<a href="https://www.coursera.org/learn/advanced-react" target="_blank">
  <img src="https://s3.amazonaws.com/coursera_assets/meta_images/generated/XDP/XDP~COURSE!~advanced-react/XDP~COURSE!~advanced-react.jpeg" width="300" alt="Advanced React course" />
</a>
`;
export default function ReactFoundations() {
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
          <h2 className="pb-4 pt-8 text-2xl font-bold">React foundations</h2>
          <div
            className={markdownStyle["markdown-body"]}
            dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
          />
        </div>
      </div>
    </Shell>
  );
}
