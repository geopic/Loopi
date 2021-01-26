/**
 * @jest-environment node
 */
import Loopi from '../src/index';

describe('loopi (node environment)', () => {
  test('exits with error if window object not recognised', () => {
    expect(() => {
      const loopi = new Loopi();
      loopi;
    }).toThrow();
  });
});
