import React from 'react';
import { EventEmitter } from 'events';

interface HassContextValue {
  eventEmitter: EventEmitter;
  hass: any;
  narrow: any;
}

// Create a new context
export const HassContext = React.createContext<HassContextValue>({"eventEmitter": new EventEmitter(), "hass": undefined, "narrow": undefined});

// Create a provider component
export const HassContextProvider = ({ children, appInstance }: { children: React.ReactNode, appInstance: any }) => {

  const eventEmitter = React.useRef(new EventEmitter()).current;
  const oldstate = React.useRef<any>({ narrow: undefined, hass: undefined });

  // We use the state here since narrow does not change its state that often.
  // We want our components to rerender only when narrow changes.
  // Otherwise we get the state through the eventEmitter.
  const [hassAndNarrow, setHassAndNarrow] = React.useState<any>({});

  React.useEffect(() => {
    const observeChanges = () => {
      // observe narrow
      if (oldstate.current.narrow !== appInstance?.narrow) {
        oldstate.current.narrow = appInstance.narrow;
        eventEmitter.emit('narrowChanged', appInstance.narrow);
        setHassAndNarrow({narrow: appInstance.narrow, hass: appInstance.hass})
      }
      // observe hass
      if (oldstate.current.hass !== appInstance?.hass) {
        oldstate.current.hass = appInstance?.hass;
        eventEmitter.emit('hassChanged', appInstance.hass);
      }
    };

    const intervalId = setInterval(observeChanges, 1000); 

    return () => clearInterval(intervalId); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HassContext.Provider value={{
        eventEmitter, 
        "hass": hassAndNarrow.hass, 
        "narrow": hassAndNarrow.narrow}}>
      {children}
    </HassContext.Provider>
  );
};