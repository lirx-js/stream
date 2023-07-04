import { Abortable, AsyncTask, IAsyncTaskFactory, IAsyncTaskState } from '@lirx/async-task';
import { IAsyncTaskConstraint } from '@lirx/async-task/src/async-task/types/async-task-constraint.type';
import { IPushSinkWithBackPressure } from '../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../push-source-with-back-pressure.type';

// export interface IAsyncTaskIteratorFactory<GValue extends IAsyncTaskConstraint<GValue>> {
//   (
//     abortable: Abortable,
//   ): Iterator<AsyncTask<GValue>, any, Abortable>;
// }

/**
 * @deprecated
 * @param factory
 */
export function createPushSourceWithBackPressureFromIterableOfAsyncTaskFactory<GValue extends IAsyncTaskConstraint<GValue>>(
  iterable: Iterable<IAsyncTaskFactory<GValue>>,
): IPushSourceWithBackPressure<GValue> {
  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    const iterator: Iterator<IAsyncTaskFactory<GValue>> = iterable[Symbol.iterator]();

    const loop = (
      abortable: Abortable,
    ): AsyncTask<void> => {
      const result: IteratorResult<IAsyncTaskFactory<GValue>> = iterator.next();

      if (result.done) {
        return AsyncTask.void(abortable);
      } else {
        return AsyncTask.fromFactory((abortable: Abortable) => result.value(abortable), abortable)
          .successful((value: GValue, abortable: Abortable): AsyncTask<void> => {
            return sink(
              value,
              abortable,
            );
          })
          .successful((_, abortable: Abortable): AsyncTask<void> => {
            return loop(abortable);
          });
      }
    };

    return loop(abortable)
      .finally((state: IAsyncTaskState<void>, abortable: Abortable): void => {
        if (state.state === 'error') {
          if (typeof iterator.throw === 'function') {
            iterator.throw(state.error);
          }
        } else {
          if (typeof iterator.return === 'function') {
            iterator.return();
          }
        }
      });
  };
}
