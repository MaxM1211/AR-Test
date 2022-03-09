/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
    schema: {
        enabled: { default: true },
        rotationFactor: { default: 5 },
        rotationFactor_y: { default: 1 },
        rotationFactor_x: { default: 1 },
        rotationFactor_threshold: { default: 5 },
        minScale: { default: 0.50 },
        maxScale: { default: 4 },
    },

    init: function() {
        this.handleScale = this.handleScale.bind(this);
        this.handleRotation = this.handleRotation.bind(this);

        this.isVisible = false;
        this.initialScale = this.el.object3D.scale.clone();
        this.scaleFactor = 1;

        this.el.sceneEl.addEventListener("markerFound", (e) => {
            this.isVisible = true;
        });

        this.el.sceneEl.addEventListener("markerLost", (e) => {
            this.isVisible = false;
        });
    },

    update: function() {
        if (this.data.enabled) {
            this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
            this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
        } else {
            this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
            this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
        }
    },

    remove: function() {
        this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
        this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    },

    handleRotation: function(event) {
        if (this.isVisible) {
            change_y = event.detail.positionChange.x * this.data.rotationFactor * this.data.rotationFactor_y;
            change_x = event.detail.positionChange.y * this.data.rotationFactor * this.data.rotationFactor_x;
            if (change_y >= this.rotationFactor_threshold)
                this.el.object3D.rotation.y += change_y;
            if (change_x >= this.rotationFactor_threshold)
                this.el.object3D.rotation.x += change_x;
        }
    },

    handleScale: function(event) {
        if (this.isVisible) {
            this.scaleFactor *=
                1 + event.detail.spreadChange / event.detail.startSpread;

            this.scaleFactor = Math.min(
                Math.max(this.scaleFactor, this.data.minScale),
                this.data.maxScale
            );

            this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
            this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
            this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
        }
    },
});