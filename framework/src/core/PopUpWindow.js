core.PopUpWindow = function () {
    extend(this, "core.TitlePanel");
    this.resize = "";

    this.setResize = function (value) {
        this.resize = value;
        if (this.resize == 'enabled') {
            $(".selector").resizable("option", "disabled", false);
        } else {
            $(".selector").resizable("option", "disabled", true);
        }
    };

    this.init = function () {
        this.callSuper('init');
        $(this).css('position', 'fixed');
    };

    this.buildDOM = function () {
        this.callSuper("buildDOM");
        $(this).children('.coreTWTitle').addClass(this.getInstanceClass('moveHandler'));
        $('<div class="coreTWCloseButton">X</div>').appendTo(this);
        $(this).find('.coreTWCloseButton').click($.proxy(function () {
            this.triggerEvent('close');
            this.hide();
        }, this));
        $(this).draggable({handle:'.' + this.getInstanceClass('moveHandler')});
        $(this).resizable();
        //this.setResize(this.getXMLData('resize','enabled'));
    }
}