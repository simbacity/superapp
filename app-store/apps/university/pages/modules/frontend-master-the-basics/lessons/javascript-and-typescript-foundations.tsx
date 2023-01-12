import markdownStyle from "@app-store/apps/university/styles/Markdown.module.css";
import sanitizeContent from "@app-store/apps/university/utils/sanitize";
import Shell from "@app-store/shared/components/Shell";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import Link from "next/link";

const content = `
Now is the time to hone your skills in JavaScript and TypeScript. A strong foundation in JavaScript and TypeScript will serve you well as you continue to grow and evolve as a developer. It's crucial to have a solid grasp of the programming languages you're working with, so take the time to fully understand these languages. Are you ready to get started on this exciting journey? Let's continue with the next set of courses!

### JavaScript deep dive with Reed Barger

This advanced JavaScript course will provide a thorough and structured exploration of the key concepts of the language. With a focus on foundational concepts, this course will equip you with the knowledge and skills you need to confidently discuss JavaScript with colleagues or correctly answer questions about the language during job interviews. By the end of the course, you'll have a strong understanding of advanced JavaScript and be well-prepared to navigate a range of professional contexts.

**Here's the link to the course:**

<a href="https://scrimba.com/learn/javascript" target="_blank">
  <img src="https://4.bp.blogspot.com/-s2EhTt57oeU/XHtQtO1QNLI/AAAAAAAANW8/KYkPQEZUyocSpA2RzqCcVt31imXPi63RACLcBGAs/s1600/Free%2BCourses%2Bto%2Blearn%2BJavaScript.jpg" width="300" alt="React fundamentals course" />
</a>

### Learn Typescript with Ania Kubow

In this course, you will learn how to use TypeScript, a typed superset of JavaScript, to improve the structure and reliability of your code. You will learn how to apply the concepts you already know from JavaScript to the TypeScript language, and use its features such as classes and interfaces to organize your code. You will also learn how to use the TypeScript linter to catch errors and improve your workflow. One advantage of using TypeScript when working in a team is that it enforces a certain level of consistency in the codebase, which can make it easier to collaborate and maintain the project. This course will provide you with the skills to take your programming to the next level and effectively work with others on projects.

**Here's the link to the course:**

<a href="https://scrimba.com/learn/typescript" target="_blank">
  <img src="https://i.ytimg.com/vi/Z7O5pQwCmqI/maxresdefault.jpg" width="300" alt="Typescript fundamentals course" />
</a>

`;
export default function JavascriptAndTypescriptFoundations() {
  const sanitizedHtmlContent = sanitizeContent(content);

  return (
    <Shell>
      <nav className="fixed w-full bg-gray-900 border-b border-gray-800 border-white">
        <div className="flex items-center h-14 mx-auto max-w-3xl px-3 md:px-0">
          <Link href="/apps/university/modules/frontend-master-the-basics">
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
          <h2 className="text-2xl font-bold pb-4 pt-8">JavaScript & TypeScript foundations</h2>
          <div
            className={markdownStyle["markdown-body"]}
            dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
          />
        </div>
      </div>
    </Shell>
  );
}
