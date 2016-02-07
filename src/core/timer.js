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