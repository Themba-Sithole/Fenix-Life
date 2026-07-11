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

  it('parses full character creation seed with appearance fields', () => {
    const parsed = parseWorldSeed(
      'wealthy:professional:US:US:us-washington-d-c:USD:female:1992-06-15:medium:long',
    );

    expect(parsed.background).toBe('wealthy');
    expect(parsed.avatar).toBe('professional');
    expect(parsed.gender).toBe('female');
    expect(parsed.birthday).toBe('1992-06-15');
    expect(parsed.skinTone).toBe('medium');
    expect(parsed.hairstyle).toBe('long');
  });
});
