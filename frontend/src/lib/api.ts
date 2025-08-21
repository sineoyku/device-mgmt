import { getToken } from './auth';

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
const headers: HeadersInit = { 'Content-Type': 'application/json', ...(options.headers || {}) };
const token = getToken();
if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const msg = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(msg.error ?? 'Request failed');
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export type LoginResponse = { token: string; userId: string; email: string; };
export async function login(email: string, password: string) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export type Device = { id: string; name: string; type: string; serialNumber: string; createdAt: string; };
export type DeviceInput = { name: string; type: string; serialNumber: string; };

//NEW PAGE TYPE
export type PageResp<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // current page (0-based)
  size: number;
  first: boolean;
  last: boolean;
};

export const getDevices = (page = 0, size = 8) =>
  request<PageResp<Device>>(`/devices?page=${page}&size=${size}`);

//export const getDevices = () => request<Device[]>('/devices');
export const getDevice = (id: string) => request<Device>(`/devices/${id}`);
export const createDevice = (data: DeviceInput) =>
  request<Device>('/devices', { method: 'POST', body: JSON.stringify(data) });
export const updateDevice = (id: string, data: DeviceInput) =>
  request<Device>(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDevice = (id: string) =>
  request<void>(`/devices/${id}`, { method: 'DELETE' });
