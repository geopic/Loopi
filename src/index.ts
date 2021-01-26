/**
 * An _event_ in Loopi is an occurrence that is triggered in regular intervals
 * by the game loop. This is represented by an object which has three
 * properties: `condition`, `action` and `runWhile`.
 */
type LoopiEvent = {
  /**
   * A function which returns a condition, i.e. anything which evaluates to a
   * boolean value.
   *
   * @example
   * ```ts
   * const loop = new Loopi();
   *
   * loop.addEvent({
   *   // For every 5 ticks of active game time...
   *   condition: () => loop.stats.ticksExclPaused % 5 === 0,
   * ```
   */
  condition: () => boolean;

  /**
   * A function which runs the code inside it every time the `condition`
   * function returns `true`.
   *
   * @example
   * ```ts
   *   // ...make the main character self-combust.
   *   action: () => goodGuy.explodeIntoFlames(),
   * ```
   */
  action: () => void;

  /**
   * A simple boolean which decides how the game loop should treat the event.
   * If set to `true`, this event is treated like a (do-)while loop: "while
   * _condition_, do _action_". `false` by default, so the action only runs
   * _once_ when the condition is met.
   *
   * @example
   *   // Once is enough.
   *   runWhile: false
   * });
   */
  runWhile: boolean;
};

/**
 * These are the options which are passed to the constructor.
 */
type LoopiOptions = Partial<{
  /**
   * Set a custom number of _ticks_ that occur for every second of real-world
   * time.
   * @default 1
   *
   * @example
   * ```ts
   * import Loopi from "loopi";
   *
   * // This allows you to check for events every 1/5 (fifth) of a second
   * const loop = new Loopi({ ticksPerSecond: 5 });
   * ```
   */
  ticksPerSecond: number;
}>;

/**
 * These are the statistics for the loop, useful for checking how many ticks
 * have passed and/or for debugging.
 */
type LoopiStats = {
  /**
   * The amount of ticks that have occurred in the game loop since
   * initialisation. Use `ticksExclPaused` if you want to measure ticks for
   * event conditions, since this number increments whether the game is paused
   * or not.
   */
  ticks: number;

  /**
   * The amount of ticks that have occurred in the game loop while the game has
   * been in an 'unpaused' state. Use this in event conditions when you want
   * something to be checked every _n_ ticks.
   */
  ticksExclPaused: number;

  /**
   * The amount of ticks that occur in every real-world second. If not set when
   * the class was instantiated, then its default is `1`.
   */
  ticksPerSecond: number;
};

interface LoopiEventMethods {
  /**
   * TODO: add documentation
   */
  add: (event: LoopiEvent) => void;

  /**
   * TODO: add documentation
   */
  get: (index: number) => LoopiEvent;

  /**
   * TODO: add documentation
   */
  getAll: () => LoopiEvent[];

  /**
   * TODO: add documentation
   */
  remove: (index: number) => void;

  /**
   * TODO: add documentation
   */
  removeAll: () => void;
}

interface LoopiOptionMethods {
  /**
   * TODO: add documentation
   */
  changeTps: (newTicksPerSecond: number) => void;

  /**
   * TODO: add documentation
   */
  togglePauseState: () => void;
}

export default class Loopi {
  private _options: LoopiOptions;
  private _requestAnimationFrameId: number;
  private _paused: boolean;

  private _lastTime: number;
  private _ticks: number;
  private _ticksPerSecond: number;
  private _events: (LoopiEvent & { _isActive: boolean })[];

  private _unpausedTimestamp: number;
  private _unpausedLastTime: number;
  private _unpausedDeltaTime: number;
  private _unpausedTicks: number;

  /**
   * Initialise an active game loop.
   * @param options Options to pass -- see the
   * [API documentation](https://github.com/geopic/loopi) for details.
   */
  constructor(options: LoopiOptions = { ticksPerSecond: 1 }) {
    try {
      window;
    } catch {
      throw new Error(
        `Note from Loopi:\n\nThis library is intended for use in a web browser (front-end) environment.\n\nIf you want to keep a Node script running continuously, use a process management tool like \'pm2\' or \'forever\'.`
      );
    }

    this._options = options;
    this._paused = false;

    this._lastTime = 0;
    this._ticks = 0;
    this._ticksPerSecond = options?.ticksPerSecond ?? 1;
    this._events = [];

    this._unpausedTimestamp = 0;
    this._unpausedLastTime = 0;
    this._unpausedDeltaTime = 0;
    this._unpausedTicks = 0;

    this._requestAnimationFrameId = window.requestAnimationFrame(
      this._update.bind(this)
    );
  }

  /**
   * TODO: add documentation
   */
  get events(): LoopiEventMethods {
    const self = this;
    return {
      add(e) {
        self._events.push({ ...e, _isActive: false });
      },
      get(i) {
        return self._events[i];
      },
      getAll() {
        return self._events;
      },
      remove(i = 0) {
        self._events.splice(i, 1);
      },
      removeAll() {
        self._events = [];
      }
    };
  }

  /**
   * TODO: add documentation
   */
  get stats(): LoopiStats {
    return {
      ticks: +this._ticks.toFixed(0),
      ticksExclPaused: +this._unpausedTicks.toFixed(0),
      ticksPerSecond: this._ticksPerSecond
    };
  }

  /**
   * TODO: add documentation
   */
  get utils(): LoopiOptionMethods {
    const self = this;
    return {
      changeTps(newTps) {
        self._ticksPerSecond = newTps;
        self._options.ticksPerSecond = newTps;
      },
      togglePauseState() {
        self._paused = !self._paused;
      }
    };
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
      if (event.condition()) {
        if (event._isActive && !event.runWhile) {
          break;
        }
        event.action();
        event._isActive = true;
      } else {
        event._isActive = false;
      }
    }

    this._requestAnimationFrameId = window.requestAnimationFrame(
      this._update.bind(this)
    );
  }

  /**
   * TODO: add documentation
   */
  end() {
    window.cancelAnimationFrame(this._requestAnimationFrameId);
  }
}
