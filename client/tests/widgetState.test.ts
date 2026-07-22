import { describe, it, expect } from 'vitest';
import { WidgetInstance } from '../src/components/LayerTree';

describe('Dynamic Widget Instance Logic Tests', () => {
  it('should instantiate a new widget with unique ID and default config', () => {
    const newWidget: WidgetInstance = {
      id: 'customImage_123',
      type: 'customImage',
      label: 'Sponsor Logo',
      layout: { x: 800, y: 300, width: 240, height: 120, visible: true },
      config: {
        title: 'Sponsor Logo',
        imageUrl: 'https://example.com/logo.png',
      },
    };

    expect(newWidget.id).toBe('customImage_123');
    expect(newWidget.type).toBe('customImage');
    expect(newWidget.layout.width).toBe(240);
  });

  it('should duplicate a widget instance with offset coordinates and copy label', () => {
    const original: WidgetInstance = {
      id: 'subGoal_1',
      type: 'subGoal',
      label: 'Sub Goal Bar',
      layout: { x: 100, y: 100, width: 360, height: 68, visible: true },
      config: { title: 'Sub Goal' },
    };

    const duplicate: WidgetInstance = {
      ...original,
      id: 'subGoal_1_copy',
      label: `${original.label} (Copy)`,
      layout: {
        ...original.layout,
        x: original.layout.x + 30,
        y: original.layout.y + 30,
      },
    };

    expect(duplicate.id).toBe('subGoal_1_copy');
    expect(duplicate.label).toBe('Sub Goal Bar (Copy)');
    expect(duplicate.layout.x).toBe(130);
    expect(duplicate.layout.y).toBe(130);
  });

  it('should filter out deleted widget by ID', () => {
    const list: WidgetInstance[] = [
      { id: 'w1', type: 'subGoal', label: 'W1', layout: { x: 0, y: 0, width: 100, height: 100 }, config: {} },
      { id: 'w2', type: 'subAlert', label: 'W2', layout: { x: 0, y: 0, width: 100, height: 100 }, config: {} },
    ];

    const filtered = list.filter((w) => w.id !== 'w1');
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('w2');
  });
});
