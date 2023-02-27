import getFolderSize from "get-folder-size";

const FOLDER_PATH = "dist";
const FOLDER_SIZE_LIMIT = 50000;

const size = await getFolderSize.strict(FOLDER_PATH);

if (size > FOLDER_SIZE_LIMIT) {
  throw new Error("Dist folder is too big!");
}
