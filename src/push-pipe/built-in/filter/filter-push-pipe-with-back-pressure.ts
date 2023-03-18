import { Abortable, AsyncTask, IAsyncTaskInput } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';

export interface IFilterPushPipeWithBackPressureFunction<GIn> {
  (
    value: GIn,
    abortable: Abortable,
  ): IAsyncTaskInput<boolean>;
}

export function filterPushPipeWithBackPressure<GValue>(
  source: IPushSourceWithBackPressure<GValue>,
  filter: IFilterPushPipeWithBackPressureFunction<GValue>,
): IPushSourceWithBackPressure<GValue> {
  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return source((
      value: GValue,
      abortable: Abortable,
    ): AsyncTask<void> => {
      return AsyncTask.fromFactory<boolean>(() => filter(value, abortable), abortable)
        .successful((
          pass: boolean,
        ): AsyncTask<void> | void => {
          if (pass) {
            return sink(value, abortable);
          }
        });
    }, abortable);
  };
}

