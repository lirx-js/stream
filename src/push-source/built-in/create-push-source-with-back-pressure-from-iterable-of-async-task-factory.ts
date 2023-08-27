import { Abortable, AsyncTask, IAsyncTaskFactory, IAsyncTaskResolvedState, IAsyncTaskConstraint } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../push-source-with-back-pressure.type';

// export interface IAsyncTaskIteratorFactory<GValue extends IAsyncTaskConstraint<GValue>> {
//   (
//     abortable: Abortable,
//   ): Iterator<AsyncTask<GValue>, any, Abortable>;
// }

/**
 * @deprecated
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

    const task: AsyncTask<void> = loop(abortable);

    AsyncTask.whenResolved(task, (state: IAsyncTaskResolvedState<void>): void => {
      if (state.state === 'error') {
        if (typeof iterator.throw === 'function') {
          iterator.throw(state.error);
        }
      } else if (state.state === 'abort') {
        if (typeof iterator.return === 'function') {
          iterator.return();
        }
      }
    });

    return task;
  };
}
