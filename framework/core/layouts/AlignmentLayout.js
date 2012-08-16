/**
 * @augments core.layouts.Layout
 * @constructor
 */
core.layouts.AlignmentLayout = Rokkstar.createClass('core.layouts.AlignmentLayout', 'core.layouts.Layout', function () {

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('horizontalAlignPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('verticalAlignPropertyChanged', this.selfRefreshLayout, this);
    }

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('gapPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('verticalAlignPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('horizontalAlignPropertyChanged', this.selfRefreshLayout, this);
    }

}, [new Attr('horizontalAlign', 'left'), new Attr('verticalAlign', 'top'), new Attr('gap', 0)]);