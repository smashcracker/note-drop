import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PAGES_DIR = path.join(DATA_DIR, "pages");

async function ensurePagesDir(): Promise<void> {
  await fs.mkdir(PAGES_DIR, { recursive: true });
}

function getFilePath(slug: string): string {
  // Simple sanitation to prevent directory traversal
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "_");
  return path.join(PAGES_DIR, `${safeSlug}.md`);
}

export async function getPageMarkdown(slug: string): Promise<string | null> {
  try {
    const filePath = getFilePath(slug);
    const content = await fs.readFile(filePath, "utf8");
    return content;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
}


export async function getAllPageSlugs(): Promise<string[]> {
  await ensurePagesDir();
  const files = await fs.readdir(PAGES_DIR);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export async function savePageMarkdown(
  slug: string,
  markdown: string
): Promise<void> {
  await ensurePagesDir();
  const filePath = getFilePath(slug);
  await fs.writeFile(filePath, markdown, "utf8");
}
