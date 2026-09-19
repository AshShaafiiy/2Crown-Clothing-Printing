const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const hasUseState = content.includes('useState');
      const hasUseEffect = content.includes('useEffect');
      const hasUseRef = content.includes('useRef');
      
      if (hasUseState || hasUseEffect || hasUseRef) {
        if (!content.includes("from 'react'")) {
          const imports = [];
          if (hasUseState) imports.push('useState');
          if (hasUseEffect) imports.push('useEffect');
          if (hasUseRef) imports.push('useRef');
          
          const importStr = `import { ${imports.join(', ')} } from 'react';\n`;
          content = importStr + content;
          fs.writeFileSync(fullPath, content);
        }
      }
    }
  }
}

processDir('./src');
console.log('Fixed imports');
