const fs = require('fs');

const agentsRule = `
## 8. Git Safety Rule
- **NEVER** use \`git push --force\` or \`git push -f\` against \`main\` during normal 2Crown work.
- Do not rewrite shared \`main\` history.
- If an accidental commit needs correction, prefer a new corrective commit.
- Force-push may only occur with explicit user authorization for that specific operation.
`;

const handoffRule = `
## Git Safety Rule
- **NEVER** use \`git push --force\` or \`git push -f\` against \`main\` during normal 2Crown work.
- Do not rewrite shared \`main\` history.
- If an accidental commit needs correction, prefer a new corrective commit.
- Force-push may only occur with explicit user authorization for that specific operation.
`;

let agents = fs.readFileSync('AGENTS.md', 'utf8');
if (!agents.includes('Git Safety Rule')) {
  agents = agents.replace('<!-- BEGIN:nextjs-agent-rules -->', agentsRule + '\n<!-- BEGIN:nextjs-agent-rules -->');
  fs.writeFileSync('AGENTS.md', agents);
}

let handoff = fs.readFileSync('PROJECT_HANDOFF.md', 'utf8');
if (!handoff.includes('Git Safety Rule')) {
  handoff = handoff + '\n' + handoffRule;
  fs.writeFileSync('PROJECT_HANDOFF.md', handoff);
}
