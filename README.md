# WebRosie

Front-end for the [rosie](https://github.com/PyForce/rosie) module.

This application represents the visual interaction with the [rosie](https://github.com/PyForce/rosie) module. It provides a way of controlling multiple rosie running robots in a user friendly way.

## Features

- Simple user interface

    The user interface is designed to be simple, full featured and easily extensible, it uses [React](https://react.dev), [MUI](https://mui.com) and [Redux Toolkit](https://redux-toolkit.js.org) to achieve this functionality.

    <img src="./capture.png" width="100%"/>

- Touch support

    The page uses [nipplejs](https://github.com/yoannmoinet/nipplejs.git) to provide user control over the robot in touch devices.

    <img src="./capture_mobile.png" width="80%"/>

## Build

With Node 24 LTS:

```
$ npm ci
$ npm run build
```

The static files land in `dist/`, ready to be served by any web server (rosie serves them next to its API).
Robots are added by hand: menu → Add robot, with the host and port of their rosie.

While working on it, `npm run dev` serves the app with live reload.

## Checks

```
$ npm run lint    # ESLint
$ npm test        # Vitest
```
