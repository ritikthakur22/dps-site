import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const appDir = path.join(rootDir, "app");
const tempDir = path.join(rootDir, ".server_routes_tmp");

const serverPaths = ["admin", "api", "media"];

console.log("Preparing Next.js build for GitHub Pages static export...");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const moved = [];

try {
  // Move dynamic server routes out of app/ during static export
  for (const p of serverPaths) {
    const src = path.join(appDir, p);
    const dest = path.join(tempDir, p);
    if (fs.existsSync(src)) {
      fs.renameSync(src, dest);
      moved.push({ src, dest });
    }
  }

  // Run next build with GITHUB_PAGES=true
  console.log("Building static export with GITHUB_PAGES=true...");
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true" },
  });

  const outDir = path.join(rootDir, "out");
  if (!fs.existsSync(outDir)) {
    throw new Error("Build succeeded but out/ directory was not created.");
  }

  // Create .nojekyll for GitHub Pages
  fs.writeFileSync(path.join(outDir, ".nojekyll"), "");
  console.log("Created out/.nojekyll");

  // Create 404.html fallback for client-side routing
  const notFoundHtml = path.join(outDir, "_not-found.html");
  const indexHtml = path.join(outDir, "index.html");
  const dest404 = path.join(outDir, "404.html");
  if (fs.existsSync(notFoundHtml)) {
    fs.copyFileSync(notFoundHtml, dest404);
    console.log("Created out/404.html from _not-found.html");
  } else if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, dest404);
    console.log("Created out/404.html from index.html");
  }

  console.log("GitHub Pages static export completed successfully in out/");
} finally {
  // Always restore server routes back to app/
  for (const { src, dest } of moved) {
    if (fs.existsSync(dest) && !fs.existsSync(src)) {
      fs.renameSync(dest, src);
    }
  }
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  console.log("Restored server routes.");
}
