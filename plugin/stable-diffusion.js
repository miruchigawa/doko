export default async function (prompt){
  let response
  await fetch("https://axuint-runwayml-stable-diffusion-v1-5.hf.space/run/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     data: [
        prompt,
    	]
    })})
  .then(r => r.json())
  .then(data => response = data)
  .catch(e => response = {error : e})
  return response
}