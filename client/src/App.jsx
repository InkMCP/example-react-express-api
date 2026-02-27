import { useState, useEffect } from 'react';

const styles = {
  body: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: '#0a0a0a',
    color: '#ededed',
    minHeight: '100vh',
    margin: 0,
    padding: '4rem 1.5rem'
  },
  container: { maxWidth: 640, margin: '0 auto' },
  h1: { fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' },
  subtitle: { color: '#888', marginBottom: '2rem' },
  form: { display: 'flex', gap: '0.5rem', marginBottom: '2rem' },
  input: {
    flex: 1,
    padding: '0.625rem 0.875rem',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '0.5rem',
    color: '#ededed',
    fontSize: '0.9375rem',
    outline: 'none'
  },
  button: {
    padding: '0.625rem 1.25rem',
    background: '#ededed',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer'
  },
  item: {
    padding: '0.875rem',
    borderBottom: '1px solid #1a1a1a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deleteBtn: {
    background: 'transparent',
    color: '#555',
    border: '1px solid #333',
    borderRadius: '0.375rem',
    padding: '0.25rem 0.625rem',
    cursor: 'pointer',
    fontSize: '0.8125rem'
  },
  empty: { textAlign: 'center', color: '#555', padding: '3rem 0' }
};

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    const res = await fetch('/api/items');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() })
    });
    setName('');
    fetchItems();
  }

  async function handleDelete(id) {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    fetchItems();
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.h1}>React + Express API</h1>
        <p style={styles.subtitle}>A full-stack monorepo app</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a new item..."
          />
          <button style={styles.button} type="submit">Add</button>
        </form>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : items.length === 0 ? (
          <p style={styles.empty}>No items yet. Add one above!</p>
        ) : (
          <div>
            {items.map((item) => (
              <div key={item.id} style={styles.item}>
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
