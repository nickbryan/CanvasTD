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