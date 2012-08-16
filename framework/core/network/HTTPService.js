core.network.HTTPService = Rokkstar.createClass('core.network.HTTPService', 'core.Component', function () {
    /**
     *
     * @type {Array}
     * @private
     */
    this.__runningConnections = [];

    this.send = function (data) {
        if (this.getConcurrency() == 'single' && this.__runningConnections.length > 0) {
            var event = core.network.events.FaultEvent('fault');
            event.faultMessage = 'Cannot send new request till current one is not finished.';
            this.triggerEvent(event);
            return null;
        }
        if (this.getConcurrency() == 'last') {
            for (var i in this.__runningConnections) {
                this.__runningConnections[i].abort();
            }
        }
        var settings = {};
        settings.cache = this.getCache();
        settings.data = data;
        settings.crossDomain = this.getCrossDomain();
        settings.dataType = this.getFormat();
        settings.context = this;
        settings.error = this.__onError;
        settings.success = this.__onSuccess;
        settings.type = this.getMethod();
        settings.contentType = this.getContentType();
        if (this.getTimeout() != undefined) settings.timeout = this.getTimeout();
        var xhr = $.ajax(this.getUrl(), settings);
        var invEvent = new core.network.events.InvokeEvent('invoke');
        invEvent.jqXHR = xhr;
        this.triggerEvent(invEvent);
        this.__runningConnections.push(xhr);
        return xhr;
    }

    /**
     *
     * @param jqXHR
     * @param textStatus
     * @param errorThrown
     * @private
     */
    this.__onError = function (jqXHR, textStatus, errorThrown) {
        this.__runningConnections.splice(this.__runningConnections.indexOf(jqXHR), 1);
        var event = new core.network.events.ResultEvent('fault');
        event.faultMessage = errorThrown;
        event.textStatus = textStatus;
        event.jqXHR = jqXHR;
        this.triggerEvent(event);
    }

    /**
     *
     * @param data
     * @param textStatus
     * @param jqXHR
     * @private
     */
    this.__onSuccess = function (data, textStatus, jqXHR) {
        this.__runningConnections.splice(this.__runningConnections.indexOf(jqXHR), 1);
        var event = new core.network.events.ResultEvent('result');
        event.textStatus = textStatus;
        event.jqXHR = jqXHR;
        var model = this.getModel();
        if (model) {
            if (this.getIsArray()) {
                event.result = [];
                for (var i in data) {
                    event.result.push(model.createObject(data[i]));
                }
            } else {
                event.result = model.createObject(data);
            }
        } else {
            event.result = data;
        }
        this.triggerEvent(event);
    }

    /**
     *
     * @return {core.data.Model}
     */
    this.getModel = function () {
        if (this.model) return this.model;
        if (this.modelClass) {
            this.model = new this.modelClass;
            return this.model;
        }
        return undefined;
    }
}, [new Attr('method', 'GET', 'string'), new Attr('url', '', 'string'), new Attr('cache', false, 'boolean'), new Attr('crossDomain', false, 'boolean'), new Attr('headers', [], 'array'),
    new Attr('timeout', undefined, 'integer'), new Attr('username', undefined, 'string'), new Attr('password', undefined, 'string'), new Attr('contentType', 'application/x-www-form-urlencoded', 'string'),
    new Attr('format', 'text', 'string'), new Attr('modelClass', undefined, 'string'), new Attr('model', undefined, 'string'), new Attr('isArray', false, 'boolean'), new Attr('concurrency', 'multiple', 'string')]);