import { Plugin } from 'vite';

declare const langJsx: LangJsx;
export default langJsx;

export interface LangJsx {
  (): Plugin[];
}
