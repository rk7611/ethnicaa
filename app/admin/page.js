'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [fabric, setFabric] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = () => {
    alert(
      `Product Added:\n\nName: ${name}\nPrice: ${price}\nFabric: ${fabric}\nCategory: ${category}\nImages Selected: ${images.length}`
    );
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '600px' }}>
      <h1>Ethnicaa Admin Panel</h1>

      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input
        placeholder="Price (₹)"
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

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: '20px' }}
      />

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="preview"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
        ))}
      </div>

      <br />

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
