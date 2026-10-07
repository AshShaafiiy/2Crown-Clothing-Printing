const fs = require('fs');
let code = fs.readFileSync('app/api/admins/route.ts', 'utf8');

if (!code.includes("import { auth }")) {
  code = code.replace(
    "import { NextResponse } from 'next/server';",
    "import { NextResponse } from 'next/server';\nimport { auth } from '@/backend/db/firebase';"
  );
}

// Remove require('@/backend/db/firebase') inside POST
code = code.replace("const { auth } = require('@/backend/db/firebase');", "");
fs.writeFileSync('app/api/admins/route.ts', code);
