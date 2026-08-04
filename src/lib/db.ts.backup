import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "portfolio.db");
const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL;");

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

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL DEFAULT 'Your Name',
    tagline TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    email TEXT DEFAULT '',
    resume_url TEXT DEFAULT ''
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

// Ensure exactly one profile row always exists, so the app can always
// read/update it without needing an INSERT-vs-UPDATE branch elsewhere.
db.exec(`
  INSERT OR IGNORE INTO profile (id, name, tagline, bio, github_url, linkedin_url, email, resume_url)
  VALUES (1, 'Trueone',
    'Engineering student specializing in smart contract security',
    'I study how DeFi protocols break — reentrancy, oracle manipulation, governance attacks — and build the AI/ML automation that finds those breaks faster.',
    '', '', '', '');
`);

export default db;

export type Skill = {
  id: number;
  category: string;
  name: string;
  level: number;
  sort_order: number;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string;
  github_url: string;
  demo_url: string;
  sort_order: number;
};

export type Certification = {
  id: number;
  name: string;
  issuer: string;
  date_earned: string;
  verify_url: string;
  sort_order: number;
};

export type Profile = {
  id: number;
  name: string;
  tagline: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  email: string;
  resume_url: string;
};

export type Education = {
  id: number;
  institution: string;
  detail: string;
  years: string;
  status: string;
  sort_order: number;
};
