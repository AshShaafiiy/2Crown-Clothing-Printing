export const dynamic = 'force-dynamic';
import PageComponent from '@/views/public/Home';
import { categoryRepository, productRepository, promotionRepository } from '@/backend/repositories';

// Make it a server component, fetch data here to avoid client waterfall!
export default async function Page() {
  const [allCats, allProds, allPromos] = await Promise.all([
    categoryRepository.findAll(),
    productRepository.findAll(),
    promotionRepository.findAll()
  ]);

  const categories = allCats.sort((a, b) => a.order - b.order).slice(0, 4);
  const products = allProds.filter(p => p.featured && p.active).slice(0, 5);
  const promotions = allPromos.filter(p => p.active).slice(0, 1);

  const initialData = { categories, products, promotions };
  
  return <PageComponent initialData={initialData} />;
}
