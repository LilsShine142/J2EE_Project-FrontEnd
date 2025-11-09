// // Lấy env một lần duy nhất khi module load
// const WS_PROTOCOL = import.meta.env.VITE_WS_PROTOCOL || 'ws';
// const WS_HOST = import.meta.env.VITE_WS_HOST || 'localhost';
// const WS_PORT = import.meta.env.VITE_WS_PORT; // <-- KHÔNG ĐƯỢC undefined

// // Kiểm tra port
// if (!WS_PORT) {
//   console.error('VITE_WS_PORT is missing in .env');
//   throw new Error('WebSocket port not configured');
// }

// let ws: WebSocket | null = null;

// export const connectWebSocket = (token: string): WebSocket => {
//   if (ws?.readyState === WebSocket.OPEN) return ws;

//   const url = `${WS_PROTOCOL}://${WS_HOST}:${WS_PORT}/ws?token=${token}`;
//   console.log('Connecting WebSocket →', url);

//   ws = new WebSocket(url);

//   ws.onopen = () => console.log('WS connected');
//   ws.onclose = () => console.warn('WS closed');
//   ws.onerror = (e) => console.error('WS error', e);

//   return ws;
// };

// export const getWs = () => ws;
// export const closeWs = () => ws?.close();