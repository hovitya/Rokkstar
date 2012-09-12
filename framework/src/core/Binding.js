/* Rokkstar JavaScript Framework
 * 
 * Copyright © 2012 Viktor Horvath
 * Licensed under the MPL 2.0 license
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @class
 * @name Binding
 * @package core
 */
core.Binding = Rokkstar.createClass('core.Binding', 'core.Component', function () {
    "use strict";

}, [new Attr('source', '', 'string'), new Attr('destination', '', 'string')]);

core.Binding.bindProperty = function (site, property, host, chain) {
    "use strict";

    var watcher, handler;
    watcher = core.ChangeWatcher.watch(host, chain, null, site);
    handler = function (event) {
        if (site._attributeTypes[property] !== undefined) {
            site["set" + property.capitalize()].apply(site, [watcher.getValue()]);
        } else {
            site[property] = watcher.getValue();
        }
    };
    watcher.handler = handler;
    return watcher;
};

core.Binding.bindExpression = function (site, property, hosts, chains, expression) {
    "use strict";

    var watchers, handler, result, i = 0, hosts_length = hosts.length - 1, __watch_results = [];
    watchers = [];
    handler = function () {
        var __watch_results = [], i = 0, watch_length = watchers.length - 1, result;


        while (i <= watch_length) {
            __watch_results[i] = watchers[i].getValue();
            i++;
        }
        /*jslint evil: true */
        result = eval("var x=" + expression + ";x");
        /*jslint evil: false */

        if (site._attributeTypes[property] != undefined) {
            site["set" + property.capitalize()].apply(site, [result]);
        } else {
            site[property] = result;
        }
    };

    //Create watchers
    while (i <= hosts_length) {
        watchers[i] = core.ChangeWatcher.watch(hosts[i], chains[i], handler, site);
        __watch_results[i] = watchers[i].getValue();
        i++;
    }
    /*jslint evil: true */
    result = eval("var x=" + expression + ";x");
    /*jslint evil: false */
    return result;
};