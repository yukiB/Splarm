# Splarm

Alarm of the Splatoon's stage schedule.

## Setup

```
npm install -g gulp-cli electron-prebuilt
npm install
gulp
```

# Menu bar's Icon

If you want to set original icon in the menu bar,
you set the `IconTemplate.png` file at root dir.

#Build App

If you want to create a desktop app, you can use electron-packager
For example, if you create an app for OSX,

run

```
electron-packager . Splarm --platform=darwin --arch=x64 --icon=./path/to/icon
```