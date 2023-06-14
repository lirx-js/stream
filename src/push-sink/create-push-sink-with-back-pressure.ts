import { Abortable, AsyncTask, IAsyncTaskInput } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from './push-sink-with-back-pressure.type';

export interface IPushSinkWithBackPressureLike<GValue> {
  (
    value: GValue,
    abortable: Abortable,
  ): IAsyncTaskInput<void>;
}

export function createPushSinkWithBackPressure<GValue>(
  callback: IPushSinkWithBackPressureLike<GValue>,
): IPushSinkWithBackPressure<GValue> {
  return (
    value: GValue,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return AsyncTask.fromFactory((abortable: Abortable): IAsyncTaskInput<void> => {
      return callback(value, abortable);
    }, abortable);
  };
}
