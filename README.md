# WebRosie

Front-end for the [rosie](https://github.com/PyForce/rosie) module.

This application represents the visual interaction with the [rosie](https://github.com/PyForce/rosie) module. It provides a way of controlling multiple rosie running robots in a user friendly way.

## Features

- Simple user interface

    The user interface is designed to be simple, full featured and easily extensible, it uses [React](https://facebook.github.io/react/), [Material-UI](http://www.material-ui.com/) and [Redux](https://github.com/reactjs/redux.git) to achieve this funtionality.

    <img src="./capture.png" width="100%"/>

- Touch support

    The page uses [nipplejs](https://github.com/yoannmoinet/nipplejs.git) to provide user control over the robot in touch devices.

    <img src="./capture_mobile.png" width="80%"/>

## Build

```
$ npm run build
```

This runs webpack with the production configuration (`webpack.config.prod.js`) and writes the static files to
`public/`, ready to be served by any web server. Robots are added by hand (menu → Add robot: host and port of
their rosie).

## Running tests

To run the tests, use the following command. It runs the Mocha
test-suite for the JavaScript app.

```
$ npm run test
```

You can also run the JavaScript tests in watch mode by passing an additional
flag into the npm `run-script` command.

```
$ npm run test -- -w
```

This enables that TDD sweetness, allowing you to focus on feeding the
red-to-green beast.


