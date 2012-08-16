/**
 *
 * @param {String} name Skin part name
 * @param {Boolean} required Is the skin part required
 * @param {String} className Class name
 * @constructor
 */
core.helpers.SkinPartDefinition = function (name, required, className) {
    this.required = required;
    this.name = name;
    this.className = className;
}