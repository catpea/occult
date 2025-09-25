# Occult

**Painfully Powerful Reactive Arrays and Objects**

[![npm version](https://img.shields.io/npm/v/occult.svg)](https://www.npmjs.com/package/occult)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Transform your data into living, breathing entities that announce their changes. Welcome to reactive programming made simple.

## Installation

```bash
npm install occult
```

## The Dream of Reactive Data

Imagine if your arrays and objects could talk. Not with words, but with notifications. Every time something changes, they whisper to anyone who's listening. This isn't magic—it's reactive programming, and it's about to change how you think about data forever.

```javascript
import { Arr, Obj } from 'occult';

// Create a living array that speaks when it changes
const fruits = new Arr(['apple', 'banana']);

// Listen to its whispers
fruits.subscribe(arr => {
  console.log('Fruits changed:', [...arr]);
});

// Make a change and watch the magic
fruits.push('orange');
// Output: Fruits changed: ['apple', 'banana', 'orange']
```

## Why Occult Exists

Traditional programming is like being blindfolded in a room full of furniture. You know things are there, but you have to constantly check where everything is. Did the array change? Better check. Did someone update that user object? Better check again.

Reactive programming turns on the lights. Your data tells you when it changes. You don't check—you listen.

## Your First Reactive Array

Let's start with something simple: a list of colors that knows when it changes.

```javascript
import { Arr } from 'occult';

// Create a reactive array of colors
const colors = new Arr(['red', 'blue', 'green']);

// Subscribe to changes
const unsubscribe = colors.subscribe(arr => {
  console.log(`🎨 Colors updated: ${arr.join(', ')}`);
});

// Every operation triggers a notification
colors.push('yellow');        // 🎨 Colors updated: red, blue, green, yellow
colors[0] = 'crimson';       // 🎨 Colors updated: crimson, blue, green, yellow
colors.pop();                // 🎨 Colors updated: crimson, blue, green
colors.sort();               // 🎨 Colors updated: blue, crimson, green

// When you're done listening
unsubscribe();
```

## Your First Reactive Object

Objects can be reactive too. Imagine a user profile that automatically updates the UI whenever it changes.

```javascript
import { Obj } from 'occult';

// Create a reactive user object
const user = new Obj({
  name: 'Alice',
  age: 25,
  city: 'Wonderland'
});

// Listen for any changes
user.subscribe(obj => {
  console.log(`👤 User updated: ${obj.name}, ${obj.age} years old, from ${obj.city}`);
});

// Every property change is announced
user.age = 26;                    // 👤 User updated: Alice, 26 years old, from Wonderland
user.city = 'Looking Glass City'; // 👤 User updated: Alice, 26 years old, from Looking Glass City
```

## The Power of Composition

Here's where things get beautiful. You can combine reactive arrays and objects to build complex, self-aware data structures.

```javascript
import { Arr, Obj } from 'occult';

// Create a reactive shopping cart
const cart = new Arr([
  new Obj({ item: 'Coffee', price: 5, quantity: 2 }),
  new Obj({ item: 'Donut', price: 3, quantity: 1 })
]);

// Calculate total whenever cart changes
cart.subscribe(items => {
  const total = items.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0
  );
  console.log(`🛒 Cart total: $${total}`);
});

// Add a new item
cart.push(new Obj({ item: 'Sandwich', price: 8, quantity: 1 }));
// Output: 🛒 Cart total: $21

// Update quantity of first item
cart[0].quantity = 3;
// Output: 🛒 Cart total: $26
```

## Building a Live Train Schedule

Let's create something more ambitious—a train schedule that updates in real-time.

```javascript
import { Arr, Obj } from 'occult';

// Create a reactive train schedule
const schedule = new Arr([
  new Obj({
    train: 'Express 101',
    departure: '09:00',
    platform: 3,
    status: 'On Time'
  }),
  new Obj({
    train: 'Local 202',
    departure: '09:30',
    platform: 1,
    status: 'On Time'
  })
]);

// Create a display that updates automatically
schedule.subscribe(trains => {
  console.clear();
  console.log('🚂 LIVE TRAIN SCHEDULE 🚂');
  console.log('─'.repeat(40));

  trains.forEach(train => {
    const statusEmoji = train.status === 'On Time' ? '✅' : '⚠️';
    console.log(`${train.departure} | Platform ${train.platform} | ${train.train}`);
    console.log(`Status: ${statusEmoji} ${train.status}`);
    console.log('─'.repeat(40));
  });
});

// Simulate real-time updates
setTimeout(() => {
  schedule[0].status = 'Delayed 5 min';
  schedule[0].departure = '09:05';
}, 2000);

setTimeout(() => {
  schedule.push(new Obj({
    train: 'Express 303',
    departure: '10:00',
    platform: 2,
    status: 'On Time'
  }));
}, 4000);
```

## Creating a Reactive Drawing Canvas

Here's a beautiful example—a shape collection that could drive a drawing application.

```javascript
import { Arr, Obj } from 'occult';

// Create a reactive canvas with shapes
const canvas = new Arr([
  new Obj({
    type: 'circle',
    x: 100,
    y: 100,
    radius: 50,
    color: '#ff0000'
  }),
  new Obj({
    type: 'rectangle',
    x: 200,
    y: 150,
    width: 100,
    height: 60,
    color: '#00ff00'
  })
]);

// Create a render function that redraws when data changes
canvas.subscribe(shapes => {
  console.log('🎨 Redrawing canvas...');
  shapes.forEach(shape => {
    if (shape.type === 'circle') {
      console.log(`  Drawing ${shape.color} circle at (${shape.x}, ${shape.y})`);
    } else if (shape.type === 'rectangle') {
      console.log(`  Drawing ${shape.color} rectangle at (${shape.x}, ${shape.y})`);
    }
  });
});

// Animate a shape
let frame = 0;
const animate = setInterval(() => {
  canvas[0].x = 100 + Math.sin(frame * 0.1) * 50;
  canvas[0].y = 100 + Math.cos(frame * 0.1) * 50;
  frame++;

  if (frame > 30) clearInterval(animate);
}, 100);
```

## The Philosophy Behind Reactive Programming

Reactive programming isn't just about technical convenience—it's about structuring your thoughts correctly. Instead of thinking "How do I check if data changed?", you think "What should happen when data changes?"

This shift is profound. It's the difference between:
- **Polling vs. Subscribing**
- **Asking vs. Listening**
- **Pulling vs. Pushing**
- **Checking vs. Knowing**

Your program becomes a series of relationships, not procedures. When X changes, Y happens. It's declarative, it's clean, it's beautiful.

## Managing Multiple Subscriptions

As your application grows, you'll manage multiple subscriptions. Here's a pattern for organizing them:

```javascript
import { Arr, Obj } from 'occult';

class GameState {
  constructor() {
    // Reactive game data
    this.players = new Arr([]);
    this.score = new Obj({ team1: 0, team2: 0 });
    this.timer = new Obj({ minutes: 10, seconds: 0 });

    // Store all unsubscribe functions
    this.subscriptions = [];
  }

  start() {
    // Subscribe to all reactive data
    this.subscriptions.push(
      this.players.subscribe(players => {
        console.log(`👥 Players: ${players.length} active`);
      }),

      this.score.subscribe(score => {
        console.log(`⚽ Score: Team 1 [${score.team1}] - Team 2 [${score.team2}]`);
      }),

      this.timer.subscribe(time => {
        console.log(`⏱️ Time: ${time.minutes}:${String(time.seconds).padStart(2, '0')}`);
      })
    );
  }

  stop() {
    // Clean up all subscriptions
    this.subscriptions.forEach(unsub => unsub());
    this.subscriptions = [];
  }
}

// Use the game state
const game = new GameState();
game.start();

// Make changes and watch the updates
game.players.push('Alice', 'Bob', 'Charlie');
game.score.team1 = 1;
game.timer.seconds = 30;

// Clean up when done
game.stop();
```

## Private Properties

Properties starting with underscore are considered private and don't trigger notifications:

```javascript
import { Obj } from 'occult';

const config = new Obj({
  theme: 'dark',
  language: 'en'
});

config.subscribe(obj => {
  console.log('Settings changed!');
});

config.theme = 'light';      // Triggers: Settings changed!
config._internal = 'hidden'; // No notification (private property)
```

## Manual Notifications

Sometimes you need to manually trigger a notification:

```javascript
import { Arr } from 'occult';

const tasks = new Arr([
  { id: 1, title: 'Learn Occult', done: false },
  { id: 2, title: 'Build something amazing', done: false }
]);

tasks.subscribe(() => {
  const completed = tasks.filter(t => t.done).length;
  console.log(`✅ Completed: ${completed}/${tasks.length} tasks`);
});

// Modifying nested objects doesn't auto-trigger
tasks[0].done = true;

// Manually notify subscribers
tasks.notify();
// Output: ✅ Completed: 1/2 tasks
```

## What Makes Occult Special

1. **Zero Learning Curve**: If you know Arrays and Objects, you know Occult
2. **Natural Syntax**: No special methods for getting/setting values
3. **Lightweight**: Minimal overhead, maximum power
4. **Composable**: Mix and match reactive arrays and objects freely
5. **Framework Agnostic**: Works everywhere JavaScript works

## A Message to Young Programmers

If you're just starting your programming journey and you've made it this far, know this: what seems like magic today will be the foundation of what you build tomorrow.

Reactive programming isn't just a pattern—it's a way of thinking that will serve you for your entire career. When data can announce its changes, you stop writing brittle update code and start declaring relationships. Your programs become more like poetry than prose.

Every great programmer started exactly where you are, amazed that an array could tell you when it changed. That amazement? Never lose it. It's what drives us to build beautiful things.

## API Reference

### `Arr`
```javascript
const arr = new Arr([initial, values]);
const unsubscribe = arr.subscribe(callback);
arr.notify(); // Manually trigger notification
// All Array methods work: push, pop, shift, unshift, splice, etc.
```

### `Obj`
```javascript
const obj = new Obj({ initial: 'values' });
const unsubscribe = obj.subscribe(callback);
obj.notify(); // Manually trigger notification
// All Object operations work naturally
```
