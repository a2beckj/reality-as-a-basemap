AFRAME.registerComponent('cursor_busstop', {
    init: function () {
        this.el.addEventListener('mouseenter', BusStopToInfobox(e));
    }
});