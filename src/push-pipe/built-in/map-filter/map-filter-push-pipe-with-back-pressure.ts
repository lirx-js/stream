import { Abortable, AsyncTask, IAsyncTaskConstraint, IAsyncTaskInput } from '@lirx/async-task';
import { IPushSinkWithBackPressure } from '../../../push-sink/push-sink-with-back-pressure.type';
import { IPushSourceWithBackPressure } from '../../../push-source/push-source-with-back-pressure.type';
import {
  IMapFilterPushPipeWithBackPressureDiscard,
  MAP_FILTER_PUSH_PIPE_WITH_BACK_PRESSURE_DISCARD,
} from './map-filter-push-pipe-with-back-pressure-discard.constant';

export type IMapFilterPushPipeWithBackPressureFunctionReturn<GOut extends IAsyncTaskConstraint<GOut>> =
  | IAsyncTaskInput<GOut>
  | IAsyncTaskInput<IMapFilterPushPipeWithBackPressureDiscard>
  ;

export interface IMapFilterPushPipeWithBackPressureFunction<GIn, GOut extends IAsyncTaskConstraint<GOut>> {
  (
    value: GIn,
    abortable: Abortable,
  ): IMapFilterPushPipeWithBackPressureFunctionReturn<GOut>;
}

export function mapFilterPushPipeWithBackPressure<GIn, GOut extends IAsyncTaskConstraint<GOut>>(
  source: IPushSourceWithBackPressure<GIn>,
  mapFilter: IMapFilterPushPipeWithBackPressureFunction<GIn, GOut>,
): IPushSourceWithBackPressure<GOut> {
  return (
    sink: IPushSinkWithBackPressure<GOut>,
    abortable: Abortable,
  ): AsyncTask<void> => {
    return source((
      value: GIn,
      abortable: Abortable,
    ): AsyncTask<void> => {
      return AsyncTask.fromFactory<GOut>(() => mapFilter(value, abortable) as IAsyncTaskInput<GOut>, abortable)
        .successful((
          value: GOut | IMapFilterPushPipeWithBackPressureDiscard,
        ): AsyncTask<void> | void => {
          if (value !== MAP_FILTER_PUSH_PIPE_WITH_BACK_PRESSURE_DISCARD) {
            return sink(value, abortable);
          }
        });
    }, abortable);
  };
}

