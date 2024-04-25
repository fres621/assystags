const child_process = require("child_process");
const fs = require("fs");

if (!fs.existsSync("../build")) fs.mkdirSync("../build");
if (fs.existsSync("../tmp")) fs.rmSync("../tmp", { recursive: true });
fs.mkdirSync("../tmp");

fs.readdirSync("../tags", { withFileTypes: true }).forEach((file => {
    console.log(file.name, file.isFile())
    if (!file.isFile()) return;
    let code;
    if (file.name.endsWith(".ts")) {
        child_process.execSync(`tsc "../tags/${file.name}" --outFile "../tmp/${file.name}.js" --target es2017`).toString();
        code = child_process.execSync(`node ../tmp/${file.name}.js`);
    } else if (file.name.endsWith(".js")) {
        code = child_process.execSync(`../tags/${file.name}`);
    } else {
        return;
    }
    fs.writeFileSync(`../build/${file.name}.ass`, code);
}))

fs.rmSync("../tmp", { recursive: true });
//fs.writeFileSync("", child_process.execSync("node build/color.js").toString())