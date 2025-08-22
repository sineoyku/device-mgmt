# Device Manager — Backend (Spring Boot)

**Stack:** Java 17 • Spring Boot 3 • Spring Security (JWT) • Spring Data JPA (Hibernate) • H2 (file-based) • Maven Wrapper

## Features
- JWT auth (`/auth/login`) + BCrypt hashing
- CRUD for devices (per-user, unique `serialNumber`)
- Enum device types persisted as STRING
- Pagination: `GET /devices?page=0&size=8`
- H2 console enabled for debugging

## Run
- cd backend ./mvnw spring-boot:run
- H2 console: http://localhost:8080/h2-console
- Use JDBC URL: jdbc:h2:file:./data/devdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL


# Device Manager — Frontend (Next.js + TypeScript)

**Stack:** Next.js (React 18 + TS)

## Features
- `/login` (JWT stored in `localStorage`) → redirects to `/devices`
- `/devices` list/add/edit/delete with **8 per page** pagination
- Auto-logout at JWT expiry
- Tooltip on **Type** field listing allowed device types

## Run 
- cd frontend npm install npm run dev
- Runs on http://localhost:3000/login
- 404 at root: use /login (or add an index redirect if desired).
- Use
  `(async () => {`
  `const BASE = 'http://localhost:8080';`
  `const token = localStorage.getItem('jwt_token');`
  `if (!token) { console.error('No JWT token in localStorage. Log in first.'); return; }`

  `const items = [`
    `{ name: "Living Room Sensor",  type: "SENSOR",     serialNumber: "SN-DM-0001" },`
    `{ name: "Front Door Camera",   type: "CAMERA",     serialNumber: "SN-DM-0002" },`
    `{ name: "Kitchen Thermostat",  type: "THERMOSTAT", serialNumber: "SN-DM-0003" },`
    `{ name: "Bedroom Light",       type: "LIGHT",      serialNumber: "SN-DM-0004" },`
    `{ name: "Garage Door Lock",    type: "LOCK",       serialNumber: "SN-DM-0005" },`
    `{ name: "Backyard Motion Sensor", type: "SENSOR",  serialNumber: "SN-DM-0006" },`
    `{ name: "Office Camera",       type: "CAMERA",     serialNumber: "SN-DM-0007" },`
    `{ name: "Hallway Light",       type: "LIGHT",      serialNumber: "SN-DM-0008" },`
    `{ name: "Window Alarm",        type: "ALARM",      serialNumber: "SN-DM-0009" },`
    `{ name: "Living Room Hub",     type: "HUB",        serialNumber: "SN-DM-0010" },`
    `{ name: "Garden Sprinkler Ctrl", type:"CONTROLLER",serialNumber: "SN-DM-0011" },`
    `{ name: "Server Temp Sensor",  type: "SENSOR",     serialNumber: "SN-DM-0012" },`
    `{ name: "Balcony Switch",      type: "SWITCH",     serialNumber: "SN-DM-0013" },`
    `{ name: "Main Doorbell",       type: "DOORBELL",   serialNumber: "SN-DM-0014" },`
    `{ name: "Kids Room Air Purifier", type:"AIR_PURIFIER", serialNumber: "SN-DM-0015" }`
  `];`

  `for (const d of items) {
    try {
      const res = await fetch(`${BASE}/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(d)
      });
      if (!res.ok) {
        console.error('Failed', d.serialNumber, res.status, await res.text());
      } else {
        const out = await res.json();
        console.log('Created', out.serialNumber, out.id);
      }
    } catch (e) {
      console.error('Network error', d.serialNumber, e);
    }
    await new Promise(r => setTimeout(r, 100));
  }
})();`
on the console to bulk insert devices if there is none. 




