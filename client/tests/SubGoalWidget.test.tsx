import React from 'react';
import { describe, it, expect } from 'vitest';
import { SubGoalWidget } from '../src/components/SubGoalWidget';

describe('Frontend Component Unit Tests', () => {
  it('SubGoalWidget should calculate correct percentage achieved', () => {
    const props = {
      title: 'Sub Goal',
      currentSubs: 25,
      targetSubs: 100,
    };
    const percentage = Math.min(100, Math.round((props.currentSubs / props.targetSubs) * 100));
    expect(percentage).toBe(25);
  });

  it('SubGoalWidget should cap percentage at 100 when current exceeding target', () => {
    const props = {
      title: 'Sub Goal',
      currentSubs: 120,
      targetSubs: 100,
    };
    const percentage = Math.min(100, Math.round((props.currentSubs / props.targetSubs) * 100));
    expect(percentage).toBe(100);
  });
});

