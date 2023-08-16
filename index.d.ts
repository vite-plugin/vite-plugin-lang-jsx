import { Plugin } from 'vite';

declare const langJsx: LangJsx;
export default langJsx;

export interface LangJsx {
  (options?: {
    filter?: (id: string) => boolean | void;
  }): Plugin[];
}
