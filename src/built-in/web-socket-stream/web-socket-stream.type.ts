import { IWebSocketStreamCloseTrait } from './traits/close/web-socket-stream.close.trait';
import { IWebSocketStreamGetStateTrait } from './traits/get-state/web-socket-stream.get-state.trait';
import { IWebSocketStreamInputTrait } from './traits/input/web-socket-stream.input.trait';
import { IWebSocketStreamOutputTrait } from './traits/output/web-socket-stream.output.trait';
import { IWebSocketStreamUntilClosedTrait } from './traits/until-closed/web-socket-stream.until-closed.trait';

export interface IWebSocketStream extends //
  IWebSocketStreamInputTrait,
  IWebSocketStreamOutputTrait,
  IWebSocketStreamGetStateTrait,
  IWebSocketStreamCloseTrait,
  IWebSocketStreamUntilClosedTrait
  //
{

}
