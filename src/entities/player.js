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