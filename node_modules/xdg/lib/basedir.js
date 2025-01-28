var join = require("path").join;
var env = process.env;

defineDirectory("config", "XDG_CONFIG_HOME", ".config");
defineDirectory("data", "XDG_DATA_HOME", ".local/share");
defineDirectory("cache", "XDG_CACHE_HOME", ".cache");

function defineDirectory(name, key, relativeToHome) {
    function findHome() {
        if (env[key]) {
            return env[key];
        } else {
            return join(env.HOME, relativeToHome);
        }
    };
    exports[name + "Home"] = findHome;
    
    exports[name + "Path"] = function(path) {
        var home = findHome();
        return join(home, path);
    };
}
