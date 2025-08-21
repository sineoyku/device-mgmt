import { useState, useEffect } from 'react';
import type { DeviceInput } from 'lib/api';
import { notEmpty } from 'lib/validate';

type Props = {
  initial?: DeviceInput;
  onSubmit: (data: DeviceInput) => Promise<void> | void;
  submitLabel?: string;
};

export default function DeviceForm({ initial, onSubmit, submitLabel = 'Save' }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState(initial?.type ?? '');
  const [serial, setSerial] = useState(initial?.serialNumber ?? '');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? '');
    setType(initial?.type ?? '');
    setSerial(initial?.serialNumber ?? '');
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!notEmpty(name)) return setError('Name is required.');
    if (!notEmpty(type)) return setError('Type is required.');
    if (!notEmpty(serial)) return setError('Serial number is required.');

    setBusy(true);
    try {
      await onSubmit({ name, type: type.toUpperCase(), serialNumber: serial });
      setName(''); setType(''); setSerial('');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save device');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="row">
      <div className="col">
        <label>Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="My Sensor" />
      </div>
      <div className="col">
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Type
          <span
            className="info-icon"
            title="Allowed: ALARM, CAMERA, LIGHT, LOCK, SENSOR, THERMOSTAT, HUB, CONTROLLER, SWITCH, DOORBELL, AIR_PURIFIER"
            aria-label="Allowed device types"
            role="img"
          >
            i
          </span>
        </label>
        <input
          className="input"
          value={type}
          onChange={e => setType(e.target.value)}
          placeholder="SENSOR / CAMERA / ..."
        />
      </div>
      <div className="col">
        <label>Serial #</label>
        <input className="input" value={serial} onChange={e => setSerial(e.target.value)} placeholder="UNIQUE-12345" />
      </div>
      <div className="col" style={{ alignSelf: 'end' }}>
        <button className="btn">{busy ? 'Saving…' : submitLabel}</button>
      </div>
      {error && <div className="error" style={{ width: '100%' }}>{error}</div>}
    </form>
  );
}
