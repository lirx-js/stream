import { Abortable, AsyncTask } from '@lirx/async-task';

export interface IPushSinkWithBackPressure<GValue> {
  (
    value: GValue,
    abortable: Abortable,
  ): AsyncTask<void>;
}

