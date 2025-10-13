import { useContext } from 'react';
import { WorkerCartContext } from '@/contexts/WorkerCartContextDefinition';

export const useWorkerCart = () => {
  const context = useContext(WorkerCartContext);
  if (context === undefined) {
    throw new Error('useWorkerCart must be used within a WorkerCartProvider');
  }
  return context;
};