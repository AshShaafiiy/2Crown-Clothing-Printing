#!/bin/bash
sed -i 's/remaining defects/resolved Next.js 15 route handler parameter crashes, badges updated/' PROJECT_HANDOFF.md
sed -i '/## 4. Current State/a \- **Badges**: \`NEW\` auto-expires after 24h. \`% OFF\` auto-calculates if \`previousPrice\` > \`price\`.' README.md
