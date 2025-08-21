import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthed, clearToken } from 'lib/auth';
import { getDevices, createDevice, updateDevice, deleteDevice, type Device, type DeviceInput, type PageResp } from 'lib/api';
import DeviceForm from 'components/DeviceForm';
import DeviceList from 'components/DeviceList';

export default function DevicesPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(p = 0) {
    setLoading(true);
    try {
      const resp: PageResp<Device> = await getDevices(p, pageSize);
      setDevices(resp.content);
      setPage(resp.number);
      setTotalPages(resp.totalPages);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthed()) { router.replace('/login'); return; }
    load(0);
  }, [router]);

  async function add(d: DeviceInput) {
    await createDevice({ ...d, type: d.type.toUpperCase() }); // small nicety
    await load(0); // show newest on the first page
  }

  async function update(id: string, d: DeviceInput) {
    await updateDevice(id, { ...d, type: d.type.toUpperCase() });
    await load(page);
  }

  async function remove(id: string) {
    await deleteDevice(id);
    // reload current page; if now empty and not first page, step back one
    await load(page);
    if (devices.length === 1 && page > 0) await load(page - 1);
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

      {/* Pagination controls */}
      <div className="card" style={{ marginTop: 12, display:'flex', alignItems:'center', gap:12 }}>
        <button className="btn secondary" disabled={page === 0} onClick={() => load(page - 1)}>Prev</button>
        <span>Page {totalPages === 0 ? 0 : page + 1} of {totalPages}</span>
        <button className="btn" disabled={page + 1 >= totalPages} onClick={() => load(page + 1)}>Next</button>
      </div>

      {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
    </div>
  );
}

/*
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
*/
