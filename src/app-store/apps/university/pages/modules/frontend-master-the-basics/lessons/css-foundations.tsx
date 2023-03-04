import markdownStyle from "@app-store/apps/university/styles/Markdown.module.css";
import sanitizeContent from "../../../../utils/sanitize";
import Shell from "../../../../../../shared/components/Shell";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const content = `
As developers, it's important to always strive for excellence and to have a strong foundation in the basics. No matter how much experience you have with CSS, it's always a good idea to make sure you have a deep understanding of the core concepts.

In this lesson, we'll be revisiting the fundamentals of CSS to ensure we have a rock-solid foundation. To do this, your task is to watch the course by freecodecamp and pay close attention to the content. Take the time to fully understand everything, and if you come across anything that isn't clear, don't hesitate to pause the video and do some additional research.

Pay extra attention to the following topics:
\`\`\`
- Box model
- Flexbox (justify-content, align-items, flex-direction, flex-wrap, ...)
- Flex grid
- Positioning (static, relative, absolute, sticky, fixed)
\`\`\`

By the end of this lesson, you'll be well on your way to becoming a CSS master! You should have the knowledge and skills you need to tackle any CSS task with confidence and aintroducing tech debt when writing CSS for frontend components.

**Here's the link to the course:**

<a href="https://www.youtube.com/watch?v=OXGznpKZ_sA" target="_blank">
  <img src="https://img.youtube.com/vi/OXGznpKZ_sA/0.jpg" width="300" alt="CSS foundations" />
</a>
`;
export default function CssFoundations() {
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
          <h2 className="pb-4 pt-8 text-2xl font-bold">CSS foundations</h2>
          <div
            className={markdownStyle["markdown-body"]}
            dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
          />
        </div>
      </div>
    </Shell>
  );
}
