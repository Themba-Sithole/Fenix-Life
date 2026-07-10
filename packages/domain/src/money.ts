/** Immutable monetary value in world base currency (Doc 04, Doc 11). */
export class Money {
  readonly amountCents: bigint;
  readonly currency: string;

  private constructor(amountCents: bigint, currency: string) {
    this.amountCents = amountCents;
    this.currency = currency;
  }

  static fromCents(amountCents: bigint, currency = 'USD'): Money {
    return new Money(amountCents, currency);
  }

  static zero(currency = 'USD'): Money {
    return new Money(0n, currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountCents + other.amountCents, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountCents - other.amountCents, this.currency);
  }

  toJSON(): { amountCents: string; currency: string } {
    return { amountCents: this.amountCents.toString(), currency: this.currency };
  }

  static fromJSON(data: { amountCents: string; currency: string }): Money {
    return new Money(BigInt(data.amountCents), data.currency);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }
}
