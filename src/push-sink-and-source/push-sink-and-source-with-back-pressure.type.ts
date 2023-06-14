import { IPushSinkWithBackPressure } from '../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../push-source/push-source-with-back-pressure.type';

export interface IPushSinkAndSourceWithBackPressure<GValue> {
  sink: IPushSinkWithBackPressure<GValue>;
  source: IPushSourceWithBackPressure<GValue>;
}
