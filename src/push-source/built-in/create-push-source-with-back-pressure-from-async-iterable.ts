import { Abortable, AsyncTask } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../push-source-with-back-pressure.type';
import { createPushSourceWithBackPressureFromAsyncIterator } from './create-push-source-with-back-pressure-from-async-iterator';

export function createPushSourceWithBackPressureFromAsyncIterable<GValue>(
  iterable: AsyncIterable<GValue>,
): IPushSourceWithBackPressure<GValue> {
  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return createPushSourceWithBackPressureFromAsyncIterator<GValue>(
      iterable[Symbol.asyncIterator](),
    )(sink, abortable);
  };
}
