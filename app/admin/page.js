'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [fabric, setFabric] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = () => {
    alert(
      `Product Added:\n\nName: ${name}\nPrice: ${price}\nFabric: ${fabric}\nCategory: ${category}`
    );
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '500px' }}>
      <h1>Ethnicaa Admin Panel</h1>

      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input
        placeholder="Fabric"
        value={fabric}
        onChange={(e) => setFabric(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Save Product
      </button>
    </div>
  );
}
