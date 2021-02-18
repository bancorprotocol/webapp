// const arg1 = process.argv[2];
const fs = require("fs");
const { exec } = require("child_process");

const raw = fs.readFileSync("./package.json", "utf8");
const packageJson = JSON.parse(raw);

const versionString = packageJson.version;

const [major, minor, mini] = versionString.split(".");
const lastVersion = String(Number(mini) + 1);

const newVersionString = [major, minor, lastVersion].join(".");

const newString = raw.replace(versionString, newVersionString);

fs.writeFileSync("./package.json", newString);
console.log("Bumped package.json version to", newVersionString);

exec("git add package.json", () => {
  exec("git commit -m 'bump version'");
});
