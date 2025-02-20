import { useEffect, useState } from 'react';
import type {
  BasisTheoryInitOptionsWithElements,
  BasisTheoryInitOptionsWithoutElements,
} from '@basis-theory/basis-theory-js/types/sdk';
import type { BasisTheoryReact as IBasisTheoryReact } from '../types';
import { useBasisTheoryFromContext } from './BasisTheoryProvider';
import { BasisTheoryReact } from './BasisTheoryReact';

type UseBasisTheory<Elements extends boolean> = {
  error?: Error;
  bt?: IBasisTheoryReact<Elements>;
};

function useBasisTheory(
  apiKey?: string,
  options?: BasisTheoryInitOptionsWithoutElements
): UseBasisTheory<true>;

function useBasisTheory(
  apiKey: string,
  options?: BasisTheoryInitOptionsWithoutElements
): UseBasisTheory<false>;

function useBasisTheory(
  apiKey: string | undefined,
  options: BasisTheoryInitOptionsWithElements
): UseBasisTheory<true>;

// eslint-disable-next-line get-off-my-lawn/prefer-arrow-functions
function useBasisTheory(
  apiKey?: string,
  options?:
    | BasisTheoryInitOptionsWithElements
    | BasisTheoryInitOptionsWithoutElements
): UseBasisTheory<boolean> {
  const [state, setState] = useState<UseBasisTheory<boolean>>({});

  const { bt: btFromContext } = useBasisTheoryFromContext();

  useEffect(() => {
    (async (): Promise<void> => {
      if (!state.bt && apiKey && !state.error) {
        try {
          const bt = (await new BasisTheoryReact().init(
            apiKey,
            options as BasisTheoryInitOptionsWithElements &
              BasisTheoryInitOptionsWithoutElements
          )) as BasisTheoryReact;

          setState({
            bt,
          });
        } catch (error) {
          setState({
            error: error as Error,
          });
        }
      }
    })();
  }, [state.bt, apiKey, options, state.error]);

  if (state.bt || state.error) {
    return {
      bt: state.bt,
      error: state.error,
    };
  }

  return {
    bt: btFromContext,
  };
}

export { useBasisTheory };
