import { IPushSourceWithBackPressure } from '../../../../push-source/push-source-with-back-pressure.type';
import { IWebSocketInValue } from '../../types/web-socket-in-value.type';

export type IWebSocketStreamInputFunction = IPushSourceWithBackPressure<IWebSocketInValue>;
