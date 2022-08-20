import chokidar from "chokidar";
import { debounce } from "lodash";
import path from "path";

import AppStoreApiFileGenerator from "../business-logic/AppStoreApiFileGenerator";
import AppStoreFrontendFileGenerator from "../business-logic/AppStoreFrontendFileGenerator";

const APPS_PATH = path.join(__dirname, "..", "app-store", "apps");
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
