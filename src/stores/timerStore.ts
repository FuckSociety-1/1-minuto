import { create } from 'zustand';

interface TimerState {
  startTime: number | null;
  setStartTime: (time: number | null) => void;
  getTimeRemaining: () => number;
  resetTimer: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => {
  // Load from localStorage on init
  const savedStartTime = typeof window !== 'undefined' 
    ? localStorage.getItem('timerStartTime')
    : null;
  
  const initialStartTime = savedStartTime ? parseInt(savedStartTime, 10) : null;

  return {
    startTime: initialStartTime,
    
    setStartTime: (time: number | null) => {
      set({ startTime: time });
      if (typeof window !== 'undefined') {
        if (time === null) {
          localStorage.removeItem('timerStartTime');
        } else {
          localStorage.setItem('timerStartTime', time.toString());
        }
      }
    },

    getTimeRemaining: () => {
      const state = get();
      if (!state.startTime) return 60;
      
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      
      return remaining;
    },

    resetTimer: () => {
      const now = Date.now();
      set({ startTime: now });
      if (typeof window !== 'undefined') {
        localStorage.setItem('timerStartTime', now.toString());
      }
    },
  };
});
