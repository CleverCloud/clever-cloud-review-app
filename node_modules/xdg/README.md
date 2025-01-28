# node-xdg

Generate paths based on the [XDG Base Directory specification](http://standards.freedesktop.org/basedir-spec/basedir-spec-latest.html‎).

# Installation

    npm install xdg
    
# Usage

Assuming that `$HOME` is `/home/bob`,
and no specific data directories are set:

```javascript
var basedir = require("xdg").basedir;

var configHome = basedir.configHome(); // == /home/bob/.config
var configPath = basedir.configPath("film-catalog/config"); // == /home/bob/.config/film-catalog/config

var dataHome = basedir.dataHome(); // == /home/bob/.local/share
var dataPath = basedir.dataPath("film-catalog/films"); // == /home/bob/.local/share/film-catalog/films

var cacheHome = basedir.cacheHome(); // == /home/bob/.cache
var cachePath = basedir.cachePath("film-catalog/thumbnails"); // == /home/bob/.cache/film-catalog/thumbnails
```
