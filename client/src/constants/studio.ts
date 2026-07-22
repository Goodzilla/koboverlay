import { WidgetInstance } from '../components/LayerTree';

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;

export const DEFAULT_STUDIO_STATE = {
  widgets: [
    {
      id: 'subGoal_default',
      type: 'subGoal' as const,
      label: 'Sub Goal (Default)',
      layout: { x: 720, y: 40, width: 480, height: 74, visible: true },
      config: {
        title: 'SUB GOAL',
        currentSubs: 18,
        targetSubs: 50,
        primaryColor: '#6366f1',
        backgroundColor: '#18181b',
        textColor: '#ffffff',
        fontSize: 16,
        showProgressBar: true,
        progressBarBgColor: '#000000',
        progressBarHeight: 10,
        showPercentage: true,
      },
    },
    {
      id: 'subAlert_default',
      type: 'subAlert' as const,
      label: 'Main Sub Alert',
      layout: { x: 720, y: 160, width: 480, height: 90, visible: true },
      config: {
        title: 'NEW SUBSCRIBER!',
        primaryColor: '#38bdf8',
        backgroundColor: '#0f172a',
        textColor: '#ffffff',
        fontSize: 20,
        soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
        soundVolume: 80,
      },
    },
  ] as WidgetInstance[],
};
