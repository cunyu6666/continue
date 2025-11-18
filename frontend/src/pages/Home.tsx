import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient, HeroContent, urlFor, StoreInfo } from '../lib/sanity';
import { trackEvent } from '../lib/posthog';

export const Home = () => {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [heroData, storeData] = await Promise.all([
          sanityClient.fetch<HeroContent>('*[_type == "hero"][0]'),
          sanityClient.fetch<StoreInfo>('*[_type == "storeInfo"][0]'),
        ]);

        setHero(heroData);
        setStoreInfo(storeData);
        trackEvent('page_viewed', { page: 'home' });
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {hero && (
        <section
          style={{
            ...styles.hero,
            backgroundImage: hero.backgroundImage
              ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${urlFor(hero.backgroundImage).width(1920).url()})`
              : undefined,
          }}
        >
          <h1 style={styles.heroTitle}>{hero.title}</h1>
          <p style={styles.heroSubtitle}>{hero.subtitle}</p>
          <Link to="/products" style={styles.ctaButton}>
            {hero.ctaText || 'Shop Now'}
          </Link>
        </section>
      )}

      {storeInfo && (
        <section style={styles.infoSection}>
          <h2 style={styles.infoTitle}>{storeInfo.storeName}</h2>
          <p style={styles.infoTagline}>{storeInfo.tagline}</p>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <strong>Hours:</strong> {storeInfo.hours}
            </div>
            <div style={styles.infoItem}>
              <strong>Phone:</strong> {storeInfo.phone}
            </div>
            <div style={styles.infoItem}>
              <strong>Address:</strong> {storeInfo.address}
            </div>
          </div>
        </section>
      )}

      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Shop With Us?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🕐</div>
            <h3>Open 24/7</h3>
            <p>Always here when you need us</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🚀</div>
            <h3>Fast Delivery</h3>
            <p>Quick delivery to your doorstep</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>💯</div>
            <h3>Quality Products</h3>
            <p>Only the best for our customers</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.5rem',
    color: '#fff',
  },
  hero: {
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#1a1a1a',
    textAlign: 'center',
    padding: '2rem',
  },
  heroTitle: {
    fontSize: '3rem',
    margin: '0 0 1rem 0',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    margin: '0 0 2rem 0',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
  },
  ctaButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    display: 'inline-block',
  },
  infoSection: {
    maxWidth: '1200px',
    margin: '3rem auto',
    padding: '2rem',
    textAlign: 'center',
  },
  infoTitle: {
    fontSize: '2rem',
    margin: '0 0 1rem 0',
    color: '#fff',
  },
  infoTagline: {
    fontSize: '1.2rem',
    color: '#aaa',
    margin: '0 0 2rem 0',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  infoItem: {
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    color: '#fff',
  },
  featuresSection: {
    maxWidth: '1200px',
    margin: '3rem auto',
    padding: '2rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    margin: '0 0 2rem 0',
    textAlign: 'center',
    color: '#fff',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  feature: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
};
