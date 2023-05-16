import axios from 'axios';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return fn;
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);
  privateSet.add(obj);
}

var _queue = /*#__PURE__*/new WeakMap();
var _generateKey = /*#__PURE__*/new WeakSet();
var Pending = /*#__PURE__*/function () {
  function Pending() {
    _classCallCheck(this, Pending);
    /**
     * 生成唯一 key
     * @param {object} config
     * @param {string} config.method
     * @param {string} config.baseURL
     * @param {string} config.url
     * @returns
     */
    _classPrivateMethodInitSpec(this, _generateKey);
    _classPrivateFieldInitSpec(this, _queue, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(this, _queue, new Map());
  }

  /**
   * 加入到队列
   * @param {object} config
   */
  _createClass(Pending, [{
    key: "add",
    value: function add(config) {
      var key = _classPrivateMethodGet(this, _generateKey, _generateKey2).call(this, config);
      var controller = new AbortController();
      if (_classPrivateFieldGet(this, _queue).has(key)) {
        _classPrivateFieldGet(this, _queue).get(key).abort();
      }
      config.signal = controller.signal;
      _classPrivateFieldGet(this, _queue).set(key, controller);
    }

    /**
     * 从队列中移除
     * @param {object} config
     */
  }, {
    key: "remove",
    value: function remove(config) {
      var key = _classPrivateMethodGet(this, _generateKey, _generateKey2).call(this, config);
      if (_classPrivateFieldGet(this, _queue).has(key)) {
        _classPrivateFieldGet(this, _queue)["delete"](key);
      }
    }

    /**
     * 取消所有请求
     */
  }, {
    key: "clear",
    value: function clear() {
      var _this = this;
      _classPrivateFieldGet(this, _queue).forEach(function (controller, key) {
        controller.abort();
        _classPrivateFieldGet(_this, _queue)["delete"](key);
      });
    }
  }]);
  return Pending;
}();
function _generateKey2(config) {
  var method = config.method,
    baseURL = config.baseURL,
    url = config.url;
  return "".concat(method.toLocaleLowerCase(), ".").concat(baseURL).concat(url);
}

function is(val, type) {
  return Object.prototype.toString.call(val).slice(8, -1) === type;
}

/**
 * 是否函数
 * @param {*} val 
 * @returns {boolean}
 */
function isFunction(val) {
  return is(val, 'Function');
}

var _opts = /*#__PURE__*/new WeakMap();
var _axios = /*#__PURE__*/new WeakMap();
var Http = /*#__PURE__*/function () {
  function Http() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Http);
    _classPrivateFieldInitSpec(this, _opts, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _axios, {
      writable: true,
      value: void 0
    });
    var enableAbortController = options.enableAbortController,
      interceptorRequest = options.interceptorRequest,
      interceptorRequestCatch = options.interceptorRequestCatch,
      interceptorResponse = options.interceptorResponse,
      interceptorResponseCatch = options.interceptorResponseCatch;
    _classPrivateFieldSet(this, _opts, _objectSpread2({}, options));
    _classPrivateFieldSet(this, _axios, axios.create(_classPrivateFieldGet(this, _opts)));
    var pending = new Pending();
    _classPrivateFieldGet(this, _axios).interceptors.request.use(function (request) {
      // 取消重复请求
      if (enableAbortController && request.enableAbortController !== false) {
        pending.add(request);
      }
      if (isFunction(interceptorRequest)) {
        interceptorRequest(request);
      }
      return request;
    }, function (err) {
      if (isFunction(interceptorRequestCatch)) {
        interceptorRequestCatch(err);
      }
      return Promise.reject(err);
    });
    _classPrivateFieldGet(this, _axios).interceptors.response.use(function (response) {
      pending.remove(response.config);
      if (isFunction(interceptorResponse)) {
        interceptorResponse(response, pending);
      }
      if (response.data.code === '10000') {
        return response.data;
      }
      return response;
    }, function (err) {
      if (isFunction(interceptorResponseCatch)) {
        interceptorResponseCatch(err);
      }
      return Promise.reject(err);
    });
  }
  _createClass(Http, [{
    key: "store",
    get: function get() {
      return _classPrivateFieldGet(this, _axios);
    }

    /**
     * 请求
     * @param config
     * @returns {Promise<unknown>}
     */
  }, {
    key: "request",
    value: function request() {
      var _this = this;
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new Promise(function (resolve, reject) {
        _classPrivateFieldGet(_this, _axios).request(_objectSpread2({}, config)).then(function (res) {
          resolve(res.data);
        }, function (err) {
          reject(err);
        })["catch"](function (err) {
          reject(err);
        });
      });
    }

    /**
     * POST 请求
     * @param {string} url
     * @param {object} data
     * @param {object} config
     * @returns {Promise<unknown>}
     */
  }, {
    key: "post",
    value: function post() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.request(_objectSpread2({
        method: 'post',
        url: url,
        data: data
      }, config));
    }

    /**
     * GET 请求
     * @param {string} url
     * @param {object} params
     * @param {object} config
     * @returns {Promise<unknown>}
     */
  }, {
    key: "get",
    value: function get() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.request(_objectSpread2({
        method: 'get',
        url: url,
        params: params
      }, config));
    }

    /**
     * DELETE 请求
     * @param {string} url
     * @param {object} data
     * @param config
     * @returns {Promise<unknown>}
     */
  }, {
    key: "delete",
    value: function _delete(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.request(_objectSpread2({
        method: 'delete',
        url: url,
        data: data
      }, config));
    }

    /**
     * PUT 请求
     * @param {string} url
     * @param {object} data
     * @param config
     * @returns {Promise<unknown>}
     */
  }, {
    key: "put",
    value: function put(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.request(_objectSpread2({
        method: 'put',
        url: url,
        data: data
      }, config));
    }

    /**
     * 上传
     * @param {string} url
     * @param {File} formData
     * @param {object} config
     * @returns {Promise<unknown>}
     */
  }, {
    key: "upload",
    value: function upload() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var formData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.post(url, formData, _objectSpread2({
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }, config));
    }

    /**
     * 下载
     * @param {string} url
     * @param {object} config
     * @returns {Promise<unknown>}
     */
  }, {
    key: "download",
    value: function download() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.request(_objectSpread2({
        url: url,
        baseURL: '',
        method: 'get',
        responseType: 'blob'
      }, config));
    }
  }]);
  return Http;
}();

export { Http as default };
