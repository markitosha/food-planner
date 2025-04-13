'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export const Error = ({ error }: { error?: string }) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(error);
  }, [error]);

  return null;
};
