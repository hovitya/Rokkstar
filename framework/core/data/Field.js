core.data.Field = Rokkstar.createClass('core.data.Field', 'core.Component', function () {
    "use strict";

    this.construct = function (name, propertyName, type, isArray, factory) {
        this.callSuper('construct');
        if (name !== undefined) { this.setName(name); }
        if (undefined !== propertyName) { this.setPropertyName(propertyName); }
        if (type !== undefined) { this.setType(type); }
        if (isArray !== undefined) { this.setIsArray(isArray); }
        if (factory !== undefined) { this.setFactory(factory); }
    };

    this.getPropertyName = function () {
        if (this.___propertyName === undefined) { return this.getName(); }
        return this.___propertyName;
    };

    this.init = function () {
        this.callSuper('init');
        this.createEventListener('factoryClassPropertyChanged', this.invalidateFactory, this);
    };

    this.invalidateFactory = function () {
        this.___factory = undefined;
    };

    this.getFactory = function () {
        if (this.___factory) { return this.___factory; }
        if (this.factoryClass) {
            this.___factory = new this.factoryClass;
            return this.___factory;
        }
        return undefined;
    };


}, [new Attr('name', '', 'string'), new Attr('propertyName', undefined, 'string'), new Attr('type', 'string', 'string'), new Attr('isArray', false, 'boolean'), new Attr('factoryClass', undefined, 'string'), new Attr('factory', undefined, 'core.IFactory')]);