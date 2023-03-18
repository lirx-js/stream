export function createWebSocketNotInAnOpeningStateError(): Error {
  return new Error(`WebSocket is not in a CONNECTING nor OPEN state`);
}
