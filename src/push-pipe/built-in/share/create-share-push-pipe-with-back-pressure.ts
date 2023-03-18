import { IAsyncTaskConstraint } from '@lirx/async-task';
import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';
import { IPushPipeWithBackPressure } from '../../push-pipe-with-back-pressure.type';
import { sharePushPipeWithBackPressure } from './share-push-pipe-with-back-pressure';

export function createSharePushPipeWithBackPressure<GValue extends IAsyncTaskConstraint<GValue>>(): IPushPipeWithBackPressure<GValue, GValue> {
  return (
    source: IPushSourceWithBackPressure<GValue>,
  ): IPushSourceWithBackPressure<GValue> => {
    return sharePushPipeWithBackPressure<GValue>(source);
  };
}
