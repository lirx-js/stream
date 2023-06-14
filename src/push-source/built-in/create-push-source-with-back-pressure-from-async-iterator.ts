import { Abortable, AsyncTask } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../push-source-with-back-pressure.type';

export function createPushSourceWithBackPressureFromAsyncIterator<GValue>(
  iterator: AsyncIterator<GValue>,
): IPushSourceWithBackPressure<GValue> {
  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    const loop = (
      abortable: Abortable,
    ): AsyncTask<void> => {
      return AsyncTask.fromFactory(() => iterator.next(), abortable)
        .successful((result: IteratorResult<GValue>, abortable: Abortable): AsyncTask<void> | void => {
          if (!result.done) {
            return sink(
              result.value,
              abortable,
            )
              .successful((_, abortable: Abortable): AsyncTask<void> => {
                return loop(abortable);
              });
          }
        });
    };

    return loop(abortable);
  };
}

