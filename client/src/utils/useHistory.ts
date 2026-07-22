import { useState, useCallback, useEffect } from 'react';

export function useHistory<T>(initialPresent: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialPresent);
  const [future, setFuture] = useState<T[]>([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture([present, ...future]);
    setPresent(previous);
  }, [canUndo, past, present, future]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [canRedo, future, past, present]);

  const set = useCallback(
    (newPresent: T | ((current: T) => T)) => {
      const resolvedPresent =
        typeof newPresent === 'function' ? (newPresent as Function)(present) : newPresent;

      if (JSON.stringify(resolvedPresent) === JSON.stringify(present)) return;

      setPast((prevPast) => [...prevPast, present]);
      setPresent(resolvedPresent);
      setFuture([]);
    },
    [present]
  );

  // Global hotkey listeners for Ctrl+Z and Ctrl+Shift+Z / Cmd+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger undo/redo if user is typing in an input field
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    state: present,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: past.length,
  };
}
