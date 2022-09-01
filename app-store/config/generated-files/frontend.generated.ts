// *********************************************************************
// This file is autogenerated with /cli/app-store-generate-files.ts
// Don't modify this file manually
// *********************************************************************
import dynamic from "next/dynamic";

type Imports = { [key: string]: React.ElementType };

export const AppImports: Imports = {
  "mini-blog": dynamic(() => import("@app-store/apps/mini-blog/pages/index")),
  "mini-blog/posts/[id]/edit": dynamic(() => import("@app-store/apps/mini-blog/pages/posts/[id]/edit")),
  "mini-blog/posts/[id]": dynamic(() => import("@app-store/apps/mini-blog/pages/posts/[id]/index")),
  "simba-design-system": dynamic(() => import("@app-store/apps/simba-design-system/pages/index")),
  "todos/[id]/edit": dynamic(() => import("@app-store/apps/todos/pages/[id]/edit")),
  "todos/[id]": dynamic(() => import("@app-store/apps/todos/pages/[id]/index")),
  "todos": dynamic(() => import("@app-store/apps/todos/pages/index")),
};
