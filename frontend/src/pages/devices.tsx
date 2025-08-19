import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthed, clearToken } from 'lib/auth';
import { getDevices, createDevice, updateDevice, deleteDevice, type Device, type DeviceInput } from 'lib/api';
import DeviceForm from 'components/DeviceForm';
import DeviceList from 'components/DeviceList';

export default function DevicesPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthed()) { router.replace('/login'); return; }
    (async () => {
      try {
        const list = await getDevices();
        setDevices(list);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function add(d: DeviceInput) {
    const created = await createDevice(d);
    setDevices(prev => [created, ...prev]);
  }
  async function update(id: string, d: DeviceInput) {
    const updated = await updateDevice(id, d);
    setDevices(prev => prev.map(x => x.id === id ? updated : x));
  }
  async function remove(id: string) {
    await deleteDevice(id);
    setDevices(prev => prev.filter(x => x.id !== id));
  }

  if (loading) return <div className="container"><div className="card">Loading…</div></div>;

  return (
    <div className="container">
      <div className="row" style={{ alignItems:'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>My Devices</h2>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn secondary" onClick={() => { clearToken(); router.push('/login'); }}>Logout</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Add Device</h3>
        <DeviceForm onSubmit={add} submitLabel="Add" />
      </div>

      <DeviceList devices={devices} onUpdate={update} onDelete={remove} />
      {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
    </div>
  );
}
