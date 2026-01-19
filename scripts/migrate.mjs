
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILE = path.join(DATA_DIR, 'pages.json');
const PAGES_DIR = path.join(DATA_DIR, 'pages');

async function migrate() {
    console.log('Starting migration...');

    // 1. Ensure pages directory exists
    await fs.mkdir(PAGES_DIR, { recursive: true });

    // 2. Read existing JSON
    let store = {};
    try {
        const raw = await fs.readFile(JSON_FILE, 'utf8');
        store = JSON.parse(raw);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('No pages.json found. Nothing to migrate.');
            return;
        }
        throw err;
    }

    // 3. Write each page to a file
    const entries = Object.entries(store);
    if (entries.length === 0) {
        console.log('pages.json is empty.');
        return;
    }

    console.log(`Found ${entries.length} pages. Migrating...`);

    for (const [slug, content] of entries) {
        // Sanitize slug to ensure safe filename
        const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '_');
        const filePath = path.join(PAGES_DIR, `${safeSlug}.md`);

        // Check if file already exists to avoid overwriting newer data if run multiple times
        try {
            await fs.access(filePath);
            console.log(`Skipping ${safeSlug} (file already exists)`);
        } catch {
            await fs.writeFile(filePath, content || '', 'utf8');
            console.log(`Migrated: ${slug} -> ${safeSlug}.md`);
        }
    }

    // 4. Rename old JSON to backup
    await fs.rename(JSON_FILE, `${JSON_FILE}.bak`);
    console.log(`Renamed pages.json to pages.json.bak`);

    console.log('Migration complete!');
}

migrate().catch(console.error);
