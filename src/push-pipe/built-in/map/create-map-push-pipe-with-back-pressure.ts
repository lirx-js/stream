import { IAsyncTaskConstraint } from '@lirx/async-task';
import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';
import { IPushPipeWithBackPressure } from '../../push-pipe-with-back-pressure.type';
import { IMapPushPipeWithBackPressureFunction, mapPushPipeWithBackPressure } from './map-push-pipe-with-back-pressure';

export function createMapPushPipeWithBackPressure<GIn, GOut extends IAsyncTaskConstraint<GOut>>(
  map: IMapPushPipeWithBackPressureFunction<GIn, GOut>,
): IPushPipeWithBackPressure<GIn, GOut> {
  return (
    source: IPushSourceWithBackPressure<GIn>,
  ): IPushSourceWithBackPressure<GOut> => {
    return mapPushPipeWithBackPressure<GIn, GOut>(source, map);
  };
}
