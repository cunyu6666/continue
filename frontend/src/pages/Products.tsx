import { useEffect, useState } from 'react';
import { sanityClient, Product } from '../lib/sanity';
import { ProductCard } from '../components/ProductCard';
import { trackEvent } from '../lib/posthog';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = '*[_type == "product"] | order(name asc)';
        const data = await sanityClient.fetch<Product[]>(query);
        setProducts(data);
        trackEvent('page_viewed', { page: 'products' });
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Our Products</h1>

      <div style={styles.filterSection}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              trackEvent('category_filtered', { category });
            }}
            style={{
              ...styles.filterButton,
              ...(selectedCategory === category ? styles.filterButtonActive : {}),
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div style={styles.empty}>No products found</div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    fontSize: '1.5rem',
    color: '#fff',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0 0 2rem 0',
    color: '#fff',
    textAlign: 'center',
  },
  filterSection: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  filterButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  empty: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#aaa',
    padding: '3rem',
  },
};
