import { Abortable, AsyncTask } from '@lirx/async-task';
import { untilWebSocketOpened } from '../../functions/until-web-socket-opened';
import { IWebSocketStream } from '../../web-socket-stream.type';
import { createWebSocketStreamFromWebSocket } from './create-web-socket-stream-from-web-socket';

export interface IOpenWebSocketStreamOptions {
  url: string | URL;
  abortable: Abortable;
  binaryType?: BinaryType;
  protocols?: string | string[];
}

export function openWebSocketStream(
  {
    url,
    abortable,
    binaryType,
    protocols,
  }: IOpenWebSocketStreamOptions,
): AsyncTask<IWebSocketStream> {
  const socket = new WebSocket(url, protocols);

  if (binaryType !== void 0) {
    socket.binaryType = binaryType;
  }

  return untilWebSocketOpened(
    socket,
    abortable,
  )
    .successful((): IWebSocketStream => {
      return createWebSocketStreamFromWebSocket(socket);
    });
}
