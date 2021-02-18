/**
 * @jest-environment node
 */
import loopi from '../src/index';

describe('loopi (node environment)', () => {
  test('exits with error if window object not recognised', () => {
    expect(() => {
      loopi();
    }).toThrow();
  });
});
