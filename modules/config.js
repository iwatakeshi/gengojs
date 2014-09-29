/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*
 * config
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
    'use strict';

    var config,
        _ = require('underscore'),
        utils = require('./utils.js'),
        localemap = require('../maps/locales.js'),
        hasModule = (typeof module !== 'undefined' && module.exports),
        defaults = {
            global: {
                //set gengo global variable
                gengo: "__",
            },
            //set path to locale
            directory: require('app-root-path') + '/locales/',
            //set to false; for debugging purposes
            debug: false,
            //set supported localemap
            supported: ['en-US'],
            //set default locale, which would be the locale used for your template of choice
            default: 'en-US',
            //set view aware
            router: false,
            cookiename: 'locale',
            keywords: {
                default: 'default',
                translated: 'translated',
                universe: 'gengo',
                plural: 'plural'
            }
        };

    config = function(config) {
        var extended = utils.Object(config).extend(defaults);
        return {
            global: function() {
                return {
                    gengo: function() {
                        return extended.global.gengo;
                    },
                    moment: function() {
                        return extended.global.moment;
                    },
                    numeral: function() {
                        return extended.global.numeral;
                    }
                };
            },
            directory: function() {
                return extended.directory;
            },
            debug: function() {
                return extended.debug;
            },
            supported: function() {
                var supported = [];
                _.each(extended.supported, function(item) {
                    supported.push(localemap.gengo[item]);
                });
                return supported;
            },
            default: function() {
                return localemap.gengo[extended.default];
            },
            cookie: function() {
                return extended.cookiename;
            },
            router: function() {
                return extended.router;
            },
            keywords: function() {
                return extended.keywords;
            }
        };
    };

    /************************************
        Exposing config
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = config;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `config` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.config = config;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return config;
        });
    }
}).call(this);
