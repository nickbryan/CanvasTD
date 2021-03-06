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