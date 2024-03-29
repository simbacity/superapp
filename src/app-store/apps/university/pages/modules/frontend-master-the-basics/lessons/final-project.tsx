import markdownStyle from "@app-store/apps/university/styles/Markdown.module.css";
import sanitizeContent from "../../../../utils/sanitize";
import Shell from "../../../../../../shared/components/Shell";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const content = `
Congratulations on all your hard work so far! You should be proud of everything you have learned and the progress you have made. Keep striving for excellence and have fun on your journey.

You now have a strong foundation in frontend development and are ready to put your skills to the test. In this final lesson, you will build your own component library, applying everything you have learned so far. Remember to always write clean, well-organized code and strive to amistakes. This will make your work more valuable to senior developers and they won't need to spend as much time suggesting improvements or providing mentorship.

To help you get started, here's have a quick tutorial that will teach you how to structure your project, use tools like Storybook, and publish your component library to npm. It will give you the tools you need to succeed and make it easier for you to tackle your final project. Good luck and have fun!

**Here's the link to the tutorial:**

<a href="https://dev.to/alexeagleson/how-to-create-and-publish-a-react-component-library-2oe" target="_blank">
  <img src="https://res.cloudinary.com/practicaldev/image/fetch/s--Wzfozk3_--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dxyw74lpvryk4vslvwzc.png" width="300" alt="Component library" />
</a>
<br />

### The task

Your task is to build a simple and functional component library using React, TypeScript, and CSS. To get started, check out the components on the <a href="https://atlassian.design/components/" target="_blank">Atlassian Design System site</a> and pick your 10 favorites. Use the examples and specifications they provide to create your own implementation of these components from scratch, and remember to focus on creating high-quality code – you never know when a senior developer might review it as part of a job application process.

For inspiration and guidance, take a look at the structure and code of other successful component libraries. One great resource is the <a href="https://github.com/themesberg/flowbite-react/tree/main/src/lib/components" target="_blank">Flowbite Github repository</a> – spend some time exploring the source code and see how it's been built. It can serve as a valuable reference as you build your own components – you'll likely find a lot of useful insights and patterns.

When you're done, don't forget to publish your npm package and create a public Github repository for your code. Make sure to include a link to the Storybook.js page showcasing your library as well. With some hard work and attention to detail, this project will be a valuable addition to your portfolio and a great way to demonstrate your abilities to potential employers.

We can't wait to see what you've created! When you're finished, make sure to post a link to your results in the <a href="https://www.simba.city/apps/town-square">Town Square app</a>. We'll review it and provide feedback. This project is a fantastic opportunity for you to show off your skills and prove that you can be a valuable addition to any tech team. Happy coding!
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
            Final project: Build a component library
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
