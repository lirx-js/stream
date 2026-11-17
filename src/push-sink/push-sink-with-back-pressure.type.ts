import { Abortable, IAsyncTaskInput } from '@lirx/async-task';

export interface IPushSinkWithBackPressure<GValue> {
  (
    value: GValue,
    abortable: Abortable,
  ): IAsyncTaskInput<void>;
}

