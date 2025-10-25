import { create } from "zustand";
import { nanoid } from "nanoid";

export type TicketStatus = "open" | "in_progress" | "closed";
export type Ticket = {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};

type State = {
  tickets: Ticket[];
  load: () => void;
  create: (t: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => void;
  update: (id: string, patch: Partial<Ticket>) => void;
  remove: (id: string) => void;
};

const LS_KEY = "ticketapp_tickets";

export const useTickets = create<State>((set, get) => ({
  tickets: [],
  load: () => {
    const raw = localStorage.getItem(LS_KEY);
    const list: Ticket[] = raw ? JSON.parse(raw) : [];
    set({ tickets: list });
  },
  create: (t) => {
    if (!t.title?.trim()) throw new Error("Title is required");
    if (!["open", "in_progress", "closed"].includes(t.status))
      throw new Error("Invalid status");
    const now = new Date().toISOString();
    const item: Ticket = { ...t, id: nanoid(), createdAt: now, updatedAt: now };
    const next = [item, ...get().tickets];
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    set({ tickets: next });
  },
  update: (id, patch) => {
    const next = get().tickets.map((x) => {
      if (x.id !== id) return x;
      const merged = { ...x, ...patch, updatedAt: new Date().toISOString() };
      if (!merged.title?.trim()) throw new Error("Title is required");
      if (!["open", "in_progress", "closed"].includes(merged.status))
        throw new Error("Invalid status");
      if (merged.description && merged.description.length > 2000)
        throw new Error("Description too long (max 2000)");
      return merged;
    });
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    set({ tickets: next });
  },
  remove: (id) => {
    const next = get().tickets.filter((x) => x.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    set({ tickets: next });
  },
}));
