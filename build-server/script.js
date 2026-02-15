const { spawn } = require("child_process");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const { pipeline } = require("stream/promises");

const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKET_NAME);

const BUILD_CMD = process.env.BUILD_CMD;
const PROJECT_ID = process.env.PROJECT_ID;

if (!BUILD_CMD || !PROJECT_ID) {
  console.error("Missing required environment variables");
  process.exit(1);
}

async function runBuild(outdir) {
  return new Promise((resolve, reject) => {
    const cmd = spawn("sh", ["-c", `npm ci && ${BUILD_CMD}`], {
      cwd: outdir,
      stdio: "inherit",
    });

    cmd.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Build failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function uploadFile(fullPath, relativePath) {
  const destination = `__outputs/${PROJECT_ID}/${relativePath}`;

  const writeStream = bucket.file(destination).createWriteStream({
    contentType: mime.lookup(fullPath) || "application/octet-stream",
  });

  await pipeline(
    fs.createReadStream(fullPath),
    writeStream
  );

  console.log("Uploaded:", relativePath);
}

async function uploadDist(distFolder) {
  const files = fs.readdirSync(distFolder, { recursive: true });

  const concurrency = 10;
  const queue = [];

  for (const relativePath of files) {
    const fullPath = path.join(distFolder, relativePath);

    if (fs.lstatSync(fullPath).isDirectory()) continue;

    const task = uploadFile(fullPath, relativePath);

    queue.push(task);

    if (queue.length >= concurrency) {
      await Promise.all(queue);
      queue.length = 0;
    }
  }

  if (queue.length) {
    await Promise.all(queue);
  }
}

async function init() {
  try {
    console.log("Starting build process...");

    const outdir = path.join(__dirname, "output");
    await runBuild(outdir);

    console.log("Build complete.");

    const distFolder = path.join(outdir, "dist");

    if (!fs.existsSync(distFolder)) {
      throw new Error("dist folder not found");
    }

    await uploadDist(distFolder);

    console.log("All files uploaded successfully.");
    process.exit(0);

  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

init();
