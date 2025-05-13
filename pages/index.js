import { useEffect, useState } from 'react';

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('session')
    : null;

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/files?sessionId=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files);
        const qtyMap = {};
        data.files.forEach(f => qtyMap[f.id] = 1); // default QTY 1
        setQuantities(qtyMap);
        setIsLoading(false);
      });
  }, [sessionId]);

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({
      ...prev,
      [id]: value
    }));
    // You can POST this change to Make if needed
  };

  const handleDelete = async (id) => {
    await fetch('/api/delete-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, sessionId: sessionId })
    });
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  if (isLoading) return <div>Loading files...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {files.map(file => (
        <div key={file.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ flex: 1 }}>{file.name}</span>
          <input
            type="number"
            value={quantities[file.id]}
            onChange={(e) => handleQuantityChange(file.id, e.target.value)}
            min="1"
            style={{ width: 50, marginRight: 10 }}
          />
          <button onClick={() => handleDelete(file.id)} style={{ color: 'red' }}>X</button>
        </div>
      ))}
    </div>
  );
}

