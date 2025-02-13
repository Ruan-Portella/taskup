import { useMedia } from 'react-use';

import { Dialog, DialogContent } from './ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from './ui/drawer';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({ children, open, onOpenChange }: ResponsiveModalProps) => {
  const isDesktop = useMedia('(min-width: 1024px)', true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle className='hidden'>Modal Title</DialogTitle>
        <DialogDescription className='hidden'>Modal Description</DialogDescription>
        <DialogContent className='w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh] overflow-visible'>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTitle className='hidden'>Modal Title</DrawerTitle>
      <DrawerDescription className='hidden'>Modal Description</DrawerDescription>
      <DrawerContent>
        <div className='overflow-y-auto hide-scrollbar max-h-[85vh] overflow-visible'>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};