import type { SimEvent } from './sim-event.js';

export type SimEventHandler = (event: SimEvent) => void;

/** In-process domain event bus — Doc 14 FL-ENG-004 stub. */
export class DomainEventBus {
  private readonly handlers = new Map<SimEvent['category'] | '*', Set<SimEventHandler>>();

  subscribe(category: SimEvent['category'] | '*', handler: SimEventHandler): () => void {
    const bucket = this.handlers.get(category) ?? new Set();
    bucket.add(handler);
    this.handlers.set(category, bucket);

    return () => {
      bucket.delete(handler);
    };
  }

  publish(event: SimEvent): void {
    const wildcard = this.handlers.get('*');
    wildcard?.forEach((handler) => handler(event));

    const specific = this.handlers.get(event.category);
    specific?.forEach((handler) => handler(event));
  }
}

export const globalDomainEventBus = new DomainEventBus();
