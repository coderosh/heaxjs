import path from "path";
import fs from "fs-extra";
import { execa } from "execa";

async function main() {
  await execa("npm", ["run", "clean"], { stdio: "inherit" });

  await Promise.all([
    execa("npm", ["run", "build:js"], { stdio: "inherit" }),
    execa("npm", ["run", "build:doc"], { stdio: "inherit" }),
  ]);

  await fs.copy("static", "docs", { recursive: true });
  await fs.copy("examples", path.join("docs", "examples"), { recursive: true });
  await fs.copy("dist/index.umd.js", "docs/index.umd.js");

  console.log(">> Completed");
}

main();
