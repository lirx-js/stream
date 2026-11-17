export interface IWebSocketStreamCloseOptions {
  readonly code?: number;
  readonly reason?: string;
}

export interface IWebSocketStreamCloseFunction {
  (
    options?: IWebSocketStreamCloseOptions,
  ): void;
}
