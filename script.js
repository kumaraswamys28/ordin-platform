const { exec } = require("child_process");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKET_NAME);


const PROJECT_ID=process.env.PROJECT_ID;

async function init() {
  console.log("Initializing with params:");
  const outdir = path.join(__dirname, "output");
  const p = exec(`cd ${outdir} && npm install && npm run build`);

    p.stdout.on("data", (data) => {
        console.log(data.toString());
    });

   p.stderr.on("data", (data) => {
  console.error(data.toString());
});


   p.on("close", async () => {
    if (code !== 0) {
    console.error("Build failed");
    process.exit(1);
  }
  console.log("build complete");

  const distFolder = path.join(__dirname, "output", "dist");
  const files = fs.readdirSync(distFolder, { recursive: true });

  for (const relativePath of files) {
    const fullPath = path.join(distFolder, relativePath);

    if (fs.lstatSync(fullPath).isDirectory()) continue;

    await bucket.upload(fullPath, {
      destination: `__outputs/${PROJECT_ID}/${relativePath}`,
      contentType: mime.lookup(fullPath) ,
    });
  }

  console.log("done...");
});
}
