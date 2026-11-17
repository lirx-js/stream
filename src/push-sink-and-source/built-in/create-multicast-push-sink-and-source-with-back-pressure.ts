import { Abortable, AsyncTask, IAsyncTaskFactory, IAsyncTaskInput } from '@lirx/async-task';
import { noop } from '@lirx/utils';
import { IPushSinkWithBackPressure } from '../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../../push-source/push-source-with-back-pressure.type';
import { IPushSinkAndSourceWithBackPressure } from '../push-sink-and-source-with-back-pressure.type';

export function createMulticastPushSinkAndSourceWithBackPressure<GValue>(): IPushSinkAndSourceWithBackPressure<GValue> {
  const sinks: IPushSinkWithBackPressure<GValue>[] = [];

  const sink: IPushSinkWithBackPressure<GValue> = (
    value: GValue,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return AsyncTask.all(
      sinks.map((sink: IPushSinkWithBackPressure<GValue>): IAsyncTaskFactory<void> => {
        return (abortable: Abortable): IAsyncTaskInput<void> => {
          return sink(value, abortable);
        };
      }),
      abortable,
    )
      .successful(noop);
  };

  const source: IPushSourceWithBackPressure<GValue> = (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    sinks.push(sink);

    abortable.onAbort((): void => {
      sinks.splice(sinks.indexOf(sink), 1);
      sink = noop;
    });

    return AsyncTask.never<void>(abortable);
  };

  return {
    sink,
    source,
  };
}
