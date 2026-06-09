import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  defaultAccommodations,
  toggle as toggleAccommodation,
  type AccommodationKey,
  type AccommodationsState,
} from './accommodations';

interface AccommodationsContextValue {
  state: AccommodationsState;
  toggle: (key: AccommodationKey) => void;
}

const AccommodationsContext = createContext<AccommodationsContextValue | null>(null);

export interface AccommodationsProviderProps {
  children: ReactNode;
  /** Seed non-default accommodations (deep links / tests). Merged over the defaults. */
  initial?: Partial<AccommodationsState>;
}

/** Holds the single accommodations state for the active session. */
export function AccommodationsProvider({ children, initial }: AccommodationsProviderProps) {
  const [state, setState] = useState<AccommodationsState>({ ...defaultAccommodations, ...initial });
  const value = useMemo<AccommodationsContextValue>(
    () => ({ state, toggle: (key) => setState((s) => toggleAccommodation(s, key)) }),
    [state],
  );
  return <AccommodationsContext.Provider value={value}>{children}</AccommodationsContext.Provider>;
}

/** Full control of accommodations; must be used within a provider (the bar). */
export function useAccommodations(): AccommodationsContextValue {
  const value = useContext(AccommodationsContext);
  if (!value) throw new Error('useAccommodations must be used within an AccommodationsProvider');
  return value;
}

/** Read-only accommodations that degrades to defaults when no provider is present,
 * so honoring components (ItemRenderer, ModulePlayer) stay usable in isolation. */
export function useAccommodationsState(): AccommodationsState {
  return useContext(AccommodationsContext)?.state ?? defaultAccommodations;
}
