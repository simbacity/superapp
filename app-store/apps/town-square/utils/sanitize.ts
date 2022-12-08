import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

export default function sanitizeContent(content: string) {
  const sanitizedHtmlContent = remark()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .processSync(content)
    .toString();

  return sanitizedHtmlContent;
}
