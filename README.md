# Loopi

**Loopi** is a game loop library. It's currently being tested so please don't use it for the time being.

## Installation

```sh
npm install loopi
```

## Usage

Don't use it.

## API documentation & details

### 'Events'

The term 'event', as used in Loopi, is a catch-all term for occurrences that happen with every `n` amount of ticks, or 'checks' for something with every `n` amount of ticks. Some examples of checks in games include:

- If an object collides with another object, make the first object move (bounce) in a different direction,

- If a bad guy is within 20 pixels of the good guy and the bad guy hasn't roared yet, make it roar,

- While a boolean variable in your project named `debugMode` is set to `true`, display constantly-updating information about the game (for example, a debug screen).

As you can tell, Loopi events bear no relation to regular [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events).

Adding an event to the game loop is achievable with the `addEvent` method. It takes an object literal with three properties:

- `condition`

Type: `() => boolean`

A function which returns a condition, i.e. anything which evaluates to a boolean value.

```ts
const loop = loopi();

loop.addEvent({
  // For every 5 ticks of active (unpaused) game time...
  condition: () => loop.stats.ticksUnpaused % 5 === 0,
```

- `action`

Type: `() => void`

A function which runs the code inside it every time the `condition` function returns `true`.

```ts
  // ...make the main character self-combust.
  action: () => goodGuy.explodeIntoFlames(),
```

- `runWhile`

Type: `boolean`

A simple and optional boolean which decides how the game loop should treat the event. If set to `true`, this event is treated like a (do-)while loop: "while _condition_, do _action_". `false` by default, so the action only runs _once_ when the condition is met.

```ts
  // Once is enough.
  runWhile: false
  });
```

### Options

TODO

### Loopi instance stats

TODO

## License

MIT
