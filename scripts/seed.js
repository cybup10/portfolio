// One-time seed script. Run with: node scripts/seed.js
// Safe to skip or edit — you can also just add everything from the admin panel.
const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "portfolio.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 3,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '',
    github_url TEXT DEFAULT '',
    demo_url TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date_earned TEXT DEFAULT '',
    verify_url TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    institution TEXT NOT NULL,
    detail TEXT NOT NULL DEFAULT '',
    years TEXT NOT NULL DEFAULT '',
    status TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const skillCount = db.prepare("SELECT COUNT(*) as c FROM skills").get().c;
if (skillCount > 0) {
  console.log("Skills table already has data — skipping seed to avoid duplicates.");
  process.exit(0);
}

const skills = [
  ["Smart Contract Security", "Solidity fundamentals", 2],
  ["Smart Contract Security", "EVM mechanics", 2],
  ["Smart Contract Security", "Reentrancy & exploit analysis", 2],
  ["Smart Contract Security", "Foundry", 1],
  ["Smart Contract Security", "Web3 attack surfaces", 2],
  ["Cybersecurity Fundamentals", "Networking (Wireshark, Scapy)", 3],
  ["Cybersecurity Fundamentals", "Linux", 3],
  ["Cybersecurity Fundamentals", "Python security tooling", 3],
  ["Web3 / Blockchain", "WebAuthn", 2],
  ["Web3 / Blockchain", "Ethereum testnets", 2],
  ["Web3 / Blockchain", "Node.js", 2],
  ["Programming", "Python", 3],
  ["Programming", "C", 3],
  ["Programming", "Java", 3],
  ["Programming", "Solidity", 2],
];

const insert = db.prepare(
  "INSERT INTO skills (category, name, level, sort_order) VALUES (?, ?, ?, ?)"
);
skills.forEach(([category, name, level], i) => insert.run(category, name, level, i));

console.log(`Seeded ${skills.length} skills. Projects and certifications left empty for you to add.`);
