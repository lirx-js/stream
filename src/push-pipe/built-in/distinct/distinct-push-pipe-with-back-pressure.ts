import { Abortable, AsyncTask } from '@lirx/async-task';
import {
  EQUAL_FUNCTION_STRICT_EQUAL,
  getDistinctPreviousValueFromDistinctInitialValueOptions,
  IDistinctOptions,
  IUninitializedToken,
  UNINITIALIZED_TOKEN,
} from '@lirx/utils';
import { IPushSinkWithBackPressure } from '../../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';

export function distinctPushPipeWithBackPressure<GValue>(
  source: IPushSourceWithBackPressure<GValue>,
  {
    equal = EQUAL_FUNCTION_STRICT_EQUAL,
    ...options
  }: IDistinctOptions<GValue> = {},
): IPushSourceWithBackPressure<GValue> {
  return (
    sink: IPushSinkWithBackPressure<GValue>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    let previousValue: GValue | IUninitializedToken = getDistinctPreviousValueFromDistinctInitialValueOptions<GValue>(options);

    return source((
      value: GValue,
      abortable: Abortable,
    ): AsyncTask<void> => {
      if (
        (previousValue === UNINITIALIZED_TOKEN)
        || !equal(value, previousValue)
      ) {
        previousValue = value;
        return sink(value, abortable);
      } else {
        return AsyncTask.void(abortable);
      }
    }, abortable);
  };
}

