import { IPurePushSinkWithBackPressure } from '../../../../push-sink/pure-push-sink-with-back-pressure.type';
import { IWebSocketOutValue } from '../../types/web-socket-out-value.type';

export type IWebSocketStreamOutputFunction = IPurePushSinkWithBackPressure<IWebSocketOutValue>;
