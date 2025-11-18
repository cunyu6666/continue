import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/posthog';
import { Sentry } from '../lib/sentry';

export const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotalPrice(),
        status: 'pending',
      };

      const { data, error } = await supabase.from('orders').insert([orderData]).select();

      if (error) throw error;

      trackEvent('order_placed', {
        order_id: data[0].id,
        total: getTotalPrice(),
        items_count: items.length,
      });

      setOrderSuccess(true);
      clearCart();
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setDeliveryAddress('');
    } catch (error) {
      console.error('Error submitting order:', error);
      Sentry.captureException(error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successMessage}>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll contact you shortly.</p>
          <button
            onClick={() => setOrderSuccess(false)}
            style={styles.button}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Shopping Cart</h1>
        <div style={styles.empty}>Your cart is empty</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>

      <div style={styles.content}>
        <div style={styles.itemsSection}>
          {items.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              {item.image && (
                <img src={item.image} alt={item.name} style={styles.itemImage} />
              )}
              <div style={styles.itemDetails}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
              </div>
              <div style={styles.quantityControl}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={styles.quantityButton}
                >
                  -
                </button>
                <span style={styles.quantity}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={styles.quantityButton}
                >
                  +
                </button>
              </div>
              <div style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                style={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div style={styles.checkoutSection}>
          <div style={styles.totalSection}>
            <h2>Total: ${getTotalPrice().toFixed(2)}</h2>
          </div>

          <form onSubmit={handleSubmitOrder} style={styles.form}>
            <h3 style={styles.formTitle}>Delivery Information</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="email"
              placeholder="Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              style={styles.input}
            />

            <textarea
              placeholder="Delivery Address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              style={{ ...styles.input, ...styles.textarea }}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.button,
                ...(submitting ? styles.buttonDisabled : {}),
              }}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0 0 2rem 0',
    color: '#fff',
  },
  empty: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#aaa',
    padding: '3rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#fff',
  },
  itemPrice: {
    margin: 0,
    color: '#4CAF50',
    fontSize: '1rem',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quantityButton: {
    width: '30px',
    height: '30px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  quantity: {
    fontSize: '1.1rem',
    color: '#fff',
    minWidth: '30px',
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#fff',
    minWidth: '80px',
    textAlign: 'right',
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  checkoutSection: {
    position: 'sticky',
    top: '1rem',
    height: 'fit-content',
  },
  totalSection: {
    backgroundColor: '#2a2a2a',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#fff',
  },
  form: {
    backgroundColor: '#2a2a2a',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  formTitle: {
    margin: '0 0 1rem 0',
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  button: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#666',
    cursor: 'not-allowed',
  },
  successMessage: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    color: '#fff',
  },
};
