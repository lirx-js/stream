import { IAsyncTaskConstraint } from '@lirx/async-task';
import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';
import { IPushPipeWithBackPressure } from '../../push-pipe-with-back-pressure.type';
import { IMapFilterPushPipeWithBackPressureFunction, mapFilterPushPipeWithBackPressure } from './map-filter-push-pipe-with-back-pressure';

export function createMapFilterPushPipeWithBackPressure<GIn, GOut extends IAsyncTaskConstraint<GOut>>(
  map: IMapFilterPushPipeWithBackPressureFunction<GIn, GOut>,
): IPushPipeWithBackPressure<GIn, GOut> {
  return (
    source: IPushSourceWithBackPressure<GIn>,
  ): IPushSourceWithBackPressure<GOut> => {
    return mapFilterPushPipeWithBackPressure<GIn, GOut>(source, map);
  };
}
