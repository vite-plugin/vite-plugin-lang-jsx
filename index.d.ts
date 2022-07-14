import { Plugin } from 'vite';

const langJsx: LangJsx;
export default langJsx;

export interface LangJsx {
  (): Plugin;
}
