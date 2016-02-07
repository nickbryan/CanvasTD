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