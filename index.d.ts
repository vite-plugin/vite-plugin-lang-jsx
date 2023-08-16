import { Plugin } from 'vite';

declare const langJsx: LangJsx;
export default langJsx;

export interface LangJsx {
  (options?: {
    filter?: (id: string) => boolean | void;
    /**
     * Check JSX with ast, and use RegExp by default.
     */
    useAst?: boolean;
  }): Plugin[];
}
