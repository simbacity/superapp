import { AppImports } from "../../app-store/config/generated-files/frontend.generated";

type Props = {
  path: string;
  props: PageProps;
};

type PageProps = {
  [key: string]: string;
};

export default function Apps({ path, props }: Props) {
  const AppComponent = AppImports[path];

  if (!AppComponent) {
    return (
      <p className="lead-paragraph p-2">404 | This route does not exist.</p>
    );
  }

  return (
    <div>
      <AppComponent {...props} />
    </div>
  );
}

type ServerSideContext = { params: { path: string[] } };
export function getServerSideProps({ params }: ServerSideContext) {
  const { path } = params;

  return { props: getImportPathAndProps(path) };
}

function getImportPathAndProps(path: string[]) {
  const result: Props = { path: "", props: {} };

  const appImportKeys = Object.keys(AppImports);
  const pathString = path.join("/");

  const isExactMatchWithAppImport = appImportKeys.includes(pathString);

  if (isExactMatchWithAppImport) {
    result.path = pathString;
    return result;
  }

  const hasDynamicIdentifier = (path: string) => path.includes("[");
  const dynamicPaths = appImportKeys.filter(hasDynamicIdentifier);

  for (let n = 0; n < dynamicPaths.length; n++) {
    const matchingPathAlreadyFound = result.path.length > 0;
    if (matchingPathAlreadyFound) break;

    const currentDynamicPathItem = dynamicPaths[n];
    if (!currentDynamicPathItem) throw new Error("No dynamic path found");

    // ['mini-blog', '[id]', 'new']
    const dynamicPathArray = currentDynamicPathItem.split("/");

    if (dynamicPathArray.length !== path.length) continue;

    for (let i = 0; i < dynamicPathArray.length; i++) {
      const currentDynamicPathArrayItem = dynamicPathArray[i];
      if (!currentDynamicPathArrayItem) {
        throw new Error("No dynamic path array item found");
      }

      // 'mini-blog' === 'mini-blog'
      if (currentDynamicPathArrayItem === path[i]) {
        result.path = `${result.path}/${path[i] || ""}`;
        // '[id]'.startsWith("[")
      } else if (currentDynamicPathArrayItem.startsWith("[")) {
        // remove first and last character: '[id]' becomes 'id'
        const prop = currentDynamicPathArrayItem.slice(
          1,
          currentDynamicPathArrayItem.length - 1
        );

        result.path = `${result.path}/${dynamicPathArray[i] || ""}`;

        const pathItem = path[i];
        if (!pathItem) throw new Error("No path item found");

        result.props[prop] = pathItem;
      } else {
        result.path = "";
        result.props = {};
        break;
      }
    }
  }

  // remove first "/" from "/mini-blog/[id]/new"
  // we need to remove it because we also don't have it in the generated imports file
  result.path = result.path.slice(1);
  return result;
}
