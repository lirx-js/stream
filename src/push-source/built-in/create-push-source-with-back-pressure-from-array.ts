import { Abortable, AsyncTask, IAsyncTaskInput } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../push-source-with-back-pressure.type';

export function createPushSourceWithBackPressureFromArray<GValue>(
  array: ArrayLike<GValue>,
): IPushSourceWithBackPressure<GValue> {
  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    const loop = (
      i: number,
      abortable: Abortable,
    ): AsyncTask<void> => {
      if (i < array.length) {
        return AsyncTask.fromFactory((abortable: Abortable): IAsyncTaskInput<void> => {
          return sink(
            array[i],
            abortable,
          );
        }, abortable)
          .successful((_, abortable: Abortable): AsyncTask<void> => {
            return loop(i + 1, abortable);
          });
      } else {
        return AsyncTask.void(abortable);
      }
    };

    return loop(0, abortable);
  };
}
