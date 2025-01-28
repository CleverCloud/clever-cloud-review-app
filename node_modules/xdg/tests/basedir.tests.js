var basedir = require("../").basedir;

exports["config home is $HOME/.config if $XDG_CONFIG_HOME is not set"] =
    testWithEnv({
        "HOME": "/home/bob"
    }, function(test) {
        test.equal("/home/bob/.config", basedir.configHome());
    });

exports["config home is $XDG_CONFIG_HOME if set"] =
    testWithEnv({
        "HOME": "/home/bob",
        "XDG_CONFIG_HOME": "/elsewhere"
    }, function(test) {
        test.equal("/elsewhere", basedir.configHome());
    });

exports["config path joins config home with relative path"] =
    testWithEnv({
        "HOME": "/home/bob",
    }, function(test) {
        test.equal("/home/bob/.config/app/config", basedir.configPath("app/config"));
    });

exports["config home is $HOME/.local/share if $XDG_DATA_HOME is not set"] =
    testWithEnv({
        "HOME": "/home/bob"
    }, function(test) {
        test.equal("/home/bob/.local/share", basedir.dataHome());
    });

exports["data home is $XDG_DATA_HOME if set"] =
    testWithEnv({
        "HOME": "/home/bob",
        "XDG_DATA_HOME": "/elsewhere"
    }, function(test) {
        test.equal("/elsewhere", basedir.dataHome());
    });

exports["cache home is $HOME/.cache if $XDG_CACHE_HOME is not set"] =
    testWithEnv({
        "HOME": "/home/bob"
    }, function(test) {
        test.equal("/home/bob/.cache", basedir.cacheHome());
    });

exports["cache home is $XDG_CACHE_HOME if set"] =
    testWithEnv({
        "HOME": "/home/bob",
        "XDG_CACHE_HOME": "/elsewhere"
    }, function(test) {
        test.equal("/elsewhere", basedir.cacheHome());
    });

function testWithEnv(env, func) {
    return function(test) {
        var oldEnv = {};
        for (key in env) {
            oldEnv[key] = process.env[key];
            process.env[key] = env[key];
        }
        func(test);
        for (key in env) {
            if (oldEnv[key] === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = oldEnv[key];
            }
        }
        test.done();
    }
}
