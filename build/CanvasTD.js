(function() {
    /**
     * Create the global namespace for the game engine.
     *
     * @type {object}
     */
    window.Opus = window.Opus || {};

    /**
     * Engine version.
     *
     * @type {string}
     */
    Opus.VERSION = '0.1.0';
})();

(function() {
    if (!window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];

        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame  = window[vendors[i] + 'CancelAnimationFrame'] ||
                                           window[vendors[i] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame && !!window.setTimeout) {
            window.requestAnimationFrame = function(callback) {
                var currentTime = Date.now();
                var timeToCall = Math.max(0, 16 - (currentTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currentTime + timeToCall);
                }, timeToCall);
                lastTime = currentTime - timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame && !!window.clearTimeout) {
            window.cancelAnimationFrame = function(id) {
                window.clearTimeout(id);
            };
        }
    }
})();

(function() {
    if (!window.performance) {
        window.performance = {};
    }

    if (!window.performance.now) {
        var start = Date.now();
        window.performance.now = function() {
            return Date.now() - start;
        };
    }
})();
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

(function() {

    Opus.Timer = (function() {

        /**
         * Keep track of the number of rendered frames.
         *
         * @type {number}
         */
        var frameCount = 0;

        /**
         *  Keep track of the time it took to render frames.
         *
         * @type {number}
         */
        var frameDelta = 0;

        /**
         * Holds the timestamp of the last frame.
         *
         * @type {number}
         */
        var lastFrameTime = 0;

        /**
         * Holds the current frames time stamp.
         *
         * @type {number}
         */
        var currentFrameTime = 0;

        /**
         * Difference in time between last and current frame.
         *
         * @type {number}
         */
        var deltaTime = 0;

        return {
            /**
             * Hold the current FPS.
             *
             * @type {number}
             */
            fps: 0,

            tick: 1,

            /**
             * Initialise the timer and set defaults.
             */
            init: function() {
                this.reset();
                currentFrameTime = lastFrameTime = 0;
            },

            /**
             * Reset the timer to its default state.
             */
            reset: function() {
                lastFrameTime = currentFrameTime = window.performance.now();
                deltaTime  = 0;
                frameCount = 0;
                frameDelta = 0;
            },

            /**
             * Calculate how many frames get rendered per second.
             */
            countFps: function() {
                // Keep track of frames
                frameCount++;

                // Keep track of time took
                frameDelta += deltaTime;

                // Once ten frames have been rendered
                if (frameCount % 10 === 0) {
                    // Number of rendered frames * 1000 / time took
                    this.fps = Math.floor((1000 * frameCount) / frameDelta);

                    // Reset
                    frameDelta = 0;
                    frameCount = 0;
                }
            },

            /**
             * Get the deltaTime rounded to .00
             *
             * @returns {number}
             */
            getDeltaTime: function() {
                return Math.round(deltaTime * 100) / 100;
            },

            /**
             * Get the time elapsed since timer initialisation.
             *
             * @returns {number}
             */
            getTimeElapsed: function() {
                return Math.round(currentFrameTime / 1000 * 100) / 100;
            },

            /**
             * Update the game frame times.
             * This should called once every update.
             *
             * @param time
             * @returns {number}
             */
            update: function(time) {
                // Store the timestamp of the last frame
                lastFrameTime = currentFrameTime;

                // Store the current frames timestamp
                currentFrameTime = time;

                // DeltaTime is the time difference between the current and last frame
                deltaTime = (currentFrameTime - lastFrameTime);

                this.tick =  deltaTime / 1000;

                return deltaTime;
            }

        };

    })();

})();
(function() {

    /**
     *
     * @param {Opus.Game} game
     * @constructor
     */
    Opus.Input = function(game) {
        /**
         * Reference to the game object.
         *
         * @type {Opus.Game}
         */
        this.game = game;

        /**
         * Event listener containers.
         *
         * @type {{click: Array, mousedown: Array, mouseup: Array}}
         */
        this.eventList = {
            click: [],
            mousedown: [],
            mouseup: []
        };

        /**
         * Calculated mouse position relative to the game screen.
         *
         * @type {Opus.Vector2D}
         */
        this.mousePosition = new Opus.Vector2D();


        /**
         * Add various event listeners to the canvas instance.
         * Pass in the data object also so we can access user data inside the event.
         */
        this.game.renderer.canvas.addEventListener('click', (function(event) {
            for (var i = 0; i < this.eventList.click.length; i++) {
                if (!!event.data) {
                    Opus.Helpers.extend(event.data, this.eventList.click[i].data, false, true);
                } else {
                    event.data = this.eventList.click[i].data;
                }

                this.eventList.click[i].closure(event);
            }
        }).bind(this));

        this.game.renderer.canvas.addEventListener('mousedown', (function(event) {
            for (var i = 0; i < this.eventList.mousedown.length; i++) {
                if (!!event.data) {
                    Opus.Helpers.extend(event.data, this.eventList.mousedown[i].data, false, true);
                } else {
                    event.data = this.eventList.mousedown[i].data;
                }

                this.eventList.mousedown[i].closure(event);
            }
        }).bind(this));

        this.game.renderer.canvas.addEventListener('mouseup', (function(event) {
            for (var i = 0; i < this.eventList.mouseup.length; i++) {
                if (!!event.data) {
                    Opus.Helpers.extend(event.data, this.eventList.mouseup[i].data, false, true);
                } else {
                    event.data = this.eventList.mouseup[i].data;
                }

                this.eventList.mouseup[i].closure(event);
            }
        }).bind(this));

        // Mouse position is calculated relative to the screen offset.
        this.game.renderer.canvas.addEventListener('mousemove', (function(event) {
            this.mousePosition.set(
                (event.pageX - Opus.Helpers.getScreenOffset('game-screen').left) * this.game.renderer.scaleRatio.x,
                (event.pageY - Opus.Helpers.getScreenOffset('game-screen').top) * this.game.renderer.scaleRatio.y
            );
        }).bind(this));
    };

    Opus.Helpers.extend(Opus.Input.prototype, {
        /**
         * Add an event =).
         *
         * @param name
         * @param closure
         * @param data
         */
        addEvent: function(name, closure, data) {
            if (!!this.eventList[name]) {
                this.eventList[name].push({closure: closure, data: data});
            } else {
                throw Error("Event not set [" + name + "]");
            }
        }
    }, true);

})();
(function() {

    Opus.Vector2D = function(x, y) {
        this.set(x || 0, y || 0);
    };

    Opus.Helpers.extend(Opus.Vector2D.prototype, {
        set: function(x, y) {
            if (isNaN(x)) {
                throw new Error("Invalid x parameter for vector");
            }
            if (isNaN(y)) {
                throw new Error("Invalid y parameter for vector");
            }

            this.x = x;

            this.y = y;

            return this;
        },

        add: function(vector) {
            return new Opus.Vector2D(this.x + vector.x, this.y + vector.y);
        },

        addTo: function(vector) {
            this.x += vector.x;
            this.y += vector.y;

            return this;
        },

        subtract: function(vector) {
            return new Opus.Vector2D(this.x - vector.x, this.y - vector.y);
        },

        subtractFrom: function(vector) {
            this.x -= vector.x;
            this.y -= vector.y;

            return this;
        },

        multiplyScalar: function(value) {
            return new Opus.Vector2D(this.x * value, this.y * value);
        },

        multiplyByScalar: function(value) {
            this.x *= value;
            this.y *= value;

            return this;
        },

        divideScalar: function(value) {
            return new Opus.Vector2D(this.x / value, this.y / value);
        },

        divideByScalar: function(value) {
            this.x /= value;
            this.y /= value;

            return this;
        },

        setAngle: function(angle) {
            var length = this.getLength();
            this.x = Math.cos(angle) * length;
            this.y = Math.sin(angle) * length;
        },

        getAngle: function() {
            return Math.atan2(this.y, this.x);
        },

        setLength: function(length) {
            var angle = this.getAngle();
            this.x = Math.cos(angle) * length;
            this.y = Math.sin(angle) * length;
        },

        getLength: function() {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        },

        invertX: function() {
            this.x *= -1;

            return this;
        },

        invertY: function() {
            this.y *= -1;

            return this;
        },

        invert: function() {
            this.invertX();
            this.invertY();

            return this;
        }
    }, true);

})();
(function() {

    Opus.Renderer = function(screenWidth, screenHeight, useDoubleBuffering) {
        this.scaleRatio = new Opus.Vector2D();

        this.canvas = this.createCanvas(screenWidth, screenHeight);

        this.wrapper = document.getElementById('game-screen');
        this.wrapper.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');

        this.scaleRatio.set(
            this.canvas.width / this.canvas.offsetWidth,
            this.canvas.height / this.canvas.offsetHeight
        );

        this.doubleBufferingEnabled = useDoubleBuffering || false;
        if (this.doubleBufferingEnabled) {
            this.backBuffer = this.createCanvas(screenWidth, screenHeight);
            this.backBufferContext = this.backBuffer.getContext('2d');
        } else {
            this.backBuffer = this.canvas;
            this.backBufferContext = this.context;
        }

        return this;
    };

    Opus.Helpers.extend(Opus.Renderer.prototype, {

        // http://www.sitepoint.com/modernize-your-html5-canvas-game/
        createCanvas: function(width, height) {
            if (width === 0 || height === 0) {
                throw Error("Width and height need to be greater than zero for canvas creation.");
            }

            var canvas = document.createElement('canvas');
            canvas.width  = width  || this.canvas.width;
            canvas.height = height || this.canvas.height;

            var scaleToFitX = window.innerWidth  / width;
            var scaleToFitY = window.innerHeight / height;

            var currentScreenRation = window.innerWidth / window.innerHeight;
            var optimalRatio        = Math.min(scaleToFitX, scaleToFitY);

            if (currentScreenRation >= 1.77 && currentScreenRation <= 1.79) {
                canvas.style.width  = window.innerWidth  + "px";
                canvas.style.height = window.innerHeight + "px";
            } else {
                canvas.style.width  = width  * optimalRatio + "px";
                canvas.style.height = height * optimalRatio + "px";
            }

            return canvas;
        },

        /**
         * Returns the canvas context.
         *
         * @returns {*|CanvasRenderingContext2D}
         */
        getContext: function() {
            return this.backBufferContext;
        },

        /**
         * Clear the canvas.
         *
         * @param clearColor
         * @returns {Opus.Renderer}
         */
        clearScreen: function(clearColor) {
            this.backBufferContext.save();
            this.backBufferContext.setTransform(1, 0, 0, 1, 0, 0);
            this.backBufferContext.fillStyle = clearColor || 'black';
            this.backBufferContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.backBufferContext.restore();

            return this;
        },

        /**
         * Draw the current front buffer to the canvas.
         *
         * @returns {Opus.Renderer}
         */
        drawFrontBuffer: function() {
            this.context.drawImage(this.backBuffer, 0, 0);

            return this;
        }

    }, true);

})();
(function(){

    Opus.Tower = function(game, type, x, y, width, height) {
        /**
         * Reference to the game object.
         *
         * @type {Opus.Game}
         */
        this.game = game;

        /**
         * Towers upgraded level.
         *
         * @type {number|*}
         */
        this.level = type.level;

        /**
         * Towers targeting range.
         *
         * @type {number|*}
         */
        this.range = type.range;

        /**
         * How many attacks the turret will make per second.
         *
         * @type {number|*}
         */
        this.attacksPerSecond = type.attacksPerSecond;

        /**
         * Damage made by the turret upon attack.
         *
         * @type {number|*}
         */
        this.damage = type.damage;

        /**
         * How much it costs to purchase this tower.
         *
         * @type {number|*}
         */
        this.cost = type.cost;

        /**
         * Towers name.
         *
         * @type {string}
         */
        this.name = type.name;

        /**
         * Color of the tower.
         *
         * @type {string}
         */
        this.color = type.color;

        /**
         * Used to determine what level the tower is available at.
         *
         * @type {number|*}
         */
        this.levelAvailable = type.levelAvailable;

        /**
         * Position of the tower relative to the game screen.
         *
         * @type {Opus.Vector2D}
         */
        this.position = new Opus.Vector2D(x, y);

        /**
         * Towers width.
         *
         * @type {Number}
         */
        this.width = width;

        /**
         * Towers height.
         * {Number}
         */
        this.height = height;

        /**
         * The current targat that the tower is attacking.
         *
         * @type {Opus.Enemy|null}
         */
        this.lockedTarget = null;

        return this;
    };

    Opus.Helpers.extend(Opus.Tower.prototype, {

        /**
         * Delta time for calculating attacks per second.
         *
         * @type {Number}
         */
        lastAttackTime: 0,

        /**
         * Attack the locked target.
         *
         * @param time
         */
        attack: function(time) {
            var attackDelta = 1 / this.attacksPerSecond;
            var timeBetweenAttacks = (time - this.lastAttackTime) / 1000;

            if (timeBetweenAttacks > attackDelta) {

                this.lockedTarget.health -= this.damage;

                this.lastAttackTime = time;
            }
        },

        /**
         * Draw draw draw...
         *
         * @param renderer
         * @returns {Opus.Tower}
         */
        render: function(renderer) {
            renderer.strokeStyle = this.color;
            renderer.lineWidth = 2;

            renderer.strokeRect(this.position.x, this.position.y, this.width, this.height);
            renderer.strokeStyle = "#fff";
            renderer.lineWidth = 1;
            renderer.beginPath();
            renderer.arc(
                this.position.x + (this.game.activeMap.cellSize / 2),
                this.position.y + (this.game.activeMap.cellSize / 2),
                (this.game.activeMap.cellSize * this.range),
                0,
                (2 * Math.PI)
            );
            renderer.stroke();

            renderer.strokeStyle = this.color;
            renderer.lineWidth = 1;
            renderer.beginPath();
            renderer.arc(
                this.position.x + (this.game.activeMap.cellSize / 2),
                this.position.y + (this.game.activeMap.cellSize / 2),
                2,
                0,
                (2 * Math.PI)
            );
            renderer.fillStyle = this.color;
            renderer.fill();
            renderer.stroke();

            renderer.lineWidth = 1;
            renderer.beginPath();
            renderer.moveTo(
                this.position.x + (this.game.activeMap.cellSize / 2),
                this.position.y + (this.game.activeMap.cellSize / 2)
            );
            renderer.lineTo(
                this.position.x,
                this.position.y + this.game.activeMap.cellSize
            );
            renderer.stroke();

            if (!!this.lockedTarget) {
                renderer.strokeStyle = this.color;
                renderer.lineWidth = 0.5;
                renderer.beginPath();
                renderer.moveTo(
                    this.position.x + (this.game.activeMap.cellSize / 2),
                    this.position.y + (this.game.activeMap.cellSize / 2)
                );
                renderer.lineTo(this.lockedTarget.position.x,this.lockedTarget.position.y);
                renderer.stroke();
            }

            return this;
        },

        /**
         * Update the tower. Finds the neareset enemy and attacks if it has a lock.
         *
         * @param time
         * @returns {Opus.Tower}
         */
        update: function(time) {
            this.findNearestEnemyInRange();

            if (!!this.lockedTarget) {
                this.attack(time);
            }

            return this;
        },

        /**
         * Find the nearest enemy that is within the range of the tower.
         *
         * @returns {boolean}
         */
        findNearestEnemyInRange: function() {
            var enemiesInRage  = [];

            for (var i = 0; i < this.game.container.containedEntities.length; i++) {
                var entity = this.game.container.containedEntities[i];
                if (entity instanceof Opus.Enemy) {
                    if (this.enemyIsInRange(entity.position, entity.width, entity.height)) {
                        enemiesInRage.push(entity);
                    }
                }
            }

            for (i = 0; i < enemiesInRage.length; i++){
                this.lockedTarget = this.findNearestEnemy(enemiesInRage);
                return true;
            }

            this.lockedTarget = null;
            return false;
        },

        findNearestEnemy: function(enemies) {
            var enemyDistances = [];
            for (var i = 0; i < enemies.length; i++) {
                enemyDistances[i] = this.calculateDistanceToEnemy(enemies[i]);
            }

            var enemyId = 0;
            for (i = 0; i < enemyDistances.length; i++) {
                if (enemyDistances[i] < enemyDistances[enemyId]) {
                    enemyId = i;
                }
            }

            return enemies[enemyId];
        },

        calculateDistanceToEnemy: function(enemy) {
            var cx = Math.max(Math.min(this.position.x, enemy.position.x + enemy.width),  enemy.position.x);
            var cy = Math.max(Math.min(this.position.y, enemy.position.y + enemy.height), enemy.position.y);
            return Math.sqrt(
                (this.position.x - cx) * (this.position.x - cx) +
                (this.position.y - cy) * (this.position.y - cy)
            );
        },

        /**
         * Check if an enemy is in range of the tower.
         *
         * @param enemyPosition
         * @param enemyWidth
         * @param enemyHeight
         * @returns {boolean}
         */
        enemyIsInRange: function(enemyPosition, enemyWidth, enemyHeight) {
            // Find the closest point to the circle within the rectangle
            // Assumes axis alignment! ie rect must not be rotated
            var closestX = Opus.Helpers.clamp(
                this.position.x + (this.game.activeMap.cellSize / 2),
                enemyPosition.x,
                enemyPosition.x + enemyWidth
            );
            var closestY = Opus.Helpers.clamp(
                this.position.y + (this.game.activeMap.cellSize / 2),
                enemyPosition.y,
                enemyPosition.y + enemyHeight
            );

            // Calculate the distance between the circle's center and this closest point
            var distanceX = (this.position.x + (this.game.activeMap.cellSize / 2)) - closestX;
            var distanceY = (this.position.y + (this.game.activeMap.cellSize / 2)) - closestY;

            // If the distance is less than the circle's radius, an intersection occurs
            var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

            return distanceSquared < ((this.game.activeMap.cellSize * this.range) * (this.game.activeMap.cellSize * this.range));
        }

    }, true);

})();
(function() {
    Opus.UI = function(game, canvasWidth, canvasHeight) {
        this.canvasWidth  = canvasWidth;
        this.canvasHeight = canvasHeight;
        /**
         * Reference to the game object.
         *
         * @type {Opus.Game}
         */
        this.game = game;

        this.topBar = {
            width:  this.canvasWidth - Opus.Helpers.getPercent(this.canvasWidth, 20),
            height: Opus.Helpers.getPercent(this.canvasHeight, 10),
            offset: {
                top:  0,
                left: 0
            }
        };

        this.sideBar = {
            width:  Opus.Helpers.getPercent(this.canvasWidth, 20),
            height: this.canvasHeight,
            offset: {
                top:  0,
                left: this.canvasWidth - Opus.Helpers.getPercent(this.canvasWidth, 20)
            }
        };

        this.mapContainer = {
            width:  this.canvasWidth - this.sideBar.width - 20,
            height: this.canvasHeight - this.topBar.height - 20,
            offset: {
                top:  this.topBar.height + 10,
                left: 10
            }
        };

        this.game.input.addEvent('mousedown', this.mouseDown, {self: this});

        return this;
    };

    Opus.Helpers.extend(Opus.UI.prototype, {
        render: function(renderer) {
            this.drawContainers(renderer);

            renderer.font = "40px Arial";
            renderer.strokeText("Canvas TD",20,50);

            this.drawPlayerInformation(renderer);

            this.drawTowerPanel(renderer);

            this.drawTowers(renderer);

            if (!!this.game.selectedTower) {
                this.game.addTopLevelRenderObject(this.drawSelectedTower.bind(this));
            }

            return this;
        },

        update: function(time) {

            if (!!this.game.selectedTower) {
                this.game.selectedTower.position.set(
                    this.game.input.mousePosition.x,
                    this.game.input.mousePosition.y
                );
            }

            return this;
        },

        drawSelectedTower: function(renderer) {
            var tower = this.game.selectedTower;

            renderer.strokeStyle = tower.color;
            renderer.lineWidth = 2;

            renderer.strokeRect(
                tower.position.x - (this.game.activeMap.cellSize / 2),
                tower.position.y - (this.game.activeMap.cellSize / 2),
                this.game.activeMap.cellSize,
                this.game.activeMap.cellSize
            );

            var towerGridPosition = this.game.activeMap.findGridCell(tower.position.x, tower.position.y);

            if (!!towerGridPosition &&
                this.game.activeMap.getMapElement(towerGridPosition.x, towerGridPosition.y) == "P") {
                renderer.fillStyle = 'red';
                renderer.fillRect(
                    tower.position.x - (this.game.activeMap.cellSize / 2),
                    tower.position.y - (this.game.activeMap.cellSize / 2),
                    this.game.activeMap.cellSize,
                    this.game.activeMap.cellSize
                );
            }

            if (!!towerGridPosition &&
                this.game.activeMap.getMapElement(towerGridPosition.x, towerGridPosition.y) == ".") {
                renderer.fillStyle = 'lightgreen';
                renderer.fillRect(
                    tower.position.x - (this.game.activeMap.cellSize / 2),
                    tower.position.y - (this.game.activeMap.cellSize / 2),
                    this.game.activeMap.cellSize,
                    this.game.activeMap.cellSize
                );
            }

            renderer.strokeStyle = "#fff";
            renderer.lineWidth = 2;
            renderer.beginPath();
            renderer.arc(
                tower.position.x,
                tower.position.y,
                (this.game.activeMap.cellSize * tower.range),
                0,
                (2 * Math.PI)
            );
            renderer.stroke();

            return this;
        },

        mouseDown: function(event) {
            if (!!event.data.self.game.selectedTower) {
                var towerGridPosition = event.data.self.game.activeMap.findGridCell(
                    event.data.self.game.selectedTower.position.x,
                    event.data.self.game.selectedTower.position.y
                );

                if (!!towerGridPosition &&
                    event.data.self.game.activeMap.getMapElement(towerGridPosition.x, towerGridPosition.y) == ".") {

                    event.data.self.game.container.addEntity(new Opus.Tower(
                        event.data.self.game,
                        Opus.Helpers.extend({}, event.data.self.game.selectedTower, true),
                        (towerGridPosition.x * event.data.self.game.activeMap.cellSize) + event.data.self.mapContainer.offset.left,
                        (towerGridPosition.y * event.data.self.game.activeMap.cellSize) + event.data.self.mapContainer.offset.top,
                        event.data.self.game.activeMap.cellSize,
                        event.data.self.game.activeMap.cellSize
                    ));

                    delete event.data.self.game.selectedTower;

                    return true;
                }

                delete event.data.self.game.selectedTower;

                return true;
            }

            for (var i = 0; i < event.data.self.game.towers.length; i++) {
                var tower = event.data.self.game.towers[i];

                if (event.data.self.game.input.mousePosition.x >= tower.position.x &&
                    event.data.self.game.input.mousePosition.x <= tower.position.x + tower.width &&
                    event.data.self.game.input.mousePosition.y >= tower.position.y &&
                    event.data.self.game.input.mousePosition.y <= tower.position.y + tower.height) {

                    /**
                     * TODO: Create a way of deep copying custom objects ie
                     * http://stackoverflow.com/questions/16512773/jquery-extendtrue-obj-not-creating-a-deep-copy
                     * as position is not a plain object.
                     */
                    event.data.self.game.selectedTower = Opus.Helpers.extend({}, tower, true);
                    event.data.self.game.selectedTower.position = Opus.Helpers.extend({}, tower.position, true);
                    return true;
                }
            }
        },

        drawTowers: function(renderer) {
            for (var i = 0; i < this.game.towers.length; i++) {
                var tower = this.game.towers[i];

                if (!tower.position) {
                    tower.position = new Opus.Vector2D(
                        this.sideBar.offset.left + 25 + i * this.game.activeMap.cellSize,
                        this.topBar.height + 20 + this.game.activeMap.cellSize
                    );
                }

                if (!tower.width) {
                    tower.width = this.game.activeMap.cellSize;
                }

                if (!tower.height) {
                    tower.height = this.game.activeMap.cellSize;
                }

                renderer.strokeStyle = tower.color;
                renderer.lineWidth = 2;

                // Draw static towers so they don't get updated off the tower position
                renderer.strokeRect(
                    this.sideBar.offset.left + 25 + i * this.game.activeMap.cellSize,
                    this.topBar.height + 20 + this.game.activeMap.cellSize,
                    this.game.activeMap.cellSize,
                    this.game.activeMap.cellSize
                );
            }
        },

        drawTowerPanel: function(renderer) {
            renderer.strokeStyle = '#79d0e7';
            renderer.lineWidth = 1;

            renderer.strokeRect(
                this.sideBar.offset.left + 10,
                this.topBar.height,
                this.sideBar.width - 10,
                300
            );

            renderer.strokeRect(
                this.sideBar.offset.left + 20,
                this.topBar.height + 10,
                this.sideBar.width - 30,
                30
            );

            renderer.fillStyle = '#ffffff';
            renderer.font = "16px Verdana";
            renderer.fillText("Towers", this.sideBar.offset.left + 30, this.topBar.height + 30);

            renderer.strokeRect(
                this.sideBar.offset.left + 10,
                this.topBar.height + 310,
                this.sideBar.width - 10,
                300
            );
        },

        drawPlayerInformation: function(renderer) {
            renderer.strokeStyle = '#79d0e7';
            renderer.lineWidth = 1;

            renderer.strokeRect(
                this.sideBar.offset.left - 300,
                5,
                300,
                this.topBar.height - 10
            );

            renderer.beginPath();
            renderer.moveTo(this.sideBar.offset.left - 150, 5);
            renderer.lineTo(this.sideBar.offset.left - 150, this.topBar.height - 5);
            renderer.stroke();

            renderer.beginPath();
            renderer.moveTo(this.sideBar.offset.left - 300, (this.topBar.height) / 2);
            renderer.lineTo(this.sideBar.offset.left, (this.topBar.height) / 2);
            renderer.stroke();

            renderer.fillStyle = '#ffffff';
            renderer.font = "16px Verdana";
            renderer.fillText("Bank", this.sideBar.offset.left - 300 + 5, 25);
            renderer.fillText("£" + this.game.player.money, this.sideBar.offset.left - 300 + 95, 25);
            renderer.fillText("Score", this.sideBar.offset.left - 300 + 5, 50);
            renderer.fillText(this.game.player.score, this.sideBar.offset.left - 300 + 95, 50);
            renderer.fillText("Lives", this.sideBar.offset.left - 300 + 155, 25);
            renderer.fillText(this.game.player.lives + "/" + this.game.player.maxLives, this.sideBar.offset.left - 300 + 245, 25);
            renderer.fillText("Level", this.sideBar.offset.left - 300 + 155, 50);
            renderer.fillText(this.game.player.level + "/" + this.game.activeMap.settings.levels, this.sideBar.offset.left - 300 + 245, 50);

            return this;
        },

        drawContainers: function(renderer) {
            renderer.strokeStyle = '#79d0e7';
            renderer.lineWidth = 1;

            // Draw Borders
            renderer.beginPath();
            renderer.moveTo(this.topBar.offset.left, this.topBar.height);
            renderer.lineTo(this.topBar.width, this.topBar.height);
            renderer.moveTo(this.sideBar.offset.left, this.sideBar.offset.top);
            renderer.lineTo(this.sideBar.offset.left, this.sideBar.height);
            renderer.stroke();

            renderer.strokeRect(
                this.mapContainer.offset.left,
                this.mapContainer.offset.top,
                this.mapContainer.width,
                this.mapContainer.height
            );

            // Fill the top bar
            renderer.fillStyle = 'black';
            renderer.fillRect(
                this.topBar.offset.left,
                this.topBar.offset.top,
                this.topBar.width,
                this.topBar.height
            );

            // Fill the right side bar
            renderer.fillRect(
                this.sideBar.offset.left,
                this.sideBar.offset.top,
                this.sideBar.width,
                this.sideBar.height
            );


            // Draw map container
            renderer.fillRect(
                this.mapContainer.offset.left,
                this.mapContainer.offset.top,
                this.mapContainer.width,
                this.mapContainer.height
            );

            return this;
        }
    }, true);
})();
(function() {
    Opus.Map = function(game, settings) {
        /**
         * Reference to the game object.
         *
         * @type {Opus.Game}
         */
        this.game = game;

        this.settings = {
            map: [],
            mapNotation: {
                path:   'P',
                ground: '.',
                start:  'S',
                end:    'E'
            },
            cellsX: 0,
            cellsY: 0,
            groundLineColor: '#0c8280',
            groundColor:     '#1a4843',
            pathColor:       '#002323',
            pathLineColor:   '#79d0e7',
            levels: 0
        };
        Opus.Helpers.extend(this.settings, settings, true);

        /**
         * Reference to the map container UI element.
         *
         * @type {object}
         */
        this.container  = game.UI.mapContainer;

        /**
         * Size of one cell based on container height for scaling.
         *
         * @type {number}
         */
        this.cellSize  = this.container.height / this.settings.cellsY;

        /**
         * Map width.
         *
         * @type {number}
         */
        this.mapWidth = this.cellSize * this.settings.cellsY;

        // Set container background color to fill all cells
        this.container.backgroundColor = this.settings.groundColor;
        this.container.offset.left = (this.container.width - this.mapWidth) / 2;
        this.container.width = this.mapWidth;

        this.needsInitialising = true;

        this.startCell = null;
        this.endCell = null;
        this.findStartCell();
        this.findEndCell();

        return this;
    };

    Opus.Helpers.extend(Opus.Map.prototype, {

        /**
         * Returns the cell x,y based on the point passed in.
         *
         * @param x
         * @param y
         * @returns {Object}
         */
        findGridCell: function(x, y) {
            for (var h = 0; h < this.settings.cellsX; h++) {
                for (var j = 0; j < this.settings.cellsY; j++) {
                    if (x <= this.container.offset.left + (h * this.cellSize) + this.cellSize &&
                        x >= this.container.offset.left + (h * this.cellSize) &&
                        y <= this.container.offset.top  + (j * this.cellSize) + this.cellSize &&
                        y >= this.container.offset.top  + (j * this.cellSize)) {
                            return {
                                x: h,
                                y: j
                            };
                    }
                }
            }

            return false;
        },

        /**
         * Finds the start cell position.
         *
         */
        findStartCell: function() {
            for (var x = 0; x < this.settings.cellsX; x++) {
                for (var y = 0; y < this.settings.cellsY; y++) {
                    if (this.getMapElement(x, y) == this.settings.mapNotation.start) {
                        if (!!this.startCell) {
                            throw Error("Start cell already set!");
                        }

                        this.startCell = new Opus.Vector2D(x, y);
                    }
                }
            }
        },

        /**
         * Finds the end cell position.
         *
         */
        findEndCell: function() {
            for (var x = 0; x < this.settings.cellsX; x++) {
                for (var y = 0; y < this.settings.cellsY; y++) {
                    if (this.getMapElement(x, y) == this.settings.mapNotation.end) {
                        if (!!this.endCell) {
                            throw Error("End cell already set!");
                        }

                        this.endCell = new Opus.Vector2D(x, y);
                    }
                }
            }
        },

        /**
         * Render the map.
         *
         * @param renderer
         * @returns {Opus.Map}
         */
        render: function(renderer) {
            this.drawGrid(renderer);
            this.drawPathBorders(renderer);

            return this;
        },

        /**
         * Update the map.
         *
         * @param time
         * @returns {Opus.Map}
         */
        update: function(time) {

            if (this.needsInitialising) {
                this.initialiseLevel();
                this.needsInitialising = false;
            }

            return this;
        },

        // TODO: change this to be fired on an action and not based on setTimeout o_O
        initialiseLevel: function() {
            var self = this;
            var test = function() {
                self.addEnemy();
            };
            setTimeout(test, 1000);
            setTimeout(test, 2000);
            setTimeout(test, 3000);
            setTimeout(test, 4000);
            setTimeout(test, 5000);
            setTimeout(test, 6000);
            setTimeout(test, 7000);
            setTimeout(test, 8000);
            setTimeout(test, 9000);
            setTimeout(test, 10000);
        },

        /**
         * Adds an enemy to the map and container.
         *
         */
        addEnemy: function() {
            this.game.container.addEntity(new Opus.Enemy(this.game,
                    this.container.offset.left + (this.cellSize * this.startCell.x + (this.cellSize / 2)) - 5,
                    this.container.offset.top  + (this.cellSize * this.startCell.y + (this.cellSize / 2)) - 5,
                    10, 10, {
                        health: 50,
                        value: 25,
                        score: 100
                    }
                )
            );
        },

        /**
         * Draw the grid with fill and borders.
         *
         * @param renderer
         */
        drawGrid: function(renderer) {
            renderer.strokeStyle = this.settings.groundLineColor;
            renderer.lineWidth = 1;

            for (var x = 0; x < this.settings.cellsX; x++) {
                for (var y = 0; y < this.settings.cellsY; y++) {

                    switch (this.getMapElement(x, y)) {
                        case this.settings.mapNotation.ground:
                            renderer.strokeStyle = this.settings.groundLineColor;
                            renderer.strokeRect(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize),
                                this.cellSize,
                                this.cellSize
                            );

                            renderer.fillStyle = this.settings.groundColor;
                            renderer.fillRect(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize),
                                this.cellSize,
                                this.cellSize
                            );
                            break;
                        case this.settings.mapNotation.path:
                            renderer.fillStyle = this.settings.pathColor;
                            renderer.fillRect(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize),
                                this.cellSize,
                                this.cellSize
                            );

                            renderer.strokeStyle = this.settings.pathColor;
                            renderer.strokeRect(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize),
                                this.cellSize,
                                this.cellSize
                            );
                            break;
                        case this.settings.mapNotation.start:
                            var greenGradient = renderer.createLinearGradient(150, 0, 150, 300);

                            // Add colors
                            greenGradient.addColorStop(0.000, 'green');
                            greenGradient.addColorStop(0.320, this.settings.pathColor);

                            renderer.fillStyle = 'green';
                            renderer.fillRect(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize),
                                this.cellSize,
                                this.cellSize
                            );

                            break;
                        case this.settings.mapNotation.end:
                            var redGradient = renderer.createLinearGradient(150, 300, 150, 0);

                            // Add colors
                            redGradient.addColorStop(0.000, 'red');
                            redGradient.addColorStop(0.100, this.settings.pathColor);

                            renderer.fillStyle = 'red';
                            renderer.fillRect(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize),
                                this.cellSize,
                                this.cellSize
                            );
                            break;
                        default:
                            throw Error("Value not set in map notation [" + this.getMapElement(x, y) + "]");
                    }
                }
            }

            return this;
        },

        /**
         * Draw the borders for the enemy path.
         *
         * @param renderer
         */
        drawPathBorders: function(renderer) {
            for (var x = 0; x < this.settings.cellsX; x++) {
                for (var y = 0; y < this.settings.cellsY; y++) {
                    if (this.getMapElement(x,y) == this.settings.mapNotation.path ||
                        this.getMapElement(x,y) == this.settings.mapNotation.start ||
                        this.getMapElement(x,y) == this.settings.mapNotation.end) {
                        renderer.strokeStyle = this.settings.pathLineColor;
                        renderer.beginPath();

                        // If there is an ground cell on left draw left border on path
                        if (this.getMapElement(x - 1, y) == this.settings.mapNotation.ground) {
                            renderer.moveTo(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize)
                            );
                            renderer.lineTo(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize) + this.cellSize
                            );
                        }

                        // If there is an ground cell on right draw right border on path
                        if (this.getMapElement(x + 1, y) == this.settings.mapNotation.ground) {
                            renderer.moveTo(
                                this.container.offset.left + (x * this.cellSize) + this.cellSize,
                                this.container.offset.top  + (y * this.cellSize)
                            );
                            renderer.lineTo(
                                this.container.offset.left + (x * this.cellSize) + this.cellSize,
                                this.container.offset.top  + (y * this.cellSize) + this.cellSize
                            );
                        }

                        // If there is an ground cell on top draw top border on path
                        if (this.getMapElement(x, y - 1) == this.settings.mapNotation.ground) {
                            renderer.moveTo(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize)
                            );
                            renderer.lineTo(
                                this.container.offset.left + (x * this.cellSize) + this.cellSize,
                                this.container.offset.top  + (y * this.cellSize)
                            );
                        }

                        // If there is an ground cell on bottom draw bottom border on path
                        if (this.getMapElement(x, y + 1) == this.settings.mapNotation.ground) {
                            renderer.moveTo(
                                this.container.offset.left + (x * this.cellSize),
                                this.container.offset.top  + (y * this.cellSize) + this.cellSize
                            );
                            renderer.lineTo(
                                this.container.offset.left + (x * this.cellSize) + this.cellSize,
                                this.container.offset.top  + (y * this.cellSize) + this.cellSize
                            );
                        }

                        renderer.stroke();
                    }
                }
            }

            return this;
        },

        /**
         * Provides an easy way to get the map element via x and y coordinates (like a 2D array).
         * Have chosen to go with Row-major order for the 1D array.
         *
         * @param x
         * @param y
         * @returns {*}
         */
        getMapElement: function(x, y) {
            return this.settings.map[this.settings.cellsX * y + x];
        }

    }, true);
})();
(function() {

    Opus.Container = function() {
        /**
         * Holds a list of all entities within a container.
         *
         * @type {Array}
         */
        this.containedEntities = [];
    };

    Opus.Helpers.extend(Opus.Container.prototype, {

        /**
         * Add an entity to the container, pass zIndex to position in the container.
         *
         * @param entity
         * @param zIndex
         * @returns {*}
         */
        addEntity: function(entity, zIndex) {
            if (!zIndex) {
                entity.zIndex = this.containedEntities.length;
            }

            if (typeof zIndex === 'number') {
                entity.zIndex = zIndex;
            }

            this.containedEntities.push(entity);

            this.containedEntities.sort(this.sort);

            return entity;
        },

        /**
         * Remove an entity from the container.
         *
         * @param entity
         * @returns {Opus.Container}
         */
        removeEntity: function(entity) {
            if (this.containsEntity(entity)) {
                this.containedEntities.splice(this.containedEntities.indexOf(entity), 1);
            }

            return this;
        },

        /**
         * Check if a given entity exists within the container.
         *
         * @param entity
         * @returns {boolean}
         */
        containsEntity: function(entity) {
            return this.containedEntities.indexOf(entity) !== -1;
        },

        /**
         * Fires the update method on all contained entities.
         *
         * @param time
         */
        update: function(time) {
            for (var i = this.containedEntities.length, entity; i--, (entity = this.containedEntities[i]);) {
                entity.update(time);
            }
        },

        /**
         * Fires the render method on all contained entities.
         *
         * @param renderer
         */
        render: function(renderer) {
            for (var i = this.containedEntities.length, entity; i--, (entity = this.containedEntities[i]);) {
                entity.render(renderer);
            }
        },

        /**
         * Sort the entities within the container based on the zIndex.
         *
         * @param a
         * @param b
         * @returns {number}
         */
        sort: function(a, b) {
            return b.zIndex - a.zIndex;
        }

    }, true);

})();
(function() {

    Opus.Player = function() {
        /**
         * Players current funds.
         *
         * @type {number}
         */
        this.money = 500;

        /**
         * Players current lives.
         *
         * @type {number}
         */
        this.lives = 20;

        /**
         * Players maximum lives.
         *
         * @type {number}
         */
        this.maxLives = 20;

        /**
         * Current level the player is on.
         *
         * @type {number}
         */
        this.level = 0;

        /**
         * Players score.
         *
         * @type {number}
         */
        this.score = 0;

        return this;
    };

    Opus.Helpers.extend(Opus.Player.prototype, {
        /**
         * Give the player some cash.
         *
         * @param amount
         * @returns {Opus.Player}
         */
        addMoney: function(amount) {
            this.money += amount;

            return this;
        },

        /**
         * Take away some cash.
         *
         * @param amount
         * @returns {Opus.Player}
         */
        removeMoney: function(amount) {
            this.money -= amount;

            return this;
        },

        /**
         * Add score to the player.
         *
         * @param score
         */
        addScore: function(score) {
            this.score += score;
        }
    }, true);

})();
(function() {

    Opus.Enemy = function(game, x, y, width, height, type) {
        /**
         * Reference to the game object.
         *
         * @type {Opus.Game}
         */
        this.game = game;

        //TODO: add name to enemies
        //this.name   = name;

        /**
         * Indicates if the enemy health is > 0.
         *
         * @type {boolean}
         */
        this.alive  = true;

        /**
         * Used for sorting in a container.
         *
         * @type {Number}
         */
        this.zIndex = NaN;

        /**
         * Enemy width.
         *
         * @type {Number}
         */
        this.width  = width;

        /**
         * Enemy height.
         * @type {Number}
         */
        this.height = height;

        /**
         * Enemies position.
         *
         * @type {Opus.Vector2D}
         */
        this.position = new Opus.Vector2D(x, y);

        /**
         * Max health used to work out percentage health left and to refill health to max if needed.
         *
         * @type {number|*}
         */
        this.maxHealth = type.health;

        /**
         * The current health of the enemy.
         *
         * @type {number|*}
         */
        this.health = type.health;

        /**
         * The value of this enemy, ie how much the player will gain if destroyed.
         */
        this.value = type.value;

        /**
         * The score that the player will gain if destroyed.
         *
         * @type {number|*}
         */
        this.score = type.score;

        /**
         * Used to track which way point this enemy is at.
         *
         * @type {number}
         */
        this.waypointCounter = 1;

        /**
         * Holds the next way point for this enemy.
         */
        this.nextWaypoint = this.game.activeMap.settings.cellWaypoints[this.waypointCounter];

        /**
         * Holds the current grid cell position.
         *
         * @type {Object}
         */
        this.gridPosition = {};

        /**
         * Indicates the direction that the enemy is currently facing/travelling.
         *
         * @type {null}
         */
        this.direction = null;

        // Calculate the direction that the enemy will be facing when spawned.
        this.calculateDirection();
    };

    Opus.Helpers.extend(Opus.Enemy.prototype, {
        /**
         * Used to calculate the direction that the enemy is traveling/facing.
         *
         * Calculated based on the next way point in relation to the current way point.
         */
        calculateDirection: function() {
            if (Math.floor(this.game.activeMap.container.offset.top + (this.game.activeMap.cellSize * this.nextWaypoint.y + (this.game.activeMap.cellSize / 2)) - 5) < Math.floor(this.position.y)) {
                this.direction = 'up';
            } else if (Math.floor(this.game.activeMap.container.offset.top + (this.game.activeMap.cellSize * this.nextWaypoint.y + (this.game.activeMap.cellSize / 2))) - 5 > Math.floor(this.position.y)) {
                this.direction = 'down';
            } else if (Math.floor(this.game.activeMap.container.offset.left + (this.game.activeMap.cellSize * this.nextWaypoint.x + (this.game.activeMap.cellSize / 2))) - 5 < Math.floor(this.position.x)) {
                this.direction = 'left';
            } else if (Math.floor(this.game.activeMap.container.offset.left + (this.game.activeMap.cellSize * this.nextWaypoint.x + (this.game.activeMap.cellSize / 2))) - 5 > Math.floor(this.position.x)) {
                this.direction = 'right';
            }
        },

        /**
         * Draws the enemies health bar based on percentage current health to max health.
         *
         * @param renderer
         */
        drawHealthBar: function(renderer) {
            renderer.fillStyle = 'lightgreen';
            var percentageHealth = (this.health / this.maxHealth);
            var maxHealthBar = this.width;

            renderer.fillRect(this.position.x, this.position.y - 5, maxHealthBar * percentageHealth, 2);
        },

        /**
         * Draw draw draw...
         *
         * @param renderer
         * @returns {Opus.Enemy}
         */
        render: function(renderer) {
            renderer.fillStyle = 'orange';
            renderer.fillRect(this.position.x, this.position.y, this.width, this.height);

            this.drawHealthBar(renderer);

            return this;
        },

        /**
         * Update the entities position and check if its alive (add player score and money if not).
         *
         * TODO: Separate this out into methods.
         *
         * @param time
         * @returns {Opus.Enemy}
         */
        update: function(time) {
            if (this.alive) {
                if (this.health <= 0) {
                    this.alive = false;
                    this.game.player.addMoney(this.value);
                    this.game.player.addScore(this.score);
                    this.game.container.removeEntity(this);
                }

                this.gridPosition = this.game.activeMap.findGridCell(this.position.x, this.position.y);

                if (this.nextWaypoint.y > this.gridPosition.y) {
                        this.position.y++;
                } else if (this.nextWaypoint.y < this.gridPosition.y) {
                    this.position.y--;
                } else if (this.nextWaypoint.y == this.gridPosition.y &&
                    this.nextWaypoint.x == this.gridPosition.x) {

                    if (this.direction == 'down') {
                        this.position.y++;
                    }

                    if (this.direction == 'up') {
                        this.position.y--;
                    }
                }


                if (this.nextWaypoint.x > this.gridPosition.x) {
                    this.position.x++;
                } else if (this.nextWaypoint.x < this.gridPosition.x) {
                    this.position.x--;
                } else if (this.nextWaypoint.y == this.gridPosition.y &&
                    this.nextWaypoint.x == this.gridPosition.x) {

                    if (this.direction == 'right') {
                        this.position.x++;
                    }

                    if (this.direction == 'left') {
                        this.position.x--;
                    }
                }

                if (this.gridPosition.x == this.game.activeMap.endCell.x &&
                    this.gridPosition.y == this.game.activeMap.endCell.y) {

                    this.alive = false;
                    this.game.player.lives--;
                    this.game.container.removeEntity(this);
                } else {
                    if (this.gridPosition.x == this.nextWaypoint.x && this.gridPosition.y == this.nextWaypoint.y &&
                        Math.floor(this.position.x) == Math.floor(this.game.activeMap.container.offset.left + (this.game.activeMap.cellSize * this.nextWaypoint.x + (this.game.activeMap.cellSize / 2)) - 5) &&
                        Math.floor(this.position.y) == Math.floor(this.game.activeMap.container.offset.top + (this.game.activeMap.cellSize * this.nextWaypoint.y + (this.game.activeMap.cellSize / 2)) - 5)) {
                        this.nextWaypoint = this.game.activeMap.settings.cellWaypoints[++this.waypointCounter];
                        this.calculateDirection();
                    }
                }
            }

            return this;
        }

    }, true);

})();
(function() {


    Opus.Game = function(screenWidth, screenHeight) {
        this.countFps = false;

        this.animationFrameId = -1;

        Opus.Timer.init();

        this.renderer = new Opus.Renderer(screenWidth, screenHeight);

        this.maps = [];

        this.towers = [];

        this.activeMap = null;

        this.input = new Opus.Input(this);

        this.UI = new Opus.UI(this, screenWidth, screenHeight);

        this.player = new Opus.Player();

        this.container = new Opus.Container();

        this.selectedTower = null;

        this.topLevelRenderObjects = [];

        return this;
    };

    Opus.Helpers.extend(Opus.Game.prototype, {
        render: function() {
            this.renderer.clearScreen('#16413c');

            this.UI.render(this.renderer.getContext());

            if (!!this.activeMap) {
                this.activeMap.render(this.renderer.getContext());
            }

            this.container.render(this.renderer.getContext());

            for (var i = 0; i < this.topLevelRenderObjects.length; i++) {
                this.topLevelRenderObjects[i](this.renderer.getContext());
                this.topLevelRenderObjects.splice(i, 1);
            }

            this.renderer.drawFrontBuffer();

            return this;
        },

        update: function(time) {
            Opus.Timer.update(time);

            if (this.countFps === true) {
                Opus.Timer.countFps();
            }

            if (!!this.activeMap) {
                this.activeMap.update(time);
            }

            this.UI.update(time);

            this.container.update(time);

            return this;
        },

        addTopLevelRenderObject: function(callback) {
            this.topLevelRenderObjects.push(callback);
        },

        gameLoop: function(time) {
            this.update(time);
            this.render(time);

            if (this.animationFrameId !== -1) {
                this.animationFrameId = window.requestAnimationFrame(this.gameLoop.bind(this));
            }

            return this;
        },

        startGameLoop: function() {
            // Check that the loop hasn't already been started
            if (this.animationFrameId === -1) {
                this.animationFrameId = window.requestAnimationFrame(this.gameLoop.bind(this));
            }

            return this;
        },

        stopGameLoop: function() {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = -1;

            return this;
        },

        addMap: function(map) {
            this.maps.push(map);

            return this;
        },

        setActiveMap: function(map) {
            this.activeMap = map;

            return this;
        },

        addTower: function(tower) {
            this.towers.push(tower);

            return this;
        }

    }, true);

})();

setTimeout(function() {
    window.CanvasTD = new Opus.Game(1024, 600);
    CanvasTD.addMap(new Opus.Map(CanvasTD, {
        map: [
            '.','S','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',
            '.','P','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',
            '.','P','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',
            '.','P','P','P','P','.','.','.','.','.','.','.','P','P','P','P','P','P','P','.','.','.',
            '.','.','.','.','P','.','.','.','.','.','.','.','P','.','.','.','.','.','P','.','.','.',
            '.','.','.','.','P','.','.','P','P','P','P','.','P','P','P','.','.','.','P','.','.','.',
            '.','.','.','.','P','.','.','P','.','.','P','.','.','.','P','.','P','P','P','.','.','.',
            '.','.','.','.','P','P','P','P','.','.','P','.','.','.','P','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','P','.','.','.','P','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','P','P','P','.','P','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','.','.','P','.','P','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','.','.','P','.','P','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','.','.','P','P','P','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','P','.','.','.','.','.',
            '.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','E','.','.','.','.','.',
        ],
        cellsX: 22,
        cellsY: 18,
        cellWaypoints: [
            {x: 1,  y: 0}, {x: 1,  y: 3}, {x: 4,  y: 3}, {x: 4,  y: 7},  {x: 7,  y: 7},  {x: 7,  y: 5},
            {x: 10, y: 5}, {x: 10, y: 9}, {x: 12, y: 9}, {x: 12, y: 12}, {x: 14, y: 12}, {x: 14, y: 5},
            {x: 12, y: 5}, {x: 12, y: 3}, {x: 18, y: 3}, {x: 18, y: 6},  {x: 16, y: 6},  {x: 16, y: 18}
        ]
    })).setActiveMap(CanvasTD.maps[0]).addTower({
        level: 1,
        id: 1,
        range: 2,
        attacksPerSecond: 20,
        damage: 2,
        cost: 100,
        name: 'Laser Tower',
        color: 'green',
        levelAvailable: 1
    }).startGameLoop().input.addEvent('click', function(event) {

        }, {self: this});
}, 1000);