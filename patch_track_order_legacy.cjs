const fs = require('fs');
let code = fs.readFileSync('src/views/public/TrackOrder.tsx', 'utf8');

code = code.replace(
  `{timestamp && <div className="text-xs text-gray-500">{timestamp}</div>}`,
  `{timestamp ? <div className="text-xs text-gray-500">{timestamp}</div> : ((isCompleted || isCurrent) ? <div className="text-xs text-gray-400 italic">Date unavailable</div> : null)}`
);
fs.writeFileSync('src/views/public/TrackOrder.tsx', code);
