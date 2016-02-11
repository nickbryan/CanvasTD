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

        this.game.renderer.canvas.addEventListener('touchstart', (function(event) {
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

        this.game.renderer.canvas.addEventListener('touchend', (function(event) {
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

        this.game.renderer.canvas.addEventListener('touchmove', (function(event) {
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