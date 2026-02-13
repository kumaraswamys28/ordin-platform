const { exec } = require("child_process");
const path = require("path");
const fs= require('fs');

async function init() {
  console.log("Initializing with params:");
  const outdir = path.join(__dirname, "output");
  const p = exec(`cd ${outdir} && npm install && npm run build`);

    p.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    p.stderr.on("error", (data) => {
        console.error(data.toString());
    });

    p.on("close", async () => {
        console.log("build complete");
        const distfolder=path.join(__dirname, 'output', 'dist')
        const distcontent= fs.readdirSync(distfolder,{recursive:true})

        for(const filepath of distcontent){
            if(fs.lstatSync(filepath).isDirectory()) continue;
        }
    });
}
