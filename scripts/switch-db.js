const fs = require('fs');
const path = require('path');

const target = process.argv[2]; // 'postgres' or 'sqlite'
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (!target || !['postgres', 'sqlite'].includes(target)) {
  console.log("Usage: node scripts/switch-db.js <postgres|sqlite>");
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, 'utf8');

if (target === 'postgres') {
  content = content.replace('provider = "sqlite"', 'provider = "postgresql"');
  console.log("✓ Switched prisma/schema.prisma to PostgreSQL provider for Vercel/Supabase/Neon.");
} else {
  content = content.replace('provider = "postgresql"', 'provider = "sqlite"');
  console.log("✓ Switched prisma/schema.prisma to SQLite provider for local development.");
}

fs.writeFileSync(schemaPath, content, 'utf8');
