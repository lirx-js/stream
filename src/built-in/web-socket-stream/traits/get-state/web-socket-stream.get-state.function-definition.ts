export enum WEB_SOCKET_STREAM_STATE {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export interface IWebSocketStreamGetStateFunction {
  (): WEB_SOCKET_STREAM_STATE;
}
