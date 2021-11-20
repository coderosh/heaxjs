import cpy from "cpy";
import path from "path";
import { execa } from "execa";

async function main() {
  await execa("npm", ["run", "clean"], { stdio: "inherit" });

  await Promise.all([
    execa("npm", ["run", "build:js"], { stdio: "inherit" }),
    execa("npm", ["run", "build:doc"], { stdio: "inherit" }),
  ]);

  await cpy("examples/*.html", path.join("docs", "examples"));

  await cpy("dist/index.umd.js", "docs");
}

main();
