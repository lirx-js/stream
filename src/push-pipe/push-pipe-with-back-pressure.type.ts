import { IPushSourceWithBackPressure } from '../push-source/push-source-with-back-pressure.type';

export interface IPushPipeWithBackPressure<GIn, GOut> {
  (
    source: IPushSourceWithBackPressure<GIn>,
  ): IPushSourceWithBackPressure<GOut>;
}

