import { Abortable, AsyncTask, IAsyncTaskConstraint, IAsyncTaskFactory, IAsyncTaskInput } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../push-source-with-back-pressure.type';

export function createPushSourceWithBackPressureFromAsyncTaskFactory<GValue extends IAsyncTaskConstraint<GValue>>(
  factory: IAsyncTaskFactory<GValue>,
): IPushSourceWithBackPressure<GValue> {
  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return AsyncTask.fromFactory(factory, abortable)
      .successful((value: GValue, abortable: Abortable): IAsyncTaskInput<void> => {
        return sink(value, abortable);
      });
  };
}
