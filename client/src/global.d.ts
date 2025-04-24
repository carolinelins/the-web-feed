// src/types/bootstrap.d.ts
import type * as Bootstrap from 'bootstrap';

declare global {
  interface Window {
    bootstrap: typeof Bootstrap;
  }
}
