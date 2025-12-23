import { createContext, useCallback, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';

type DialogOptions = {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  props?: Record<string, any>;
};

type DialogContextType = {
  isOpen: boolean;
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
};

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [props, setProps] = useState<Record<string, any>>({});

  const openDialog = useCallback(async ({ component, props }: DialogOptions) => {
    const imported = await component();
    setComponent(() => imported.default);
    setProps(props || {});
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setComponent(null);
    setProps({});
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, isOpen }}>
      {children}
      <>
        <Dialog
          open={isOpen}
          as="div"
          className="relative z-[1000] focus:outline-none"
          onClose={closeDialog}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-brand-secondary-800/50 backdrop-blur-sm">
            <div className="flex min-h-full items-center justify-center p-4 ">
              <DialogPanel
                transition
                className="relative w-full flex justify-center mx-auto duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
              >
                {Component && <Component {...props} close={closeDialog} />}
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </>
    </DialogContext.Provider>
  );
};
