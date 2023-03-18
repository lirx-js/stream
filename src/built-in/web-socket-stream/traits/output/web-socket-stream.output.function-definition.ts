import { IPushSinkWithBackPressure } from '../../../../push-sink/push-sink-with-back-pressure.type';
import { IWebSocketOutValue } from '../../types/web-socket-out-value.type';

export type IWebSocketStreamOutputFunction = IPushSinkWithBackPressure<IWebSocketOutValue>;
