const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductRatingDisplay.tsx', 'utf8');

// Replace the old rounding logic and render
const replacement = `
  return (
    <div className={\`flex items-center gap-1.5 \${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-700\`}>
      <div className="flex text-primary" aria-label={\`Rated \${average.toFixed(1)} out of 5\`} role="img">
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fillPercentage = Math.max(0, Math.min(100, (average - starIndex) * 100));
          const size = compact ? 14 : 16;
          return (
            <div key={starIndex} className="relative" style={{ width: size, height: size }}>
              <Star 
                size={size} 
                fill="none" 
                className="text-gray-300 absolute top-0 left-0"
                aria-hidden="true"
              />
              {fillPercentage > 0 && (
                <div 
                  className="absolute top-0 left-0 overflow-hidden h-full"
                  style={{ width: \`\${fillPercentage}%\` }}
                  aria-hidden="true"
                >
                  <Star 
                    size={size} 
                    fill="currentColor" 
                    className="text-primary absolute top-0 left-0"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="ml-1 font-bold">{average.toFixed(1)}</span>
      <span className="text-gray-500 font-normal">
        {compact ? \`(\${count})\` : \`(\${count} verified rating\${count !== 1 ? 's' : ''})\`}
      </span>
    </div>
  );
`;

code = code.replace(/\/\/\s*Round average to nearest integer[\s\S]*?return \([\s\S]*?\);\n/m, replacement.trim() + '\n');

// Also update "No ratings yet" / "Be the first to rate" to reflect "verified"
code = code.replace(/compact \? 'No ratings yet' : 'Be the first to rate'/g, "compact ? 'No verified ratings yet' : 'No verified ratings yet'");

fs.writeFileSync('src/components/ui/ProductRatingDisplay.tsx', code);
