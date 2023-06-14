import { IDistinctOptions } from '@lirx/utils';
import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';
import { IPushPipeWithBackPressure } from '../../push-pipe-with-back-pressure.type';
import { distinctPushPipeWithBackPressure } from './distinct-push-pipe-with-back-pressure';

export function createDistinctPushPipeWithBackPressure<GValue>(
  options?: IDistinctOptions<GValue>,
): IPushPipeWithBackPressure<GValue, GValue> {
  return (
    source: IPushSourceWithBackPressure<GValue>,
  ): IPushSourceWithBackPressure<GValue> => {
    return distinctPushPipeWithBackPressure<GValue>(source, options);
  };
}
