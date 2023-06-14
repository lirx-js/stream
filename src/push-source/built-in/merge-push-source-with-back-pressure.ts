import { Abortable, AsyncTask, IAsyncTaskFactory } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../push-source-with-back-pressure.type';

export function mergePushSourceWithBackPressure<GValue>(
  pushSources: readonly IPushSourceWithBackPressure<GValue>[],
): IPushSourceWithBackPressure<GValue> {
  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return AsyncTask.all(
      pushSources.map((pushSource: IPushSourceWithBackPressure<GValue>): IAsyncTaskFactory<void> => {
        return (abortable: Abortable): AsyncTask<void> => {
          return pushSource(sink, abortable);
        };
      }),
      abortable,
    )
      .successful(() => {
      });
  };
}
