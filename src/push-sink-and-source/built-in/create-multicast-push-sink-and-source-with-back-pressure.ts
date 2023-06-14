import { Abortable, AsyncTask, IAsyncTaskFactory } from '@lirx/async-task';
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
        return (abortable: Abortable): AsyncTask<void> => {
          return sink(value, abortable);
        };
      }),
      abortable,
    )
      .successful(() => {
      });
  };

  const source: IPushSourceWithBackPressure<GValue> = (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    sinks.push((
      value: GValue,
      abortable: Abortable,
    ): AsyncTask<void> => {
      return sink(value, abortable);
    });

    abortable.onAbort((): void => {
      sinks.splice(sinks.indexOf(sink), 1);
      sink = (
        value: GValue,
        abortable: Abortable,
      ): AsyncTask<void> => {
        return AsyncTask.void(abortable);
      };
    });

    return AsyncTask.never<void>(abortable);
  };

  return {
    sink,
    source,
  };
}
