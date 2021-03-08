/**
 * An _event_ in Loopi is an occurrence that is triggered in regular intervals
 * by the game loop. This is represented by an object which has three
 * properties: `condition`, `action` and `runWhile`.
 */
type LoopiEvent = {
  /**
   * A function which returns a condition, i.e. anything which evaluates to a
   * boolean value.
   * @example
   *
   * ```ts
   * const loop = loopi();
   *
   * loop.addEvent({
   *   // For every 5 ticks of active (unpaused) game time...
   *   condition: () => loop.stats.ticksExclPaused % 5 === 0,
   * ```
   */
  condition: () => boolean;

  /**
   * A function which runs the code inside it every time the `condition`
   * function returns `true`.
   * @example
   *
   * ```ts
   *   // ...make the main character self-combust.
   *   action: () => goodGuy.explodeIntoFlames(),
   * ```
   */
  action: () => void;

  /**
   * A simple and optional boolean which decides how the game loop should treat
   * the event. If set to `true`, this event is treated like a (do-)while loop:
   * "while _condition_, do _action_". `false` by default, so the action only
   * runs _once_ when the condition is met.
   * @example
   *
   *   // Once is enough.
   *   runWhile: false
   * });
   */
  runWhile?: boolean;

  _isActive: boolean;
};

/**
 * These are the options which are passed to the constructor.
 */
type LoopiOptions = {
  /**
   * The `n` number used in `Math.floor(Math.random() * n)` to define the top
   * range of random numbers generated in every tick of the game loop.
   * @default 101
   *
   * @example
   * ```ts
   * import loopi from "loopi";
   *
   * // A random number (from 0 to 50) will be generated with every tick
   * const loop = loopi({ randomNumberCeiling: 51 });
   * ```
   */
  randomNumberCeiling: number;

  /**
   * The number of _ticks_ that occur for every second of real-world time.
   * @default 1
   *
   * @example
   * ```ts
   * import loopi from "loopi";
   *
   * // This allows you to check for events every 1/5 (fifth) of a second
   * const loop = loopi({ ticksPerSecond: 5 });
   * ```
   */
  ticksPerSecond: number;
};

class LoopiClass {
  private _options: LoopiOptions;
  private _requestAnimationFrameId: number;
  private _paused: boolean;
  private _randNum: number;

  private _lastTime: number;
  private _ticks: number;
  private _ticksPerSecond: number;
  private _events: LoopiEvent[];

  private _unpausedTimestamp: number;
  private _unpausedLastTime: number;
  private _unpausedDeltaTime: number;
  private _unpausedTicks: number;

  constructor(options?: Partial<LoopiOptions>) {
    try {
      window;
    } catch {
      throw new Error(
        `Note from Loopi:\n\nThis library is intended for use in a web browser (front-end) environment.\n\nIf you want to keep a Node script running continuously, use a process management tool like \'pm2\' or \'forever\'.`
      );
    }

    this._options = Object.assign(
      { randomNumberCeiling: 101, ticksPerSecond: 1 },
      options
    );
    this._paused = false;
    this._randNum = Math.floor(
      Math.random() * this._options.randomNumberCeiling
    );

    this._lastTime = 0;
    this._ticks = 0;
    this._ticksPerSecond = this._options.ticksPerSecond;
    this._events = [];

    this._unpausedTimestamp = 0;
    this._unpausedLastTime = 0;
    this._unpausedDeltaTime = 0;
    this._unpausedTicks = 0;

    this._requestAnimationFrameId = window.requestAnimationFrame(
      this._update.bind(this)
    );
  }

  private _update(timestamp: number): void {
    let deltaTime: number;

    if (this._lastTime > 0) {
      deltaTime = timestamp - this._lastTime;
      this._ticks += (this._ticksPerSecond * deltaTime) / 1000;

      this._unpausedTimestamp = this._paused
        ? this._unpausedTimestamp
        : timestamp;
      this._unpausedLastTime = this._paused
        ? this._unpausedLastTime
        : this._lastTime;
      this._unpausedDeltaTime = this._paused
        ? this._unpausedTimestamp - this._unpausedLastTime
        : deltaTime;
      this._unpausedTicks = this._paused
        ? this._unpausedTicks
        : this._unpausedTicks +
          (this._ticksPerSecond * this._unpausedDeltaTime) / 1000;
    }

    this._lastTime = timestamp;

    for (const event of this._events) {
      if (event.condition() && !this._paused) {
        if (event._isActive && !event.runWhile) {
          break;
        }
        event.action();
        event._isActive = true;
      } else {
        event._isActive = false;
      }
    }

    this._randNum = Math.floor(
      Math.random() * this._options.randomNumberCeiling
    );

    this._requestAnimationFrameId = window.requestAnimationFrame(
      this._update.bind(this)
    );
  }

  /**
   * TODO: write documentation
   */
  get randNum() {
    return this._randNum;
  }

  /**
   * The stats object for this Loopi instance, see the [API documentation](https://github.com/geopic/loopi)
   * for details.
   */
  get stats() {
    return {
      /**
       * TODO: write documentation
       */
      ticks: this._ticks,

      /**
       * TODO: write documentation
       */
      ticksUnpaused: this._unpausedTicks,

      /**
       * TODO: write documentation
       */
      tps: this._ticksPerSecond
    };
  }

  /**
   * Add a new event object to the game loop. Refer to the
   * [API documentation](https://github.com/geopic/loopi) for details.
   */
  addEvent(event: Omit<LoopiEvent, '_isActive'>): void {
    if (event.runWhile === undefined) {
      event.runWhile = false;
    }

    this._events.push({ ...event, _isActive: false });
  }

  /**
   * Retrieve the object representation of a particular event from the
   * (zero-indexed) collection of Loopi events.
   */
  getEvent(index: number): Omit<LoopiEvent, '_isActive'> {
    return this._events[index];
  }

  /**
   * Retrieve all Loopi events in standard array form.
   */
  getEventAll(): Omit<LoopiEvent, '_isActive'>[] {
    return this._events;
  }

  /**
   * Remove a particular event at a specific index from the (zero-indexed)
   * collection of Loopi events. It is advisable to retrieve the array of
   * events with `getEventAll` first to check which event belongs at which
   * position.
   * @param index The position of the event to remove.
   */
  removeEvent(index: number): void {
    this._events.splice(index, 1);
  }

  /**
   * Remove all events from the loop.
   */
  removeEventAll(): void {
    this._events = [];
  }

  /**
   * Set the game to a paused state.
   */
  pauseGame(): void {
    this._paused = true;
  }

  /**
   * Set the game to a resumed (unpaused) state.
   */
  resumeGame(): void {
    this._paused = false;
  }

  /**
   * Change the rate of ticks that pass in every real-world second.
   * @param newTicksPerSecond The new rate of ticks per second.
   */
  changeTps(newTicksPerSecond: number) {
    this._options.ticksPerSecond = newTicksPerSecond;
  }

  /**
   * Terminate the game loop.
   *
   * **WARNING:** This ends the game loop _permanently_, so you won't be able to
   * use the same instance of `loopi` again. To simply _pause_ the game
   * (which is what you want in most cases, since it won't kill its loop
   * _completely_), please use the `pauseGame` method.
   */
  endLoop(): void {
    window.cancelAnimationFrame(this._requestAnimationFrameId);
  }
}

/**
 * Initialise an active game loop with an API to add 'events' (occurrences or
 * 'checks' per game tick).
 * @param [options] Options to pass. See the [API documentation](https://github.com/geopic/loopi) for details.
 */
export default function loopi(options: Partial<LoopiOptions> = {}): LoopiClass {
  return new LoopiClass(options);
}
