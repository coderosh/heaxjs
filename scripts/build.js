import cpy from "cpy";
import path from "path";
import fs from "fs/promises";
import { execa } from "execa";

async function main() {
  await execa("npm", ["run", "clean"], { stdio: "inherit" });

  await Promise.all([
    execa("npm", ["run", "build:js"], { stdio: "inherit" }),
    execa("npm", ["run", "build:doc"], { stdio: "inherit" }),
  ]);

  await cpy("examples/*.html", path.join("docs", "examples"));

  await cpy("dist/index.umd.js", "docs");

  fs.writeFile(path.join("docs", "CNAME"), "heax.js.org");
}

main();
