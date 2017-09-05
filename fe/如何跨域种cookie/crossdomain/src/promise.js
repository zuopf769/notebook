var Promise = (function() {
    var PENDING = 0;
    var FULFILLED = 1;
    var REJECTED = 2;
    var _config = {
        longStackTraces: false
    };

    /*
     * Create a new promise. 
     * The passed in function will receive functions resolve and reject as its arguments 
     * which can be called to seal the fate of the created promise.
     * 
     * The returned promise will be resolved when resolve is called, and rejected when reject called or any exception occurred.
     * If you pass a promise object to the resolve function, the created promise will follow the state of that promise.
     *
     * > This implementation conforms to Promise/A+ spec. see: https://promisesaplus.com/
     * @param {Function(function resolve, function reject)} cb The resolver callback.
     * @return {Promise} A thenable. 
     * @constructor
     * @example
     * var p = new Promise(function(resolve, reject){
     *     true ? resolve('foo') : reject('bar');
     * });
     */
    function Promise(cb) {
        if (!(this instanceof Promise)) {
            throw 'Promise must be called with new operator';
        }
        if (typeof cb !== 'function') {
            throw 'callback not defined';
        }

        this._state = PENDING;
        this._result;
        this._fulfilledCbs = [];
        this._rejectedCbs = [];

        // 标准：Promises/A+ 2.2.4, see https://promisesaplus.com/ 
        // In practice, this requirement ensures that 
        //   onFulfilled and onRejected execute asynchronously, 
        //   after the event loop turn in which then is called, 
        //   and with a fresh stack.
        var self = this;
        setTimeout(function() {
            self._doResolve(cb);
        });
    }

    Promise.prototype._fulfill = function(result) {
        //console.log('_fulfill', result);
        this._result = result;
        this._state = FULFILLED;
        this._flush();
    };

    Promise.prototype._reject = function(err) {
        //console.log('_reject', err);
        if(_config.longStackTraces && err){
            err.stack += '\n' + this._originalStack;
        }
        this._result = err;
        this._state = REJECTED;
        this._flush();
    };

    Promise.prototype._resolve = function(result) {
        //console.log('_resolve', result);
        if (_isThenable(result)) {
            // result.then is un-trusted
            this._doResolve(result.then.bind(result));
        } else {
            this._fulfill(result);
        }
    };

    /*
     * Resolve the un-trusted promise definition function: fn
     * which has exactly the same signature as the .then function
     */
    Promise.prototype._doResolve = function(fn) {
        // ensure resolve/reject called once
        var called = false;
        var self = this;
        try {
            fn(function(result) {
                if (called) return;
                called = true;
                self._resolve(result);
            }, function(err) {
                if (called) return;
                called = true;
                self._reject(err);
            });
        } catch (err) {
            if (called) return;
            called = true;
            self._reject(err);
        }
    };

    Promise.prototype._flush = function() {
        if (this._state === PENDING) {
            return;
        }
        var cbs = this._state === REJECTED ? this._rejectedCbs : this._fulfilledCbs;
        var self = this;
        cbs.forEach(function(callback) {
            if (typeof callback === 'function') {
                callback(self._result);
            }
        });
        this._rejectedCbs = [];
        this._fulfilledCbs = [];
    };

    /*
     * Register a callback on fulfilled or rejected.
     * @param {Function} onFulfilled the callback on fulfilled
     * @param {Function} onRejected the callback on rejected
     * @return {undefined}
     */
    Promise.prototype._done = function(onFulfilled, onRejected) {
        this._fulfilledCbs.push(onFulfilled);
        this._rejectedCbs.push(onRejected);
        this._flush();
    };

    /*
     * The Promise/A+ .then, register a callback on resolve. See: https://promisesaplus.com/
     * @param {Function} cb The callback to be registered.
     * @return {Promise} A thenable.
     */
    Promise.prototype.then = function(onFulfilled, onRejected) {
        var _this = this,
            ret;
        return new Promise(function(resolve, reject) {
            _this._done(function(result) {
                if (typeof onFulfilled === 'function') {
                    try {
                        ret = onFulfilled(result);
                    } catch (e) {
                        return reject(e);
                    }
                    resolve(ret);
                } else {
                    resolve(result);
                }
            }, function(err) {
                if (typeof onRejected === 'function') {
                    try {
                        ret = onRejected(err);
                    } catch (e) {
                        return reject(e);
                    }
                    resolve(ret);
                } else {
                    reject(err);
                }
            });
        });
    };

    /*
     * The Promise/A+ .catch, retister a callback on reject. See: https://promisesaplus.com/
     * @param {Function} cb The callback to be registered.
     * @return {Promise} A thenable.
     */
    Promise.prototype.catch = function(cb) {
        return this.then(function(result) {
            return result;
        }, cb);
    };

    /*
     * 
     * The Promise/A+ .catch, register a callback on either resolve or reject. See: https://promisesaplus.com/
     * @param {Function} cb The callback to be registered.
     * @return {Promise} A thenable.
     */
    Promise.prototype.finally = function(cb) {
        return this.then(cb, cb);
    };

    /*
     * Create a promise that is resolved with the given value. 
     * If value is already a thenable, it is returned as is. 
     * If value is not a thenable, a fulfilled Promise is returned with value as its fulfillment value.
     * @param {Promise<any>|any value} obj The value to be resolved.
     * @return {Promise} A thenable which resolves the given `obj`
     * @static
     */
    Promise.resolve = function(obj) {
        return _isThenable(obj) ? obj :
            new Promise(function(resolve) {
                return resolve(obj);
            });
    };
    /*
     * Create a promise that is rejected with the given error.
     * @param {Error} error The error to reject with.
     * @return {Promise} A thenable which is rejected with the given `error`
     * @static
     */
    Promise.reject = function(err) {
        return new Promise(function(resolve, reject) {
            reject(err);
        });
    };
    /*
     * This method is useful for when you want to wait for more than one promise to complete.
     *
     * Given an Iterable(arrays are Iterable), or a promise of an Iterable, 
     * which produces promises (or a mix of promises and values), 
     * iterate over all the values in the Iterable into an array and return a promise that is fulfilled when 
     * all the items in the array are fulfilled. 
     * The promise's fulfillment value is an array with fulfillment values at respective positions to the original array. 
     * If any promise in the array rejects, the returned promise is rejected with the rejection reason.
     * @param {Iterable<any>|Promise<Iterable<any>>} promises The promises to wait for.
     * @return {Promise} A thenable.
     * @static
     */
    Promise.all = function(promises) {
        return new Promise(function(resolve, reject) {
            var results = promises.map(function() {
                return undefined;
            });
            var count = 0;
            promises
                .map(Promise.resolve)
                .forEach(function(promise, idx) {
                    promise.then(function(result) {
                        results[idx] = result;
                        count++;
                        if (count === promises.length) {
                            resolve(results);
                        }
                    }, reject);
                });
        });
    };

    /*
     * Call functions in serial until someone rejected.
     * @param {Array} iterable the array to iterate with.
     * @param {Array} iteratee returns a new promise.
     * The iteratee is invoked with three arguments: (value, index, iterable). 
     */
    Promise.mapSeries = function(iterable, iteratee) {
        var ret = Promise.resolve('init');
        var result = [];
        iterable.forEach(function(item, idx) {
            ret = ret
                .then(function(){
                    return iteratee(item, idx, iterable);
                })
                .then(function(x){
                    return result.push(x);
                });
        });
        return ret.then(function(){
            return result;
        });
    }

    function _isThenable(obj) {
        return obj && typeof obj.then === 'function';
    }

    return Promise;
})();
