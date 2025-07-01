import { Variant } from './variant';

export interface LiftoverResponse {
  success: boolean;
  data?: Variant;
  error?: {
    message: string;
  };
}
