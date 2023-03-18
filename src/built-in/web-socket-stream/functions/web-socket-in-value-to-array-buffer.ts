import { IWebSocketInValue } from '../types/web-socket-in-value.type';

export function webSocketInValueToArrayBuffer(
  input: IWebSocketInValue,
): ArrayBuffer {
  if (input instanceof ArrayBuffer) {
    return input;
  } else if (typeof input === 'string') {
    return new TextEncoder().encode(input).buffer; // INFO: not sure of this one - value could be a binary string, so it should not be encoded
  } else {
    throw new TypeError(`Unsupported type`);
  }
}
