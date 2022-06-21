import { exec } from "child_process";
import fs from "fs";

function criarJson(caminho, jsonStr) {
  fs.writeFileSync(caminho, jsonStr);
}

function uploadJson() {
  exec(`azcopy `, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(path.resolve(process.cwd()));
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log("==Tudo pronto para começar==");
  });
}
