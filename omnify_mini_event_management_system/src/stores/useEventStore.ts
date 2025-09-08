// stores/useEventStore.ts
import { create } from "zustand";
import { Event } from "@/types/event";

type EventStore = {
  events: Event[];
  currentEvent: any | null;
  setCurrentEvent: (event: any) => void;
  addEvent: (event: Omit<Event, "id">) => void;
  editEvent: (id: string, updated: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
};

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  currentEvent: null,
  setCurrentEvent: (event) => set({ currentEvent: event }),

  addEvent: (event) =>
    set((state) => {
      const newEvent: Event = {
        ...event,
        id: String(state.events.length + 1), // auto-generate id
      };
      return { events: [...state.events, newEvent] };
    }),

  editEvent: (id, updated) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),

  getEventById: (id) => get().events.find((e) => e.id === id),
}));
