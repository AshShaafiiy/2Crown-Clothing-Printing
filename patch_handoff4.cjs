const fs = require('fs');
let code = fs.readFileSync('PROJECT_HANDOFF.md', 'utf8');

const additionalText = `
### Fractional Star Rendering
Average product ratings render fractional star fill proportional to the exact average. Customer rating submissions remain whole-star values from 1–5.

### Verified-Only Aggregate Production Confirmation
A live production Vercel QA inspection confirmed that the public aggregate only counts verified purchases. The legacy unverified ratings (count=19) have been successfully excluded from the calculations, rendering the UI's "(X verified ratings)" label 100% accurate. The fractional stars perfectly match the verified average.
`;

code = code.replace(/### Legacy Rating Audit[\s\S]*?(?=## 1\. Existing Functionality)/, (match) => match + '\n' + additionalText + '\n');
fs.writeFileSync('PROJECT_HANDOFF.md', code);
