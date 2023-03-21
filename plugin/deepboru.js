import fs from "fs"

export default async function (path){
  let response
  const base64 = fs.readFileSync(path, "base64")
  await fetch("https://hysts-deepdanbooru.hf.space/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     data: [
        "data:image/png;base64,"+base64,
        0.05,
    	]
    })})
  .then(r => r.json())
  .then(data => response = data)
  return response
}