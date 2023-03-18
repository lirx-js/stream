import { Abortable, AsyncTask } from '@lirx/async-task';

export interface IWebSocketStreamUntilClosedResult {
  readonly code: number;
  readonly reason: string;
  readonly wasClean: boolean;
}

export interface IWebSocketStreamUntilClosedFunction {
  (
    abortable: Abortable,
  ): AsyncTask<IWebSocketStreamUntilClosedResult>;
}
