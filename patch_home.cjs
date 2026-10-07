const fs = require('fs');
let code = fs.readFileSync('src/views/public/Home.tsx', 'utf8');

const target = `{featuredProducts.length > 0 ? (
            <div className={\`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 stagger-children\`}>
              {featuredProducts.map(product => (
                <div key={product.id} className={\`reveal-fade-up \${featuredSection.isVisible ? 'revealed' : ''}\`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-12 bg-white rounded-lg border border-gray-100 max-w-2xl mx-auto">
              <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Our featured products will appear here soon.</p>
            </div>
          )}`;

const replacement = `          {loading ? (
            <div className="flex justify-center items-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className={\`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 stagger-children\`}>
              {featuredProducts.map(product => (
                <div key={product.id} className={\`reveal-fade-up \${featuredSection.isVisible ? 'revealed' : ''}\`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-12 bg-white rounded-lg border border-gray-100 max-w-2xl mx-auto">
              <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Our featured products will appear here soon.</p>
            </div>
          )}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/views/public/Home.tsx', code);
