# defer-until

> A utility for deferring method calls

## Installation
Install the package from npm
```
npm install defer-until --save
```

And require the module in your project
```javascript
var defer = require('defer-until');
```

## For the impatient
```javascript
// lets imagine 'socket.send' throws if used before it's ready

var defer = require('defer-until');

// Waiting for a signal to be emitted
defer(socket, 'send').until(socket).emits('ready');
socket.send('Hello'); // deferred until 'ready' is emitted

// Testing a property - positive
defer(socket, 'send').until(socket, 'state').is('ready');
socket.send('Bonjour'); // deferred until socket.state === 'ready'

// Testing a property - negative
defer(socket, 'send').until(socket, 'state').isnt('initialising');
socket.send('Ahoy'); // deferred until socket.state !== 'initialising'

// Testing a return value
defer(socket, 'send').until(socket, 'isReady').returns(true);
socket.send('Caio'); // deferred until socket.isReady() === true


// Extend with your own conditions
defer.extend({
    isInstanceOf: function (actual, value) {
        return actual instanceof value;
    }
});

defer(socket, 'send').until(socket.connection).isInstanceOf(net.Socket);
socket.send('HI'); // deferred until socket.connection.constructor === net.Socket

```
## Important notes:

#### - Condition Fulfillment

Deferred calls will only be invoked when the condition is met. by default the condition is tested when the function is called.

Therefore:

```javascript
var foo = { bar: 1 };

defer(socket, 'send').until(foo, 'bar').is(2);

socket.send('Hello, '); // this gets deferred

foo.bar = 2; // this does not trigger the invocation of the deferred functions

socket.send('World') // but this does

```

For this reason, `is`, `isnt`, `returns` and `satisfies` all support the `poll` option which will instead test the condition every `poll` milliseconds.

```javascript
var foo = { bar: 1 };

defer(socket, 'send').until(foo, 'bar').is(2, { poll: 200 });

socket.send('Hello'); // this gets deferred

foo.bar = 2; // this will trigger the invocation of the deferred functions
```


#### - Return Values

Deferred functions will return an instance of the context (`this`), this provides at least some support for chaining methods.

## API

#### `defer(target, [properties])`

Specify a function or set of functions on an object to defer.

##### Arguments
- `target` - `Function|Any`
- `properties` - a `String` or `Array` of strings specifying which methods of `target` are to be deferred [optional if target is a function]

#### `defer(...).until(target, [property])`

Sepecify a value or property of an object to become the subject of this condition. This value is re-evaluated whenever the condition is tested.

##### Arguments
- `target` - `Any` - the target of the condition
- `property` - `String` a specific property on the target to use in the condition, eg `"foo"` or `"foo.bar"`.

#### `defer(...).until(...).emits(event)`

The target of the condition should be an `EventEmitter` or have the same API. This condition will defer until `event` is emitted.

##### Arguments
- `event` - `String` the name of the event


#### `defer(...).until(...).is(value, [options])`
This condition will defer until the condition property is equal to `value`, by default it will test with `===`

##### Arguments
- value - `Any` the value to test against the condition's property.
- options - `Object` [optional]
  * options.deep - `Boolean` default(`false`) - test for deep equality.
  * options.poll - `Number` default(`undefined`) - condition test interval in milliseconds (see Important notes).

#### `defer(...).until(...).isnt(value, [options])`
The negative version of `.is`, by default it will test with `!==`

##### Arguments
- value - `Any` the value to test against the condition's property.
- options - `Object` [optional]
* options.deep - `Boolean` default(`false`) - test for deep equality.
* options.poll - `Number` default(`undefined`) - condition test interval in milliseconds (see Important notes).

#### `defer(...).until(...).returns(value, [options])`
The target of the condition should be a `Function`, this condition will defer until the target function returns `value`.

##### Arguments
- value - `Any` the value to test against the condition's return value.
- options - `Object` [optional]
  * options.deep - `Boolean` default(`false`) - test for deep equality.
  * options.poll - `Number` default(`undefined`) - condition test interval in milliseconds (see Important notes).


#### `defer.extend(extension)`

extend the api with your own conditions, eg.

```javascript
var defer = require('defer-until');

defer.extend({
    hasProperty: function (actual, value, options) {
        return actual.hasOwnProperty(value);
    }
});
```
the poll option is already handled for you.

### Issues and Improvements
please submit issues and ideas for improvements on the github [issue tracker]() page.

### Contributing
Please try to maintain the code style using jscs.
Lint and test your code using jshint and mocha
