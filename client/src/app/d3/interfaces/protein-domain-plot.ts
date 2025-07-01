import { Margin } from './margin';

export interface PDShape {
  shape: string;
  fill: string;
  textColor: string;
}
export interface PDConfig {
  width?: number;
  height?: number;
  margin?: Margin;
  lowCompHeight?: number;
  bgColor?: string;
  hideDomainLabel?: boolean;
}
