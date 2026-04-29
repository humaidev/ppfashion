import { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<{ conn: Mongoose | null; promise: unknown | null }> | null;
  };
}

export {};
