import chokidar from "chokidar";
import { debounce } from "lodash";

import AppStoreApiFileGenerator from "../business-logic/app-store-api-file-generator.entity";
import AppStoreFrontendFileGenerator from "../business-logic/app-store-frontend-file-generator.entity";
import { APPS_PATH } from "../constants";

const appStoreFrontendFileGeneratorEntity = new AppStoreFrontendFileGenerator();
const appStoreApiFileGeneratorEntity = new AppStoreApiFileGenerator();

const IS_WATCH_MODE = process.argv[2] === "--watch";

if (IS_WATCH_MODE) {
  startWatcher();
} else {
  generateFiles();
}

function startWatcher() {
  const watcher = chokidar.watch(APPS_PATH);
  watcher
    .on("add", () => debouncedGenerateFiles())
    .on("change", () => debouncedGenerateFiles())
    .on("unlink", () => debouncedGenerateFiles())
    .on("addDir", () => debouncedGenerateFiles())
    .on("unlinkDir", () => debouncedGenerateFiles());
}

const debouncedGenerateFiles = debounce(generateFiles, 300);
function generateFiles() {
  appStoreFrontendFileGeneratorEntity.generateFile();
  appStoreApiFileGeneratorEntity.generateFile();
}
