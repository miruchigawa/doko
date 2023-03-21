import fetch from 'node-fetch';
import fs from 'fs';

export async function download(url, path){
  let res = true
  const response = await fetch(url);
  const content = await response.buffer();
  await fs.writeFileSync(path, content, (err) => {
    if (err) return res = false
  })
  return res
}