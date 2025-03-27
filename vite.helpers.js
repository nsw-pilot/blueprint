import { resolve } from 'path';
import { existsSync, readdirSync } from 'fs';

const getBlockEntry = (blockName, fileType) => {
  const filePath = resolve(__dirname, `src/blocks/${blockName}/${blockName}.${fileType}`);
  return existsSync(filePath) ? filePath : null;
};

const getBlockNamesFromSrcFolder = () => {
  const blocksPath = resolve(__dirname, 'src/blocks');
  try {
    return readdirSync(blocksPath);
  } catch (error) {
    console.error(`Failed to read directory at ${blocksPath}`, error);
    return [];
  }
};

export default function () {
  const blockNames = getBlockNamesFromSrcFolder();
  let entries = {};
  blockNames.forEach((blockName) => {
    const jsEntry = { [blockName]: getBlockEntry(blockName, 'js') };
    entries = { ...entries, ...jsEntry };
  });
  return entries;
}
