import getFolderSize from "get-folder-size";

const FOLDER_PATH = "dist";
const FOLDER_SIZE_LIMIT = 50000;

const size = await getFolderSize.strict(FOLDER_PATH);

size > FOLDER_SIZE_LIMIT ? console.log(-1) : console.log(0);
