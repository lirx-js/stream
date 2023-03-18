import { IWebSocketStreamCloseTrait } from './traits/close/web-socket-stream.close.trait';
import { IWebSocketStreamInputTrait } from './traits/input/web-socket-stream.input.trait';
import { IWebSocketStreamOutputTrait } from './traits/output/web-socket-stream.output.trait';
import { IWebSocketStreamUntilClosedTrait } from './traits/until-closed/web-socket-stream.until-closed.trait';

export interface IWebSocketStream extends //
  IWebSocketStreamInputTrait,
  IWebSocketStreamOutputTrait,
  IWebSocketStreamCloseTrait,
  IWebSocketStreamUntilClosedTrait
  //
{

}
