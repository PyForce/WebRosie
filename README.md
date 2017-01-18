# WebRosie

Front-end for the [rosie](https://github.com/PyForce/rosie) web module

## Running tests

To run the tests, use the following command. It runs the Mocha
test-suite for the JavaScript app.

```
npm run test
```

You can also run the JavaScript tests in watch mode by passing an additional
flag into the npm `run-script` command.

```
npm run test -- -w
```

This enables that TDD sweetness, allowing you to focus on feeding the
red-to-green beast.

## Building individual pieces

There are also some npm scripts to make working with the JavaScript app nicer.
These include compiling the app:

```
npm run compile
```

setting up watch-servers to re-compile the JS/CSS when you save changes:

```
npm run watch
```

building the production version of the app:

```
npm run prod
```

Under the hood, these are just aliases for gulp tasks, so pop open `gulpfile.js`
if you want to see what's going on.
