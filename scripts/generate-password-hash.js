// Run with: node scripts/generate-password-hash.js "your-new-password"
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/generate-password-hash.js <your-password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const escaped = hash.replace(/\$/g, "\\$");
console.log("\nAdd this line to your .env.local file:\n");
console.log(`ADMIN_PASSWORD_HASH=${escaped}`);
console.log(
  "\n(Dollar signs are escaped with \\ — Next.js expands $VARS in env files, this prevents that.)\n"
);
