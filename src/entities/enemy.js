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