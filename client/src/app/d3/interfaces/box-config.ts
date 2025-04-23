import { Margin } from './margin';

export interface BoxConfig {
  width: number;
  height: number;
  margin?: Margin;
  group?: {
    label?: string;
  };
  x?: {
    label?: string;
  };
  y?: {
    label?: string;
    unit?: string;
  };
}
