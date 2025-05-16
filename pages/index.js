import { useEffect, useState } from 'react';

export default function FileList() {
  const [files, setFiles] = useState([]);        // each → { id,name,path_display,quantity }
  const [requiredTotal, setRequiredTotal] = useState(null);
  const [mode, setMode] = useState('edit');      // 'edit' | 'done'
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  /** sessionId from URL **********************************************/
  const sessionId =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('session')
      : null;

  /** fetch files list + requiredTotal ********************************/
  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/files?sessionId=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        // default quantity = 1
        setFiles(data.files.map(f => ({ ...f, quantity: 1 })));
        setRequiredTotal(data.requiredTotal ?? null);      // Make sends this
        setIsLoading(false);
      });
  }, [sessionId]);

  /** helpers *********************************************************/
  const updateQty = (idx, qty) => {
    setFiles(prev => {
      const clone = [...prev];
      clone[idx].quantity = qty ? Number(qty) : '';
      return clone;
    });
  };

  const handleDelete = async (path_display) => {
    await fetch('/api/delete-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path_display, session: sessionId })
    });
    setFiles(prev => prev.filter(f => f.path_display !== path_display));
  };

  const grandTotal = files.reduce(
    (sum, f) => sum + (Number(f.quantity) || 0),
    0
  );

  const quantitiesValid =
    files.length > 0 &&
    files.every(f => Number(f.quantity) > 0) &&
    requiredTotal != null &&
    grandTotal === requiredTotal;

  /** toggle Done / Edit **********************************************/
  const toggleMode = () => {
    if (mode === 'edit') {
      // Validate before locking
      if (!quantitiesValid) {
        setErrorMsg(
          `Please fill every quantity (≥1) and match the order total of ${requiredTotal}.`
        );
        return;
      }
      setErrorMsg('');
      setMode('done');
    } else {
      // back to edit
      setMode('edit');
    }
  };

  /** final submission ************************************************/
  const handleSubmit = async () => {
    // safe-guard (should already be valid)
    if (!quantitiesValid) return;

    const resp = await fetch('/api/submit-proof', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session: sessionId, files })
    });

    const data = await resp.json();
    if (data.error) {
      alert('Server error: ' + data.error);
    } else {
      alert('Quantities saved – thank you!');
      // optionally redirect or disable button
    }
  };

  /* ======================   RENDER   ====================== */
  if (isLoading) return <p style={{ textAlign: 'center' }}>Loading…</p>;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Upload Quantities</h2>

      {files.map((file, i) => (
        <div
          key={file.id}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
        >
          <span style={{ flex: 1 }}>{file.name}</span>

          <input
            type="number"
            min="1"
            value={file.quantity}
            disabled={mode === 'done'}
            onChange={e => updateQty(i, e.target.value)}
            style={{ width: 70, marginRight: 12 }}
          />

          {mode === 'edit' && (
            <button
              onClick={() => handleDelete(file.path_display)}
              style={{ color: 'red', border: 'none', background: 'transparent' }}
            >
              ❌
            </button>
          )}
        </div>
      ))}

      {/* Live total & error banner */}
      <p>
        Total entered: <strong>{grandTotal}</strong> /{' '}
        {requiredTotal ?? '—'}
      </p>

      {errorMsg && (
        <p style={{ color: 'red', marginTop: -6 }}>{errorMsg}</p>
      )}

      {/* Action buttons */}
      <div style={{ marginTop: 20 }}>
        <button onClick={toggleMode} style={{ marginRight: 12 }}>
          {mode === 'edit' ? 'Done' : 'Edit'}
        </button>

        {mode === 'done' && (
          <button
            onClick={handleSubmit}
            disabled={!quantitiesValid}
            style={{ background: quantitiesValid ? '#28a745' : '#888', color: '#fff' }}
          >
            Confirm &amp; Continue
          </button>
        )}
      </div>
    </div>
  );
}
