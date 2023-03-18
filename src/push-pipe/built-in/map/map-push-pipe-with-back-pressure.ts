import { Abortable, AsyncTask, IAsyncTaskConstraint, IAsyncTaskInput } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';

export interface IMapPushPipeWithBackPressureFunction<GIn, GOut extends IAsyncTaskConstraint<GOut>> {
  (
    value: GIn,
    abortable: Abortable,
  ): IAsyncTaskInput<GOut>;
}

export function mapPushPipeWithBackPressure<GIn, GOut extends IAsyncTaskConstraint<GOut>>(
  source: IPushSourceWithBackPressure<GIn>,
  map: IMapPushPipeWithBackPressureFunction<GIn, GOut>,
): IPushSourceWithBackPressure<GOut> {
  return (
    sink: IPushSinkWithBackPressure<GOut>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return source((
      value: GIn,
      abortable: Abortable,
    ): AsyncTask<void> => {
      return AsyncTask.fromFactory<GOut>(() => map(value, abortable), abortable)
        .successful((
          value: GOut,
        ): AsyncTask<void> => {
          return sink(value, abortable);
        });
    }, abortable);
  };
}

