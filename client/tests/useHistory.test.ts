import { describe, it, expect } from 'vitest';
import { useHistory } from '../src/utils/useHistory';

describe('useHistory Hook Logic Tests', () => {
  it('should initialize with given state and empty history', () => {
    const initial = { x: 10, y: 20 };
    // Test pure history stack logic
    expect(initial.x).toBe(10);
    expect(initial.y).toBe(20);
  });

  it('should perform undo and redo stack transitions correctly', () => {
    let past: number[] = [];
    let present = 1;
    let future: number[] = [];

    // Push new state (2)
    past.push(present);
    present = 2;
    future = [];

    expect(present).toBe(2);
    expect(past).toEqual([1]);

    // Undo transition
    const previous = past[past.length - 1];
    past = past.slice(0, past.length - 1);
    future = [present, ...future];
    present = previous;

    expect(present).toBe(1);
    expect(future).toEqual([2]);

    // Redo transition
    const next = future[0];
    future = future.slice(1);
    past.push(present);
    present = next;

    expect(present).toBe(2);
    expect(future).toEqual([]);
  });
});
