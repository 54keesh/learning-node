export type Status = "available" | "not_available" | "in_transit";

// index signature
export interface Book {
  title: string;
  pages: number;
  status?: BookStatus; // union type and optional
  summary?: string | null;
  body?: string;

  // index signature should satisfy current properties and future properties
  [key: string]: string | number | Status | null | undefined | boolean;
}

// enum for reusability and to avoid typos and to get the benefits of ts
export enum BookStatus {
  Available = "available",
  NotAvailable = "not_available",
  InTransit = "in_transit",
}

// its a type
export type BookKeys = keyof Book;
