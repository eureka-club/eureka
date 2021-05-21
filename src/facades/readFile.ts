import fs from 'fs';
import util from 'util';

export default async (filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string | null> => {
  try {
    const rf = util.promisify(fs.readFile);
    const buf = await rf(filePath);
    const res = buf.toString(encoding);
    return res;
  } catch (error) {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.error(error);
    return null;
  }
};
