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
    }).startGameLoop();
}, 1000);