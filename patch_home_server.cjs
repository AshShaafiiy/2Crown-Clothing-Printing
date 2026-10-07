const fs = require('fs');
let code = fs.readFileSync('src/views/public/Home.tsx', 'utf8');

// We will change Home to accept optional props for initialData
code = code.replace(
  `export const Home = () => {`,
  `export const Home = ({ initialData }: { initialData?: { categories: Category[], products: Product[], promotions: Promotion[] } }) => {`
);

code = code.replace(
  `  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);`,
  `  const [categories, setCategories] = useState<Category[]>(initialData?.categories || []);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(initialData?.products || []);
  const [promotions, setPromotions] = useState<Promotion[]>(initialData?.promotions || []);
  const [loading, setLoading] = useState(!initialData);`
);

// We should skip fetching if we have initialData
code = code.replace(
  `    const fetchHomeData = async () => {`,
  `    if (initialData) return;
    const fetchHomeData = async () => {`
);

fs.writeFileSync('src/views/public/Home.tsx', code);
