import React from 'react';
import { EventEmitter } from 'events';

// Create a new context
export const HassContext = React.createContext(new EventEmitter());

// Create a provider component
export const HassContextProvider = ({ children, appInstance }: { children: React.ReactNode, appInstance: any }) => {

  const eventEmitter = React.useRef(new EventEmitter()).current;
  const oldstate = React.useRef<any>({ narrow: undefined, hass: undefined });

  React.useEffect(() => {
    const observeChanges = () => {
      // observe narrow
      if (oldstate.current.narrow !== appInstance?.narrow) {
        oldstate.current.narrow = appInstance.narrow;
        eventEmitter.emit('narrowChanged', appInstance.narrow);
      }
      // observe hass
      if (oldstate.current.hass !== appInstance?.hass) {
        oldstate.current.hass = appInstance?.hass;
        eventEmitter.emit('hassChanged', appInstance.hass);
      }
    };

    const intervalId = setInterval(observeChanges, 1000); 

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <HassContext.Provider value={eventEmitter}>
      {children}
    </HassContext.Provider>
  );
};