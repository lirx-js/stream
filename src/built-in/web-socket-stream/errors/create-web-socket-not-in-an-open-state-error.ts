export function createWebSocketNotInAnOpenStateError(): Error {
  return new Error(`WebSocket is not in an OPEN state`);
}
