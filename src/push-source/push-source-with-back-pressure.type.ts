import { Abortable, AsyncTask } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../push-sink/push-sink-with-back-pressure.type';

export interface IPushSourceWithBackPressure<GValue> {
  (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void>;
}
