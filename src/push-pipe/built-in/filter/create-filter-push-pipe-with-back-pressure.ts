import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';
import { IPushPipeWithBackPressure } from '../../push-pipe-with-back-pressure.type';
import { filterPushPipeWithBackPressure, IFilterPushPipeWithBackPressureFunction } from './filter-push-pipe-with-back-pressure';

export function createFilterPushPipeWithBackPressure<GValue>(
  filter: IFilterPushPipeWithBackPressureFunction<GValue>,
): IPushPipeWithBackPressure<GValue, GValue> {
  return (
    source: IPushSourceWithBackPressure<GValue>,
  ): IPushSourceWithBackPressure<GValue> => {
    return filterPushPipeWithBackPressure<GValue>(source, filter);
  };
}
