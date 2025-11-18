import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export const Header = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <h1 style={styles.logoText}>24/7 Store</h1>
        </Link>

        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
          <Link to="/products" style={styles.navLink}>
            Products
          </Link>
          <Link to="/cart" style={styles.navLink}>
            Cart {totalItems > 0 && <span style={styles.badge}>({totalItems})</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: '#1a1a1a',
    padding: '1rem 0',
    borderBottom: '2px solid #333',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    textDecoration: 'none',
    color: '#fff',
  },
  logoText: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.2s',
  },
  badge: {
    backgroundColor: '#ff6b6b',
    borderRadius: '10px',
    padding: '0.1rem 0.5rem',
    fontSize: '0.8rem',
    marginLeft: '0.3rem',
  },
};
