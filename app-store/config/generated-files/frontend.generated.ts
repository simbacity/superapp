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
  "mini-blog/posts/new": dynamic(() => import("@app-store/apps/mini-blog/pages/posts/new")),
  "simba-design-system": dynamic(() => import("@app-store/apps/simba-design-system/pages/index")),
  "town-square": dynamic(() => import("@app-store/apps/town-square/pages/index")),
  "town-square/threads/[id]": dynamic(() => import("@app-store/apps/town-square/pages/threads/[id]/index")),
  "university": dynamic(() => import("@app-store/apps/university/pages/index")),
};
