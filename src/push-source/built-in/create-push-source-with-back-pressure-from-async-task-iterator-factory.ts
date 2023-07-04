import { Abortable, AsyncTask } from '@lirx/async-task';
import { IAsyncTaskConstraint } from '@lirx/async-task/src/async-task/types/async-task-constraint.type';
import { IPushSinkWithBackPressure } from '../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../push-source-with-back-pressure.type';

export interface IAsyncTaskIteratorFactory<GValue extends IAsyncTaskConstraint<GValue>> {
  (
    abortable: Abortable,
  ): Iterator<AsyncTask<GValue>, any, Abortable>;
}

/**
 * @deprecated
 * @param factory
 */
export function createPushSourceWithBackPressureFromAsyncTaskIteratorFactory<GValue extends IAsyncTaskConstraint<GValue>>(
  factory: IAsyncTaskIteratorFactory<GValue>,
): IPushSourceWithBackPressure<GValue> {
  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    const iterator: Iterator<AsyncTask<GValue>, any, Abortable> = factory(abortable);

    const loop = (
      abortable: Abortable,
    ): AsyncTask<void> => {
      return AsyncTask.fromFactory(() => iterator.next(abortable), abortable)
        .successful((result: IteratorResult<AsyncTask<GValue>>, abortable: Abortable): AsyncTask<void> | void => {
          if (!result.done) {
            return result.value
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
        });
    };

    return loop(abortable)
      .errored((error: any): never => {
        if (typeof iterator.throw === 'function') {
          iterator.throw(error);
        }
        throw error;
      })
      .aborted((): void => {
        if (typeof iterator.return === 'function') {
          iterator.return();
        }
      });
  };
}
