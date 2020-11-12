import fs from 'fs';

export function convertStringToNumber(string?: string) {
  if (string) return parseFloat(string);
  else return 0;
}

export function getFilesizeInBytes(filename: string) {
  try {
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats['size'];
    return fileSizeInBytes / 1000000;
  } catch (err) {
    return 0;
  }
}
