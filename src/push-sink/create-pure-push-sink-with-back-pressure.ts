import { Abortable, AsyncTask, IAsyncTaskInput } from '@lirx/async-task';
import { IPurePushSinkWithBackPressure } from './pure-push-sink-with-back-pressure.type';
import { IPushSinkWithBackPressure } from './push-sink-with-back-pressure.type';

export function createPurePushSinkWithBackPressure<GValue>(
  callback: IPushSinkWithBackPressure<GValue>,
): IPurePushSinkWithBackPressure<GValue> {
  return (
    value: GValue,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return AsyncTask.fromFactory((abortable: Abortable): IAsyncTaskInput<void> => {
      return callback(value, abortable);
    }, abortable);
  };
}
