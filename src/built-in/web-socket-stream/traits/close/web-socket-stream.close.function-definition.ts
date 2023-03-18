export interface IWebSocketStreamCloseOptions {
  code?: number;
  reason?: string;
}

export interface IWebSocketStreamCloseFunction {
  (
    options?: IWebSocketStreamCloseOptions,
  ): void;
}
