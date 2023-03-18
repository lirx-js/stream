import { Abortable, AsyncTask, IAbortFunction, IAsyncTaskConstraint, IAsyncTaskFactory } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';

export function sharePushPipeWithBackPressure<GValue extends IAsyncTaskConstraint<GValue>>(
  source: IPushSourceWithBackPressure<GValue>,
): IPushSourceWithBackPressure<GValue> {
  const sinks: IPushSinkWithBackPressure<GValue>[] = [];
  let sourceTask: AsyncTask<void>;

  let _abort: IAbortFunction;
  let _abortable: Abortable;

  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    sinks.push(sink);

    abortable.onAbort((
      reason: any,
    ): void => {
      sinks.splice(sinks.indexOf(sink), 1);

      if (sinks.length === 0) {
        _abort(reason);
      }
    });

    if (sinks.length === 1) {
      [_abort, _abortable] = Abortable.derive();

      sourceTask = source(
        (
          value: GValue,
          abortable: Abortable,
        ): AsyncTask<void> => {
          return AsyncTask.all(
            sinks.map((
              sink: IPushSinkWithBackPressure<GValue>,
            ): IAsyncTaskFactory<void> => {
              return (
                abortable: Abortable,
              ): AsyncTask<void> => {
                return sink(value, abortable);
              };
            }),
            abortable,
          ).successful(() => {});
        },
        _abortable,
      )
        .aborted(() => {}, abortable);
    }

    return sourceTask;
  };
}

