import loopi from '../src/index';

describe('loopi', () => {
  test('calls requestAnimationFrame at least once', () => {
    const spy = jest.spyOn(window, 'requestAnimationFrame');
    loopi();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('events', () => {
    test('can add events', () => {
      const loop = loopi();
      loop.addEvent({
        condition: () => true,
        action: () => console.log('hi'),
        runWhile: false
      });
      expect(loop.getEventAll().length).toBe(1);
    });

    test('can delete events', () => {
      const loop = loopi();
      expect(() => loop.removeEvent(0)).not.toThrow();
      expect(() => loop.removeEvent(4)).not.toThrow();

      loop.addEvent({
        condition: () => true,
        action: () => console.log('hi'),
        runWhile: false
      });

      expect(() => loop.removeEvent(4)).not.toThrow();

      expect(loop.getEventAll().length).toBe(1);

      loop.removeEvent(0);
      expect(loop.getEventAll().length).toBe(0);
    });
  });

  describe('randNum', () => {
    test('retrieves a random number between 0 and 100 by default', () => {
      const n = loopi().randNum;
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(100);
    });
  });

  describe('stats', () => {
    test('retrieves the stats object', () => {
      expect(loopi().stats).toBeDefined();
    });
  });
});
