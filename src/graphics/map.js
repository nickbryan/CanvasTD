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