import { useState } from 'react';
import type { Device, DeviceInput } from 'lib/api';

type Props = {
  devices: Device[];
  onUpdate: (id: string, data: DeviceInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function DeviceList({ devices, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<DeviceInput>({ name: '', type: '', serialNumber: '' });
  const [error, setError] = useState<string | null>(null);

  function startEdit(d: Device) {
    setEditing(d.id);
    setForm({ name: d.name, type: d.type, serialNumber: d.serialNumber });
    setError(null);
  }

  async function save() {
    if (!editing) return;
    try {
      await onUpdate(editing, form);
      setEditing(null);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <>
      <table className="table card">
        <thead>
          <tr><th>Name</th><th>Type</th><th>Serial</th><th>Created</th><th></th></tr>
        </thead>
        <tbody>
        {devices.map(d => (
          <tr key={d.id}>
            <td>{editing === d.id ? <input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/> : d.name}</td>
            <td>{editing === d.id ? <input className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}/> : d.type}</td>
            <td>{editing === d.id ? <input className="input" value={form.serialNumber} onChange={e=>setForm({...form,serialNumber:e.target.value})}/> : d.serialNumber}</td>
            <td>{new Date(d.createdAt).toLocaleString()}</td>
            <td className="actions">
              {editing === d.id ? (
                <>
                  <button className="btn" onClick={save}>Save</button>
                  <button className="btn secondary" onClick={() => setEditing(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="btn" onClick={() => startEdit(d)}>Edit</button>
                  <button className="btn secondary" onClick={() => onDelete(d.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
        {devices.length === 0 && (
          <tr><td colSpan={5} style={{ textAlign:'center', color:'#6b7280' }}>No devices yet.</td></tr>
        )}
        </tbody>
      </table>
      {error && <div className="error">{error}</div>}
    </>
  );
}
