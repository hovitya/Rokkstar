core.layouts.BorderLayout = Rokkstar.createClass('core.layouts.BorderLayout', 'core.layouts.Layout', function () {
    "use strict";

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('gapPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('gapRightPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('gapTopPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('gapBottomPropertyChanged', this.selfRefreshLayout, this);
        this.createEventListener('gapLeftPropertyChanged', this.selfRefreshLayout, this);
    };

    this.currentHandle = null;

    /**
     *
     * @param {core.VisualContainer} div Target container
     */
    this.doLayout = function (div) {
        this.callSuper('doLayout', div);

        if (div._registeredHandles === undefined) {
            div._registeredHandles = {};
        }

        var gap = this.getGap(),
            leftGap = this.getGapLeft(),
            rightGap = this.getGapRight(),
            topGap = this.getGapTop(),
            bottomGap = this.getGapBottom(),
            leftPadding = this.getPaddingLeft(),
            rightPadding = this.getPaddingRight(),
            topPadding = this.getPaddingTop(),
            bottomPadding = this.getPaddingBottom(),
            position = new core.helpers.LayoutPosition(div.measuredWidth, div.measuredHeight, leftPadding, rightPadding, topPadding, bottomPadding),
            topSlot = null,
            leftSlot = null,
            rightSlot = null,
            bottomSlot = null,
            centerSlot = null,
            i,
            element,
            topPosition,
            handle,
            bottomPosition,
            leftPosition,
            rightPosition;

        if (leftGap === undefined || leftGap === null || isNaN(leftGap)) {
            leftGap = gap;
        }
        if (rightGap === undefined || rightGap === null || isNaN(rightGap)) {
            rightGap = gap;
        }
        if (topGap === undefined || topGap === null || isNaN(topGap)) {
            topGap = gap;
        }
        if (bottomGap === undefined || bottomGap === null || isNaN(bottomGap)) {
            bottomGap = gap;
        }

        i = div.elements.length;
        while (--i >= 0) {
            element = div.elements[i];
            switch (element.getPosition()) {
            case 'center':
                if (centerSlot === null) {
                    centerSlot = element;
                } else {
                    throw new Error('Multiple "center" part found for a border layout.');
                }
                break;
            case 'left':
                if (leftSlot === null) {
                    leftSlot = element;
                } else {
                    throw new Error('Multiple "left" part found for a border layout.');
                }
                break;
            case 'right':
                if (rightSlot === null) {
                    rightSlot = element;
                } else {
                    throw new Error('Multiple "right" part found for a border layout.');
                }
                break;
            case 'bottom':
                if (bottomSlot === null) {
                    bottomSlot = element;
                } else {
                    throw new Error('Multiple "bottom" part found for a border layout.');
                }
                break;
            case 'top':
                if (topSlot === null) {
                    topSlot = element;
                } else {
                    throw new Error('Multiple "top" part found for a border layout.');
                }
                break;
            }
        }


        //Create top element
        topPosition = topPadding;
        if (topSlot !== null) {
            position.clear();
            position.top = topPadding;
            position.left = leftPadding;
            position.right = rightPadding;
            position.height = topSlot.getHeight();
            position.minHeight = topSlot.getMinHeight();
            position.maxHeight = topSlot.getMaxHeight();
            position.apply(topSlot);
            topSlot.measure();

            //Create top gap
            if (div._registeredHandles.top === undefined) {
                div._registeredHandles.top = document.createElement('div');
            }
            handle = div._registeredHandles.top;
            handle.className = "coreTopBorderHandle coreUpDownHandle";


            handle.style.position = 'absolute';
            handle.style.top = (parseInt(topPadding, 10) + parseInt(topSlot.measuredHeight, 10)) + 'px';
            handle.style.left = leftPadding + 'px';
            handle.style.right = rightPadding + 'px';
            handle.style.height = topGap + 'px';
            div.domElement.appendChild(handle);
            handle.parentPanel = topSlot;
            handle.addEventListener('mousedown', this.handleClickedProxy);
            topPosition = parseInt(topPadding, 10) + parseInt(topSlot.measuredHeight, 10) + parseInt(topGap, 10);
        }


        //Create bottom element
        bottomPosition = bottomPadding;
        if (bottomSlot !== null) {
            position.clear();
            position.bottom = bottomPadding;
            position.left = leftPadding;
            position.right = rightPadding;
            position.height = bottomSlot.getHeight();
            position.minHeight = bottomSlot.getMinHeight();
            position.maxHeight = bottomSlot.getMaxHeight();
            position.apply(bottomSlot);
            bottomSlot.measure();

            //Create bottom gap
            if (div._registeredHandles.bottom === undefined) {
                div._registeredHandles.bottom = document.createElement('div');
            }
            handle = div._registeredHandles.bottom;
            handle.className = "coreBottomBorderHandle coreUpDownHandle";


            handle.style.position = 'absolute';
            handle.style.bottom = (parseInt(bottomPadding, 10) + parseInt(bottomSlot.measuredHeight, 10)) + 'px';
            handle.style.left = leftPadding + 'px';
            handle.style.right = rightPadding + 'px';
            handle.style.height = bottomGap + "px";
            div.domElement.appendChild(handle);
            handle.parentPanel = bottomSlot;
            handle.addEventListener('mousedown', this.handleClickedProxy);
            bottomPosition = parseInt(bottomPadding, 10) + parseInt(bottomSlot.measuredHeight, 10) + parseInt(bottomGap, 10);
            div.measuredContentHeight = topSlot.measuredHeight + bottomSlot.measuredHeight + parseInt(centerSlot.getHeight(), 10);
            div.measuredContentWidth = leftSlot.measuredWidth + rightSlot.measuredWidth + parseInt(centerSlot.getWidth(), 10);
        }

        //Create left element
        leftPosition = leftPadding;
        if (leftSlot !== null) {
            position.clear();
            position.bottom = bottomPosition;
            position.left = leftPadding;
            position.top = topPosition;
            position.width = leftSlot.getWidth();
            position.minWidth = leftSlot.getMinWidth();
            position.maxWidth = leftSlot.getMaxWidth();
            position.apply(leftSlot);
            leftSlot.measure();

            //Create left gap
            handle = document.createElement('div');
            if (div._registeredHandles.left === undefined) {
                div._registeredHandles.left = document.createElement('div');
            }
            handle = div._registeredHandles.left;
            handle.className = "coreLeftBorderHandle coreLeftRightHandle";


            handle.style.position = 'absolute';
            handle.style.bottom = bottomPosition + 'px';
            handle.style.left = (parseInt(leftPadding, 10) + parseInt(leftSlot.measuredWidth, 10)) + 'px';
            handle.style.top = topPosition + 'px';
            handle.style.width = leftGap + "px";
            div.domElement.appendChild(handle);
            handle.parentPanel = leftSlot;

            handle.addEventListener('mousedown', this.handleClickedProxy);
            leftPosition = parseInt(leftPadding, 10) + parseInt(leftSlot.measuredWidth, 10) + parseInt(leftGap, 10);
        }

        //Create right element
        rightPosition = rightPadding;
        if (rightSlot !== null) {

            position.clear();
            position.bottom = bottomPosition;
            position.right = rightPadding;
            position.top = topPosition;
            position.width = rightSlot.getWidth();
            position.minWidth = rightSlot.getMinWidth();
            position.maxWidth = rightSlot.getMaxWidth();
            position.apply(rightSlot);
            rightSlot.measure();

            //Create right gap
            if (div._registeredHandles.right == undefined) {
                div._registeredHandles.right = document.createElement('div');
            }
            handle = div._registeredHandles.right;
            handle.className = "coreRightBorderHandle coreLeftRightHandle";


            handle.style.position = 'absolute';
            handle.style.bottom = bottomPosition + 'px';
            handle.style.right = (parseInt(rightPadding, 10) + parseInt(rightSlot.measuredWidth, 10)) + 'px';
            handle.style.top = topPosition + 'px';
            handle.style.width = rightGap + "px";
            div.domElement.appendChild(handle);
            handle.parentPanel = rightSlot;
            handle.addEventListener('mousedown', this.handleClickedProxy);
            rightPosition = parseInt(rightPadding, 10) + parseInt(rightSlot.measuredWidth, 10) + parseInt(rightGap, 10);
        }

        if (centerSlot !== null) {
            position.clear();
            position.left = leftPosition;
            position.right = rightPosition;
            position.top = topPosition;
            position.bottom = bottomPosition;
            position.apply(centerSlot);
            centerSlot.measure();
        }


    };

    this.handleClicked = function (event) {
        this.currentHandle = event.currentTarget;
        this.lastPoint.x = event.pageX;
        this.lastPoint.y = event.pageY;
        this.resizeValue = 0;
        $(this.currentHandle).addClass("coreHandleHighlight");
        $(window).mousemove(this.handleMoveProxy);
        $(window).mouseup(this.handleUpProxy);

    }

    this.handleClickedProxy = $.proxy(this.handleClicked, this);

    this.lastPoint = {x: 0, y: 0};
    this.resizeValue = 0;

    this.handleMove = function (event) {
        var $ch = $(this.currentHandle),
            panel = this.currentHandle.parentPanel,
            enable = true;
        if ($ch.hasClass('coreRightBorderHandle')) {
            if (!isNaN(panel.getMinWidth()) && panel.getMinWidth() > panel.measuredWidth + this.resizeValue + Math.round(this.lastPoint.x - event.pageX)) {
                enable = false;
            }
            if (!isNaN(panel.getMaxWidth()) && panel.getMaxWidth() < panel.measuredWidth + this.resizeValue + Math.round(this.lastPoint.x - event.pageX)) {
                enable = false;
            }
            if (enable) {
                $ch.css({
                    right: (parseInt($ch.css('right'), 10) + Math.round(this.lastPoint.x - event.pageX)) + 'px'
                });
                this.resizeValue += Math.round(this.lastPoint.x - event.pageX);
            }
        } else if ($ch.hasClass('coreBottomBorderHandle')) {
            if (!isNaN(panel.getMinHeight()) && panel.getMinHeight() > panel.measuredHeight + this.resizeValue + Math.round(this.lastPoint.y - event.pageY)) {
                enable = false;
            }
            if (!isNaN(panel.getMaxHeight()) && panel.getMaxHeight() < panel.measuredHeight + this.resizeValue + Math.round(this.lastPoint.y - event.pageY)) {
                enable = false;
            }
            if (enable) {
                $ch.css({
                    bottom: (parseInt($ch.css('bottom'), 10) + Math.round(this.lastPoint.y - event.pageY)) + 'px'
                });
                this.resizeValue += Math.round(this.lastPoint.y - event.pageY);
            }
        } else if ($ch.hasClass('coreLeftBorderHandle')) {
            if (!isNaN(panel.getMinWidth()) && panel.getMinWidth() > panel.measuredWidth + this.resizeValue + Math.round(event.pageX - this.lastPoint.x)) {
                enable = false;
            }
            if (!isNaN(panel.getMaxWidth()) && panel.getMaxWidth() < panel.measuredWidth + this.resizeValue + Math.round(event.pageX - this.lastPoint.x)) {
                enable = false;
            }
            if (enable) {
                $ch.css({
                    left: (parseInt($ch.css('left'), 10) + Math.round(event.pageX - this.lastPoint.x)) + 'px'
                });
                this.resizeValue += Math.round(event.pageX - this.lastPoint.x);
            }
        } else if ($ch.hasClass('coreTopBorderHandle')) {
            if (!isNaN(panel.getMinHeight()) && panel.getMinHeight() > panel.measuredHeight + this.resizeValue + Math.round(event.pageY - this.lastPoint.y)) {
                enable = false;
            }
            if (!isNaN(panel.getMaxHeight()) && panel.getMaxHeight() < panel.measuredHeight + this.resizeValue + Math.round(event.pageY - this.lastPoint.y)) {
                enable = false;
            }
            if (enable) {
                $ch.css({
                    top: (parseInt($ch.css('top'), 10) + Math.round(event.pageY - this.lastPoint.y)) + 'px'
                });
                this.resizeValue += Math.round(event.pageY - this.lastPoint.y);
            }
        }
        if (enable) {
            this.lastPoint.x = event.pageX;
            this.lastPoint.y = event.pageY;
        }
    };

    this.handleMoveProxy = $.proxy(this.handleMove, this);

    this.handleUp = function (event) {
        $(window).unbind('mousemove', this.handleMoveProxy);
        $(window).unbind('mouseup', this.handleUpProxy);

        var $ch = $(this.currentHandle);
        if ($ch.hasClass('coreLeftRightHandle')) {
            this.currentHandle.parentPanel.setWidth((parseInt(this.currentHandle.parentPanel.measuredWidth, 10) + this.resizeValue) + "px");
        } else {
            this.currentHandle.parentPanel.setHeight((parseInt(this.currentHandle.parentPanel.measuredHeight, 10) + this.resizeValue) + "px");
        }
        $ch.removeClass("coreHandleHighlight");
        this.currentHandle = null;

    };

    this.handleUpProxy = $.proxy(this.handleUp, this);

}, [new Attr('gap', '5'), new Attr('gapRight', undefined), new Attr('gapTop', undefined), new Attr('gapBottom', undefined), new Attr('gapLeft', undefined)]);