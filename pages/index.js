// pages/index.js
import { useEffect, useState } from 'react';

export default function FileList() {
  const [files, setFiles] = useState([]);         // each → { id, name, path_display, quantity }
  const [requiredTotal, setRequiredTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* …fetch logic… */
  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/files?session=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        setFiles(data.files.map(f => ({ ...f, quantity: 1 }))); // default qty=1
        setRequiredTotal(data.requiredTotal);                  //  <– total from Make
        setIsLoading(false);
      });
  }, [sessionId]);

  // helper – live total typed by user
  const typedTotal = files.reduce((sum, f) => sum + Number(f.quantity || 0), 0);
  const validQty    = requiredTotal != null && typedTotal === requiredTotal;

  /* …event handlers updateQuantity(), handleDelete()… */

  return isLoading ? (
      <div>Loading…</div>
    ) : (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* file rows */}
        {files.map((file, i) => (
          <div key={file.id} style={{ display:'flex', alignItems:'center', marginBottom: 10 }}>
            <span style={{ flex: 1 }}>{file.name}</span>
            <input
              type="number"
              min="0"
              value={file.quantity}
              onChange={e =>
                setFiles(prev => {
                  const clone = [...prev];
                  clone[i].quantity = Number(e.target.value);
                  return clone;
                })
              }
              style={{ width: 60, marginRight: 10 }}
            />
            <button onClick={() => handleDelete(file.path_display)} style={{ color: 'red' }}>❌</button>
          </div>
        ))}

        {/* live validation message */}
        {!validQty && (
          <p style={{ color: 'red' }}>
            You’ve entered {typedTotal} / {requiredTotal} pieces.  
            Please adjust quantities to match the order total.
          </p>
        )}

        {/* approve button disabled unless quantities match */}
        <button
          disabled={!validQty}
          onClick={handleApprove}
          style={{
            padding:'10px 24px',
            background: validQty ? '#28a745' : '#888',
            color:'#fff',
            border:'none',
            cursor: validQty ? 'pointer' : 'not-allowed'
          }}
        >
          Approve Proof
        </button>
      </div>
    )
}
