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
            renderer.lineWidth = 5;

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
                renderer.lineWidth = 5;

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