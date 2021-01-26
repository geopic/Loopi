import Loopi from '../src/index';

describe('loopi', () => {
  test('calls requestAnimationFrame at least once', () => {
    const spy = jest.spyOn(window, 'requestAnimationFrame');

    // @ts-ignore (unused variable)
    const loopi = new Loopi();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('events', () => {
    test('can add events', () => {
      const loopi = new Loopi();
      loopi.events.add({
        condition: () => true,
        action: () => console.log('hi'),
        runWhile: false
      });
      expect(loopi.events.getAll().length).toBe(1);
    });

    test('can delete events', () => {
      const loopi = new Loopi();
      expect(() => loopi.events.remove(0)).not.toThrow();
      expect(() => loopi.events.remove(4)).not.toThrow();

      loopi.events.add({
        condition: () => true,
        action: () => console.log('hi'),
        runWhile: false
      });

      expect(() => loopi.events.remove(4)).not.toThrow();
      expect(loopi.events.getAll().length).toBe(1);

      loopi.events.remove(0);
      expect(loopi.events.getAll().length).toBe(0);
    });
  });

  describe('stats', () => {
    test('retrieves the stats object', () => {
      expect(new Loopi().stats).toBeDefined();
    });
  });

  test.skip('increments the tick value', () => {
    window.requestAnimationFrame = (callback: Function) => {
      callback();
      return Date.now();
    };

    const loopi = new Loopi();

    expect(loopi.stats.ticks).toBeGreaterThan(0);
  });
});
