const { Storage } = require("@google-cloud/storage");
require("dotenv").config();

if (!process.env.BUCKET_NAME) {
  throw new Error("Missing BUCKET_NAME");
}

const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKET_NAME);

async function testUpload() {
  await bucket.upload("test.txt", {
    destination: "__test/hello.txt",
  });

  console.log("✅ upload success");
}

testUpload().catch(console.error);
