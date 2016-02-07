Opus.Helpers = (function() {

    /**
     * A list of key value pairs for the unique identifiers.
     * Global is provided as the default.
     *
     * @type {{global: number}}
     */
    var idMap = {
        global: 0
    };

    return {

        /**
         * Returns a unique identifier in the global Opus instance.
         * A key can be specified to allow for multiple unique id increments.
         * A prefix can also be specified that will be prepended to the ID.
         * If no key is passed a global ID will be returned.
         *
         * All IDs can be reset with the Opus.Helpers.resetUniqueValues function.
         *
         * @param {string} [key=null] The unique ID 'type' or 'key'.
         * @param {string} [prefix=null] A prefix to be prepended to the unique ID.
         * @returns {string}
         */
        getUniqueId: function(key, prefix) {
            if (!!key) {
                if (!!idMap[key]) {
                    return prefix ? prefix + idMap[key]++ : idMap[key]++ + "";
                }

                idMap[key] = 0;

                return prefix ? prefix + idMap[key]++ : idMap[key]++ + "";
            }

            return prefix ? prefix + idMap.global++ : idMap.global++ + "";
        },

        /**
         * Returns the current increment of the specified unique id.
         * If no key is passed the current increment of the global ID will be returned.
         *
         * @param {string} [key=null]
         * @returns {string}
         */
        checkUniqueIdIncrement: function(key) {
            if (!!key) {
                return idMap[key] + "";
            }

            return idMap.global + "";
        },

        /**
         * Resets all unique identifiers or the specified identifier to zero.
         *
         * @param {string} [key=null] The key of the unique identifier to be reset.
         * @returns {void}
         */
        resetUniqueIdValues: function(key) {
            if (!!key) {
                idMap[key] = 0;
            } else {
                for (var i = 0; i < Object.keys(idMap).length; i++) {
                    idMap[i] = 0;
                }
            }
        },

        /**
         * Converts the given string to title case.
         *
         * To avoid bugs with encoding this is borrowed from David Gouch - To Title Case for JavaScript
         * {@link https://github.com/gouch/to-title-case|GitHub}
         *
         * @param {string} string The string to Title Case.
         * @returns {string}
         */
        toTitleCase: function(string){
            var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

            return string.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
                if (index > 0 && index + match.length !== title.length &&
                    match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                    (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                    title.charAt(index - 1).search(/[^\s-]/) < 0) {
                    return match.toLowerCase();
                }

                if (match.substr(1).search(/[A-Z]|\../) > -1) {
                    return match;
                }

                return match.charAt(0).toUpperCase() + match.substr(1);
            });
        },

        /**
         * Similar to Object.keys() except it gets all keys including prototypes.
         *
         * @param {object} object Object to get keys from.
         * @returns {Array}
         */
        getAllKeys: function(object) {
            if (!this.isObject(object)) {
                return [];
            }

            var keys = [];

            for (var key in object) {
                keys.push(key);
            }

            return keys;
        },

        /**
         * Checks if the given object is of type function.
         *
         * @param {object} object Object to check type of.
         * @returns {boolean}
         */
        isFunction: function(object) {
            var type = typeof object;
            return type === 'function' && !!object;
        },

        /**
         * Checks if the given object is of type function or object.
         *
         * @param {object} object Object to check type of.
         * @returns {boolean}
         */
        isObject: function(object) {
            var type = typeof object;
            return type === 'function' || type === 'object' && !!object;
        },

        /**
         * Checks if the given object is of type object.
         *
         * @param {object} object Object to check type of.
         * @returns {boolean}
         */
        isTrueObject: function(object) {
            var type = typeof object;
            return type === 'object' && !!object;
        },

        /**
         * Checks if an object has a property on itself ie not on the prototype.
         *
         * @param {object} object The object to check the property on.
         * @param {string} property The property that needs checking for existence.
         * @returns {boolean}
         */
        objectHasProperty: function(object, property) {
            return typeof object !== 'undefined' && Object.prototype.hasOwnProperty.call(object, property);
        },

        /**
         * Copies all properties from source to destination.
         * If overrideExistingValues is set to true
         *
         * @param {object} destination Object that properties will be copied to.
         * @param {object} source Object to copy properties from.
         * @param {bool} [overrideExistingValues=false] If existing values should be overridden.
         * @param {bool} [extendOwnPropertiesOnly=false] If only own properties should be extended (not prototype).
         * @returns {object}
         */
        extend: function(destination, source, overrideExistingValues, extendOwnPropertiesOnly) {
            overrideExistingValues  = overrideExistingValues  || false;
            extendOwnPropertiesOnly = extendOwnPropertiesOnly || false;

            var keys = [];

            if (extendOwnPropertiesOnly)
                keys = Object.keys(source);
            else {
                keys = this.getAllKeys(source);
            }

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];

                if (overrideExistingValues) {
                    destination[key] = source[key];
                } else {
                    if (typeof destination[key] === 'undefined') {
                        destination[key] = source[key];
                    }
                }
            }

            return destination;
        },

        /**
         * Easy helper for getting percentages.
         *
         * @param value
         * @param percent
         * @returns {number}
         */
        getPercent: function(value, percent) {
            return (percent / 100) * value;
        },

        //TODO: test original way of calculating screen offsets to remove jQuery dependency
        getScreenOffset: function(screenID) {
            var documentElement = document.documentElement;
            var boundingBox     = document.getElementById(screenID).getBoundingClientRect();
            var top  = boundingBox.top  + window.pageYOffset - documentElement.clientTop;
            var left = boundingBox.left + window.pageXOffset - documentElement.clientLeft;

            return $('#' + screenID).offset();

            //return {
            //    top: top,
            //    left: left
            //};
        },

        /**
         * Restricts a value to be within  a specific range.
         *
         * - If value > max, max will be returned.
         * - If value < min, min will be returned.
         * - If min ≤ value ≥ max, value will be returned.
         *
         * @param val
         * @param min
         * @param max
         * @returns {number}
         */
        clamp: function(val, min, max) {
            return Math.max(min, Math.min(max, val));
        }
    };
})();
