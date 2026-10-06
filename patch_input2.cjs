const fs = require('fs');
const file = 'src/components/ui/ProductRatingInput.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /if \(\!eligibility\?\.eligible\) \{[\s\S]*?const title =/m,
  `if (!eligibility?.eligible) {
    let message = "Sign in to rate this product.";
    if (eligibility?.reason === 'not_purchased') {
      message = "Only customers who purchased this product can rate it.";
    } else if (eligibility?.reason === 'not_delivered') {
      message = "You can rate this product after delivery.";
    }
    
    return (
      <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg">
        <h3 className="font-bold text-secondary mb-2">Rate this product</h3>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    );
  }

  const title =`
);

fs.writeFileSync(file, code);
