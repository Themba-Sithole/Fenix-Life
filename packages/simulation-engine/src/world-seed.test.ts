import { describe, expect, it } from 'vitest';
import { parseWorldSeed } from '@fenix/domain';

describe('parseWorldSeed', () => {
  it('parses legacy seed with shared nationality and residence', () => {
    const parsed = parseWorldSeed('middle-class:professional:ZA:za-johannesburg:ZAR');

    expect(parsed.origin.nationalityCode).toBe('ZA');
    expect(parsed.origin.countryCode).toBe('ZA');
    expect(parsed.origin.cityId).toBe('za-johannesburg');
    expect(parsed.origin.currency).toBe('ZAR');
  });

  it('parses seed with separate nationality and residence', () => {
    const parsed = parseWorldSeed('immigrant:professional:NG:ZA:za-cape-town:ZAR');

    expect(parsed.origin.nationalityCode).toBe('NG');
    expect(parsed.origin.countryCode).toBe('ZA');
    expect(parsed.origin.cityId).toBe('za-cape-town');
    expect(parsed.origin.currency).toBe('ZAR');
  });
});
