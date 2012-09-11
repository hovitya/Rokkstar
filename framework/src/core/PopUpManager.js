core.PopUpManager = {
    defaults:{componentAnimator:undefined, modalAnimator:undefined},

    AddPopUp:function (component, modal, componentAnimator, modalAnimator) {
        if (modal == undefined) modal = true;
        var zmax = this.GetMaxZIndex();
        if (modal) {
            //Create modal layer
            zmax++;
            var modalLayer = $('<div class="coreModalLayer"/>');
            $('body').append(modalLayer);
            component.modalLayer = modalLayer.get(0);
            modalLayer.css('z-index', zmax);
            if (modalAnimator != undefined) {
                modalAnimator.apply(modalLayer.get(0), ['show']);
            }
        }
        zmax++;

        $(component).css('z-index', zmax);
        $(component).css('position', 'fixed');
        if (component.getWidth() != undefined && component.getWidth() != null) $(component).css('width', component.getWidth());
        if (component.getHeight() != undefined && component.getHeight() != null) $(component).css('height', component.getHeight());
        if (component.getX() != undefined && component.getX() != null) $(component).css('left', component.getX() + 'px');
        if (component.getY() != undefined && component.getY() != null) $(component).css('top', component.getY() + 'px');

        if (component.getLeft() != undefined && component.getLeft() != null) $(component).css('left', component.getLeft());
        if (component.getRight() != undefined && component.getRight() != null) $(component).css('right', component.getRight());
        if (component.getTop() != undefined && component.getTop() != null) $(component).css('top', component.getTop());
        if (component.getBottom() != undefined && component.getBottom() != null) $(component).css('bottom', component.getBottom());

        $('body').append(component);
        component.triggerEvent('elementAdded');
        //Setup size

    },

    GetMaxZIndex:function () {
        var zmax = 0;
        $('*').each(function () {
            var cur = parseInt($(this).css('z-index'));
            zmax = cur > zmax ? cur : zmax;
        });
        return zmax;
    }
}