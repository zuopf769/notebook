/**
 * @file Map Data Structure for JavaScript
 *
 * Types of keys supported: String, RegExp
 */

/* eslint-disable no-extend-native */

define(function (require) {

    var _ = require('./underscore');

    /**
     * Map utility
     *
     * @constructor
     */
    function Map() {
        this.size = 0;
        this._data = {};
    }

    /**
     * set key into the map
     *
     * @param {string|RegExp} k the key
     * @param {any} v the value
     * @return {undefined}
     */
    Map.prototype.set = function (k, v) {
        k = fingerprint(k);
        if (!this._data.hasOwnProperty(k)) {
            this._data[k] = v;
            this.size++;
        }

    };

    /**
     * test if the key exists
     *
     * @param {string|RegExp} k the key
     * @param {any} v the value
     * @return {boolean} Returns true if contains k, return false otherwise.
     */
    Map.prototype.has = function (k) {
        k = fingerprint(k);
        return this._data.hasOwnProperty(k);
    };

    /**
     * delete the specified key
     *
     * @param {string|RegExp} k the key
     * @return {undefined}
     */
    Map.prototype.delete = function (k) {
        k = fingerprint(k);
        if (this._data.hasOwnProperty(k)) {
            delete this._data[k];
            this.size--;
        }

    };

    /**
     * get value by key
     *
     * @param {string|RegExp} k the key
     * @return {any} the value associated to k
     */
    Map.prototype.get = function (k) {
        k = fingerprint(k);
        return this._data[k];
    };

    /**
     * clear the map, remove all keys
     *
     * @param {string|RegExp} k the key
     */
    Map.prototype.clear = function (k) {
        this.size = 0;
        this._data = {};
    };

    /**
     * Get string fingerprint for value
     *
     * @private
     * @param {any} value The value to be summarized.
     * @return {string} The fingerprint for the value.
     */
    function fingerprint(value) {
        if (_.isRegExp(value)) {
            return 'reg_' + value;
        }
        if (_.isString(value)) {
            return 'str_' + value;
        }
        return 'other_' + value;
    }

    return Map;
});
