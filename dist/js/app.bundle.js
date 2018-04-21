(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/base64-js/lib/b64.js","/../../node_modules/base64-js/lib")
},{"Wb8Gej":2,"buffer":3}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/browserify/node_modules/process/browser.js","/../../node_modules/browserify/node_modules/process")
},{"Wb8Gej":2,"buffer":3}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/buffer/index.js","/../../node_modules/buffer")
},{"Wb8Gej":2,"base64-js":1,"buffer":3,"ieee754":4}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/ieee754/index.js","/../../node_modules/ieee754")
},{"Wb8Gej":2,"buffer":3}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

angular.module('app.core', ['ngAnimate', 'ngTouch', 'ui.bootstrap']);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb3JlLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZSxVQUFmLEVBQTJCLENBQUMsV0FBRCxFQUFjLFNBQWQsRUFBeUIsY0FBekIsQ0FBM0IiLCJmaWxlIjoiYXBwLmNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYXBwLmNvcmUnLCBbJ25nQW5pbWF0ZScsICduZ1RvdWNoJywgJ3VpLmJvb3RzdHJhcCddKTtcbiJdfQ==
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/app.core.js","/")
},{"Wb8Gej":2,"buffer":3}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

angular.module('angular.old', ['app.core', 'app.services', 'app.routes']);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsQ0FBQyxVQUFELEVBQWEsY0FBYixFQUE2QixZQUE3QixDQUE5QiIsImZpbGUiOiJhcHAubW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FuZ3VsYXIub2xkJywgWydhcHAuY29yZScsICdhcHAuc2VydmljZXMnLCAnYXBwLnJvdXRlcyddKTtcbiJdfQ==
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/app.module.js","/")
},{"Wb8Gej":2,"buffer":3}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

(function () {
    appRoutes.$inject = ["$stateProvider", "$urlRouterProvider"];
    function appRoutes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/profesional');
        $stateProvider.state('profesional', {
            url: '/profesional',
            templateUrl: 'directive/scenes/profile/profile.tpl.html',
            controller: 'profileCtr as vm'
        });
    }

    angular.module('app.routes', ['ui.router']).config(appRoutes);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5yb3V0ZXMuanMiXSwibmFtZXMiOlsiYXBwUm91dGVzIiwiJHN0YXRlUHJvdmlkZXIiLCIkdXJsUm91dGVyUHJvdmlkZXIiLCJ3aGVuIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJhbmd1bGFyIiwibW9kdWxlIiwiY29uZmlnIl0sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBTTtBQUNILGFBQVNBLFNBQVQsQ0FBbUJDLGNBQW5CLEVBQW1DQyxrQkFBbkMsRUFBdUQ7QUFDbkRBLDJCQUFtQkMsSUFBbkIsQ0FBd0IsRUFBeEIsRUFBNEIsY0FBNUI7QUFDQUYsdUJBQ0tHLEtBREwsQ0FDVyxhQURYLEVBQzBCO0FBQ2xCQyxpQkFBSyxjQURhO0FBRWxCQyx5QkFBYSwyQ0FGSztBQUdsQkMsd0JBQVk7QUFITSxTQUQxQjtBQU1IOztBQUVEQyxZQUNLQyxNQURMLENBQ1ksWUFEWixFQUMwQixDQUFDLFdBQUQsQ0FEMUIsRUFFS0MsTUFGTCxDQUVZVixTQUZaO0FBR0gsQ0FkRCIsImZpbGUiOiJhcHAucm91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcbiAgICBmdW5jdGlvbiBhcHBSb3V0ZXMoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignJywgJy9wcm9mZXNpb25hbCcpO1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdwcm9mZXNpb25hbCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZmVzaW9uYWwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZGlyZWN0aXZlL3NjZW5lcy9wcm9maWxlL3Byb2ZpbGUudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwcm9maWxlQ3RyIGFzIHZtJyxcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJ10pXG4gICAgICAgIC5jb25maWcoYXBwUm91dGVzKTtcbn0pKCk7XG4iXX0=
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/app.routes.js","/")
},{"Wb8Gej":2,"buffer":3}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

(function () {
    appSerives.$inject = ["$rootScope", "$http", "BASE_URL"];
    function appSerives($rootScope, $http, BASE_URL) {
        $rootScope.makeRequest = function (method, url) {
            var requestUrl = BASE_URL + '/' + url;

            return $http({
                url: requestUrl,
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };
    }

    angular.module('app.services', []).constant('BASE_URL', 'http://iotator.com/api/v1').run(appSerives);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5zZXJ2aWNlcy5qcyJdLCJuYW1lcyI6WyJhcHBTZXJpdmVzIiwiJHJvb3RTY29wZSIsIiRodHRwIiwiQkFTRV9VUkwiLCJtYWtlUmVxdWVzdCIsIm1ldGhvZCIsInVybCIsInJlcXVlc3RVcmwiLCJoZWFkZXJzIiwiYW5ndWxhciIsIm1vZHVsZSIsImNvbnN0YW50IiwicnVuIl0sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBTTtBQUNILGFBQVNBLFVBQVQsQ0FBb0JDLFVBQXBCLEVBQWdDQyxLQUFoQyxFQUF1Q0MsUUFBdkMsRUFBaUQ7QUFDN0NGLG1CQUFXRyxXQUFYLEdBQXlCLFVBQUNDLE1BQUQsRUFBU0MsR0FBVCxFQUFpQjtBQUN0QyxnQkFBTUMsYUFBZ0JKLFFBQWhCLFNBQTRCRyxHQUFsQzs7QUFFQSxtQkFBT0osTUFBTTtBQUNUSSxxQkFBS0MsVUFESTtBQUVURiw4QkFGUztBQUdURyx5QkFBUztBQUNMLG9DQUFnQjtBQURYO0FBSEEsYUFBTixDQUFQO0FBT0gsU0FWRDtBQVdIOztBQUVEQyxZQUNLQyxNQURMLENBQ1ksY0FEWixFQUM0QixFQUQ1QixFQUVLQyxRQUZMLENBRWMsVUFGZCxFQUUwQiwyQkFGMUIsRUFHS0MsR0FITCxDQUdTWixVQUhUO0FBSUgsQ0FuQkQiLCJmaWxlIjoiYXBwLnNlcnZpY2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcbiAgICBmdW5jdGlvbiBhcHBTZXJpdmVzKCRyb290U2NvcGUsICRodHRwLCBCQVNFX1VSTCkge1xuICAgICAgICAkcm9vdFNjb3BlLm1ha2VSZXF1ZXN0ID0gKG1ldGhvZCwgdXJsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0VXJsID0gYCR7QkFTRV9VUkx9LyR7dXJsfWA7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgdXJsOiByZXF1ZXN0VXJsLFxuICAgICAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pXG4gICAgICAgIC5jb25zdGFudCgnQkFTRV9VUkwnLCAnaHR0cDovL2lvdGF0b3IuY29tL2FwaS92MScpXG4gICAgICAgIC5ydW4oYXBwU2VyaXZlcyk7XG59KSgpO1xuIl19
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/app.services.js","/")
},{"Wb8Gej":2,"buffer":3}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

(function () {
    function footer() {
        return {
            restrict: 'A',
            templateUrl: 'directive/components/footer/footer.tpl.html'
        };
    }

    angular.module('angular.old').directive('footer', footer);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci5kaXIuanMiXSwibmFtZXMiOlsiZm9vdGVyIiwicmVzdHJpY3QiLCJ0ZW1wbGF0ZVVybCIsImFuZ3VsYXIiLCJtb2R1bGUiLCJkaXJlY3RpdmUiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxZQUFNO0FBQ0gsYUFBU0EsTUFBVCxHQUFrQjtBQUNkLGVBQU87QUFDSEMsc0JBQVUsR0FEUDtBQUVIQyx5QkFBYTtBQUZWLFNBQVA7QUFJSDs7QUFFREMsWUFDS0MsTUFETCxDQUNZLGFBRFosRUFFS0MsU0FGTCxDQUVlLFFBRmYsRUFFeUJMLE1BRnpCO0FBR0gsQ0FYRCIsImZpbGUiOiJmb290ZXIuZGlyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcbiAgICBmdW5jdGlvbiBmb290ZXIoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdkaXJlY3RpdmUvY29tcG9uZW50cy9mb290ZXIvZm9vdGVyLnRwbC5odG1sJyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FuZ3VsYXIub2xkJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnZm9vdGVyJywgZm9vdGVyKTtcbn0pKCk7XG4iXX0=
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/components/footer/footer.dir.js","/components/footer")
},{"Wb8Gej":2,"buffer":3}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

(function () {
    navigation.$inject = ["$window"];
    function navigation($window) {
        function templateUrlHandler() {
            var isMobile = $window.innerWidth <= 992;

            if (isMobile) {
                return 'directive/components/navigation/sidebar.tpl.html';
            }
            return 'directive/components/navigation/navigation.tpl.html';
        }

        function navigationCtr() {
            var vm = this;

            vm.isOpen = false;
        }

        return {
            restrict: 'A',
            templateUrl: templateUrlHandler,
            controller: navigationCtr,
            controllerAs: 'vm'
        };
    }

    angular.module('angular.old').directive('navigation', navigation);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5hdmlnYXRpb24uZGlyLmpzIl0sIm5hbWVzIjpbIm5hdmlnYXRpb24iLCIkd2luZG93IiwidGVtcGxhdGVVcmxIYW5kbGVyIiwiaXNNb2JpbGUiLCJpbm5lcldpZHRoIiwibmF2aWdhdGlvbkN0ciIsInZtIiwiaXNPcGVuIiwicmVzdHJpY3QiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJjb250cm9sbGVyQXMiLCJhbmd1bGFyIiwibW9kdWxlIiwiZGlyZWN0aXZlIl0sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBTTtBQUNILGFBQVNBLFVBQVQsQ0FBb0JDLE9BQXBCLEVBQTZCO0FBQ3pCLGlCQUFTQyxrQkFBVCxHQUE4QjtBQUMxQixnQkFBTUMsV0FBV0YsUUFBUUcsVUFBUixJQUFzQixHQUF2Qzs7QUFFQSxnQkFBSUQsUUFBSixFQUFjO0FBQ1YsdUJBQU8sa0RBQVA7QUFDSDtBQUNELG1CQUFPLHFEQUFQO0FBQ0g7O0FBRUQsaUJBQVNFLGFBQVQsR0FBeUI7QUFDckIsZ0JBQU1DLEtBQUssSUFBWDs7QUFFQUEsZUFBR0MsTUFBSCxHQUFZLEtBQVo7QUFDSDs7QUFFRCxlQUFPO0FBQ0hDLHNCQUFVLEdBRFA7QUFFSEMseUJBQWFQLGtCQUZWO0FBR0hRLHdCQUFZTCxhQUhUO0FBSUhNLDBCQUFjO0FBSlgsU0FBUDtBQU1IOztBQUVEQyxZQUNLQyxNQURMLENBQ1ksYUFEWixFQUVLQyxTQUZMLENBRWUsWUFGZixFQUU2QmQsVUFGN0I7QUFHSCxDQTVCRCIsImZpbGUiOiJuYXZpZ2F0aW9uLmRpci5qcyIsInNvdXJjZXNDb250ZW50IjpbIigoKSA9PiB7XG4gICAgZnVuY3Rpb24gbmF2aWdhdGlvbigkd2luZG93KSB7XG4gICAgICAgIGZ1bmN0aW9uIHRlbXBsYXRlVXJsSGFuZGxlcigpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTW9iaWxlID0gJHdpbmRvdy5pbm5lcldpZHRoIDw9IDk5MjtcblxuICAgICAgICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdkaXJlY3RpdmUvY29tcG9uZW50cy9uYXZpZ2F0aW9uL3NpZGViYXIudHBsLmh0bWwnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICdkaXJlY3RpdmUvY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24udHBsLmh0bWwnO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbmF2aWdhdGlvbkN0cigpIHtcbiAgICAgICAgICAgIGNvbnN0IHZtID0gdGhpcztcblxuICAgICAgICAgICAgdm0uaXNPcGVuID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZVVybEhhbmRsZXIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBuYXZpZ2F0aW9uQ3RyLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYW5ndWxhci5vbGQnKVxuICAgICAgICAuZGlyZWN0aXZlKCduYXZpZ2F0aW9uJywgbmF2aWdhdGlvbik7XG59KSgpO1xuIl19
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/components/navigation/navigation.dir.js","/components/navigation")
},{"Wb8Gej":2,"buffer":3}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

require('./app.module');

require('./app.core');

require('./app.routes');

require('./app.services');

require('./scenes/profile/profile.ctr');

require('./scenes/profile/profile.fac');

require('./components/navigation/navigation.dir');

require('./scenes/profile/profile.dir');

require('./components/footer/footer.dir');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfZjQ0Y2YzNGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7QUFHQTs7QUFHQTs7QUFDQTs7QUFDQSIsImZpbGUiOiJmYWtlX2Y0NGNmMzRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbW9kdWxlc1xuaW1wb3J0ICcuL2FwcC5tb2R1bGUnO1xuaW1wb3J0ICcuL2FwcC5jb3JlJztcbmltcG9ydCAnLi9hcHAucm91dGVzJztcbmltcG9ydCAnLi9hcHAuc2VydmljZXMnO1xuXG4vLyBjb250cm9sbGVyc1xuaW1wb3J0ICcuL3NjZW5lcy9wcm9maWxlL3Byb2ZpbGUuY3RyJztcblxuLy8gc2VydmljZXNcbmltcG9ydCAnLi9zY2VuZXMvcHJvZmlsZS9wcm9maWxlLmZhYyc7XG5cbi8vIGRpcmVjdGl2ZXNcbmltcG9ydCAnLi9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5kaXInO1xuaW1wb3J0ICcuL3NjZW5lcy9wcm9maWxlL3Byb2ZpbGUuZGlyJztcbmltcG9ydCAnLi9jb21wb25lbnRzL2Zvb3Rlci9mb290ZXIuZGlyJztcbiJdfQ==
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_f44cf34a.js","/")
},{"./app.core":5,"./app.module":6,"./app.routes":7,"./app.services":8,"./components/footer/footer.dir":9,"./components/navigation/navigation.dir":10,"./scenes/profile/profile.ctr":12,"./scenes/profile/profile.dir":13,"./scenes/profile/profile.fac":14,"Wb8Gej":2,"buffer":3}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

(function () {
    profileCtr.$inject = ["$rootScope", "$scope", "profileFac"];
    function profileCtr($rootScope, $scope, profileFac) {
        var vm = this;

        $scope.callNow = function ($event) {
            var target = $event.target;

            var number = angular.element(target).attr('number');
            angular.element(target).text(number);
            angular.element(target).attr('href', 'tel:' + number);
        };

        profileFac.getProfile.then(function (response) {
            vm.profile = response.data.data;
            vm.tabs = [{
                id: 0,
                title: 'About',
                text: 'Sunt ipsum sit mollit non occaecat reprehenderit quis id. Do deserunt commodo magna est sunt elit aliqua labore. Eiusmod sunt eiusmod veniam sunt dolor commodo anim aliquip ex sunt. Aliqua ea Lorem magna commodo laboris nisi duis. Laboris occaecat officia consectetur consequat est dolor. Cupidatat anim sit et Lorem ut ut anim reprehenderit esse.'
            }, {
                id: 1,
                title: 'Projects',
                text: 'Occaecat ad eiusmod eiusmod culpa aliquip adipisicing magna exercitation non. Non velit Lorem in duis reprehenderit cillum. Nostrud do amet elit fugiat minim fugiat sit sunt occaecat veniam enim. Est magna eiusmod id sunt occaecat magna sunt deserunt pariatur aliquip excepteur.'
            }, {
                id: 2,
                title: 'Reviews',
                text: 'Tempor velit nulla id sint enim sit fugiat excepteur minim mollit esse eu ex dolore. Veniam exercitation cupidatat ex qui. Reprehenderit sit nostrud id nulla eiusmod proident. Esse amet exercitation qui nisi eiusmod voluptate non. Qui laborum velit sit anim consectetur. Cupidatat qui laborum ut ipsum elit eiusmod ut ad incididunt in adipisicing enim.'
            }];
            vm.projects = {
                cards: [{
                    img: 'images/p1.png',
                    title: 'Project Title 1',
                    photos_count: 3
                }, {
                    img: 'images/p2.png',
                    title: 'Project Title 2',
                    photos_count: 4
                }, {
                    img: 'images/p3.png',
                    title: 'Project Title 3',
                    photos_count: 5
                }, {
                    img: 'images/p4.png',
                    title: 'Project Title 4',
                    photos_count: 6
                }, {
                    img: 'images/p5.png',
                    title: 'Project Title 5',
                    photos_count: 7
                }, {
                    img: 'images/p6.png',
                    title: 'Project Title 6',
                    photos_count: 8
                }],
                services: [{
                    title: 'Profesional Categories in Selden',
                    body: 'Selden Driveway Instalation & Maintenance . Selden Fence Contractors . Selden Fireplaces . Selden Garage Door Sales.Selden Glass & Shower Door Dealers .Selden Handyman .Selden Hardwood Flooring Dealers . Selden Hot Tub & Spa Dealers.Selden Kitchen & Bath Fixtures.Selden Lighting'
                }, {
                    title: 'Hardwood Flooring Dealers &amp; Installers near Selden',
                    body: 'Setauket-East Setauket Hardwood Flooring Dealers &amp; Installers . Kings Park Hardwood Flooring Dealers &amp; Installers . East Islip Hardwood Flooring Dealers & Installers .Stony Brook Hardwood Flooring Dealers & Installers . Saint James Hardwood Flooring Dealers & Installers .Ridge Hardwood Flooring Dealers & Installers .Nesconset Hardwood Flooring Dealers & Installers . Mastic Beach Hardwood Flooring Dealers & Installers .Terryville Hardwood Flooring Dealers & Installers . Patchogue Hardwood Flooring Dealers & Installers'
                }]
            };
            vm.reviews = [{
                img: 'images/logo_tumblr_22.png',
                name: 'Andra Martin',
                rate: '2',
                comment: 'Dolor laboris velit dolor in mollit ex sit nisi cupidatat nisi ullamco et amet consectetur.'
            }, {
                img: 'images/logo_tumblr_22.png',
                name: 'John Doe',
                rate: '3',
                comment: 'Exercitation occaecat veniam ea exercitation laborum nisi ad do cupidatat cupidatat aliquip.'
            }, {
                img: 'images/logo_tumblr_22.png',
                name: 'Andrew Matt',
                rate: '4',
                comment: 'Pariatur adipisicing anim irure adipisicing ea et commodo dolor eiusmod amet.'
            }, {
                img: 'images/logo_tumblr_22.png',
                name: 'Matt Orto',
                rate: '5',
                comment: 'Exercitation anim laboris cupidatat anim ea mollit sit.'
            }];
        }).catch(function (error) {
            console.log(error);
        });
    }

    angular.module('angular.old').controller('profileCtr', profileCtr);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUuY3RyLmpzIl0sIm5hbWVzIjpbInByb2ZpbGVDdHIiLCIkcm9vdFNjb3BlIiwiJHNjb3BlIiwicHJvZmlsZUZhYyIsInZtIiwiY2FsbE5vdyIsIiRldmVudCIsInRhcmdldCIsIm51bWJlciIsImFuZ3VsYXIiLCJlbGVtZW50IiwiYXR0ciIsInRleHQiLCJnZXRQcm9maWxlIiwidGhlbiIsInJlc3BvbnNlIiwicHJvZmlsZSIsImRhdGEiLCJ0YWJzIiwiaWQiLCJ0aXRsZSIsInByb2plY3RzIiwiY2FyZHMiLCJpbWciLCJwaG90b3NfY291bnQiLCJzZXJ2aWNlcyIsImJvZHkiLCJyZXZpZXdzIiwibmFtZSIsInJhdGUiLCJjb21tZW50IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJtb2R1bGUiLCJjb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBTTtBQUNILGFBQVNBLFVBQVQsQ0FBb0JDLFVBQXBCLEVBQWdDQyxNQUFoQyxFQUF3Q0MsVUFBeEMsRUFBb0Q7QUFDaEQsWUFBTUMsS0FBSyxJQUFYOztBQUVBRixlQUFPRyxPQUFQLEdBQWlCLFVBQUNDLE1BQUQsRUFBWTtBQUFBLGdCQUNqQkMsTUFEaUIsR0FDTkQsTUFETSxDQUNqQkMsTUFEaUI7O0FBRXpCLGdCQUFNQyxTQUFTQyxRQUFRQyxPQUFSLENBQWdCSCxNQUFoQixFQUF3QkksSUFBeEIsQ0FBNkIsUUFBN0IsQ0FBZjtBQUNBRixvQkFBUUMsT0FBUixDQUFnQkgsTUFBaEIsRUFBd0JLLElBQXhCLENBQTZCSixNQUE3QjtBQUNBQyxvQkFBUUMsT0FBUixDQUFnQkgsTUFBaEIsRUFBd0JJLElBQXhCLENBQTZCLE1BQTdCLFdBQTRDSCxNQUE1QztBQUNILFNBTEQ7O0FBT0FMLG1CQUFXVSxVQUFYLENBQXNCQyxJQUF0QixDQUEyQixVQUFDQyxRQUFELEVBQWM7QUFDckNYLGVBQUdZLE9BQUgsR0FBYUQsU0FBU0UsSUFBVCxDQUFjQSxJQUEzQjtBQUNBYixlQUFHYyxJQUFILEdBQVUsQ0FDTjtBQUNJQyxvQkFBSSxDQURSO0FBRUlDLHVCQUFPLE9BRlg7QUFHSVIsc0JBQU07QUFIVixhQURNLEVBTU47QUFDSU8sb0JBQUksQ0FEUjtBQUVJQyx1QkFBTyxVQUZYO0FBR0lSLHNCQUFNO0FBSFYsYUFOTSxFQVdOO0FBQ0lPLG9CQUFJLENBRFI7QUFFSUMsdUJBQU8sU0FGWDtBQUdJUixzQkFBTTtBQUhWLGFBWE0sQ0FBVjtBQWlCQVIsZUFBR2lCLFFBQUgsR0FBYztBQUNWQyx1QkFBTyxDQUNIO0FBQ0lDLHlCQUFLLGVBRFQ7QUFFSUgsMkJBQU8saUJBRlg7QUFHSUksa0NBQWM7QUFIbEIsaUJBREcsRUFNSDtBQUNJRCx5QkFBSyxlQURUO0FBRUlILDJCQUFPLGlCQUZYO0FBR0lJLGtDQUFjO0FBSGxCLGlCQU5HLEVBV0g7QUFDSUQseUJBQUssZUFEVDtBQUVJSCwyQkFBTyxpQkFGWDtBQUdJSSxrQ0FBYztBQUhsQixpQkFYRyxFQWdCSDtBQUNJRCx5QkFBSyxlQURUO0FBRUlILDJCQUFPLGlCQUZYO0FBR0lJLGtDQUFjO0FBSGxCLGlCQWhCRyxFQXFCSDtBQUNJRCx5QkFBSyxlQURUO0FBRUlILDJCQUFPLGlCQUZYO0FBR0lJLGtDQUFjO0FBSGxCLGlCQXJCRyxFQTBCSDtBQUNJRCx5QkFBSyxlQURUO0FBRUlILDJCQUFPLGlCQUZYO0FBR0lJLGtDQUFjO0FBSGxCLGlCQTFCRyxDQURHO0FBaUNWQywwQkFBVSxDQUNOO0FBQ0lMLDJCQUFPLGtDQURYO0FBRUlNLDBCQUFNO0FBRlYsaUJBRE0sRUFLTjtBQUNJTiwyQkFBTyx3REFEWDtBQUVJTSwwQkFBTTtBQUZWLGlCQUxNO0FBakNBLGFBQWQ7QUE0Q0F0QixlQUFHdUIsT0FBSCxHQUFhLENBQ1Q7QUFDSUoscUJBQUssMkJBRFQ7QUFFSUssc0JBQU0sY0FGVjtBQUdJQyxzQkFBTSxHQUhWO0FBSUlDLHlCQUFTO0FBSmIsYUFEUyxFQU9UO0FBQ0lQLHFCQUFLLDJCQURUO0FBRUlLLHNCQUFNLFVBRlY7QUFHSUMsc0JBQU0sR0FIVjtBQUlJQyx5QkFBUztBQUpiLGFBUFMsRUFhVDtBQUNJUCxxQkFBSywyQkFEVDtBQUVJSyxzQkFBTSxhQUZWO0FBR0lDLHNCQUFNLEdBSFY7QUFJSUMseUJBQVM7QUFKYixhQWJTLEVBbUJUO0FBQ0lQLHFCQUFLLDJCQURUO0FBRUlLLHNCQUFNLFdBRlY7QUFHSUMsc0JBQU0sR0FIVjtBQUlJQyx5QkFBUztBQUpiLGFBbkJTLENBQWI7QUEwQkgsU0F6RkQsRUF5RkdDLEtBekZILENBeUZTLFVBQUNDLEtBQUQsRUFBVztBQUNoQkMsb0JBQVFDLEdBQVIsQ0FBWUYsS0FBWjtBQUNILFNBM0ZEO0FBNEZIOztBQUVEdkIsWUFDSzBCLE1BREwsQ0FDWSxhQURaLEVBRUtDLFVBRkwsQ0FFZ0IsWUFGaEIsRUFFOEJwQyxVQUY5QjtBQUdILENBNUdEIiwiZmlsZSI6InByb2ZpbGUuY3RyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcbiAgICBmdW5jdGlvbiBwcm9maWxlQ3RyKCRyb290U2NvcGUsICRzY29wZSwgcHJvZmlsZUZhYykge1xuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLmNhbGxOb3cgPSAoJGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHRhcmdldCB9ID0gJGV2ZW50O1xuICAgICAgICAgICAgY29uc3QgbnVtYmVyID0gYW5ndWxhci5lbGVtZW50KHRhcmdldCkuYXR0cignbnVtYmVyJyk7XG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGFyZ2V0KS50ZXh0KG51bWJlcik7XG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGFyZ2V0KS5hdHRyKCdocmVmJywgYHRlbDoke251bWJlcn1gKTtcbiAgICAgICAgfTtcblxuICAgICAgICBwcm9maWxlRmFjLmdldFByb2ZpbGUudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHZtLnByb2ZpbGUgPSByZXNwb25zZS5kYXRhLmRhdGE7XG4gICAgICAgICAgICB2bS50YWJzID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQWJvdXQnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnU3VudCBpcHN1bSBzaXQgbW9sbGl0IG5vbiBvY2NhZWNhdCByZXByZWhlbmRlcml0IHF1aXMgaWQuIERvIGRlc2VydW50IGNvbW1vZG8gbWFnbmEgZXN0IHN1bnQgZWxpdCBhbGlxdWEgbGFib3JlLiBFaXVzbW9kIHN1bnQgZWl1c21vZCB2ZW5pYW0gc3VudCBkb2xvciBjb21tb2RvIGFuaW0gYWxpcXVpcCBleCBzdW50LiBBbGlxdWEgZWEgTG9yZW0gbWFnbmEgY29tbW9kbyBsYWJvcmlzIG5pc2kgZHVpcy4gTGFib3JpcyBvY2NhZWNhdCBvZmZpY2lhIGNvbnNlY3RldHVyIGNvbnNlcXVhdCBlc3QgZG9sb3IuIEN1cGlkYXRhdCBhbmltIHNpdCBldCBMb3JlbSB1dCB1dCBhbmltIHJlcHJlaGVuZGVyaXQgZXNzZS4nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogMSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9qZWN0cycsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdPY2NhZWNhdCBhZCBlaXVzbW9kIGVpdXNtb2QgY3VscGEgYWxpcXVpcCBhZGlwaXNpY2luZyBtYWduYSBleGVyY2l0YXRpb24gbm9uLiBOb24gdmVsaXQgTG9yZW0gaW4gZHVpcyByZXByZWhlbmRlcml0IGNpbGx1bS4gTm9zdHJ1ZCBkbyBhbWV0IGVsaXQgZnVnaWF0IG1pbmltIGZ1Z2lhdCBzaXQgc3VudCBvY2NhZWNhdCB2ZW5pYW0gZW5pbS4gRXN0IG1hZ25hIGVpdXNtb2QgaWQgc3VudCBvY2NhZWNhdCBtYWduYSBzdW50IGRlc2VydW50IHBhcmlhdHVyIGFsaXF1aXAgZXhjZXB0ZXVyLicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Jldmlld3MnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnVGVtcG9yIHZlbGl0IG51bGxhIGlkIHNpbnQgZW5pbSBzaXQgZnVnaWF0IGV4Y2VwdGV1ciBtaW5pbSBtb2xsaXQgZXNzZSBldSBleCBkb2xvcmUuIFZlbmlhbSBleGVyY2l0YXRpb24gY3VwaWRhdGF0IGV4IHF1aS4gUmVwcmVoZW5kZXJpdCBzaXQgbm9zdHJ1ZCBpZCBudWxsYSBlaXVzbW9kIHByb2lkZW50LiBFc3NlIGFtZXQgZXhlcmNpdGF0aW9uIHF1aSBuaXNpIGVpdXNtb2Qgdm9sdXB0YXRlIG5vbi4gUXVpIGxhYm9ydW0gdmVsaXQgc2l0IGFuaW0gY29uc2VjdGV0dXIuIEN1cGlkYXRhdCBxdWkgbGFib3J1bSB1dCBpcHN1bSBlbGl0IGVpdXNtb2QgdXQgYWQgaW5jaWRpZHVudCBpbiBhZGlwaXNpY2luZyBlbmltLicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICB2bS5wcm9qZWN0cyA9IHtcbiAgICAgICAgICAgICAgICBjYXJkczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6ICdpbWFnZXMvcDEucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvamVjdCBUaXRsZSAxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBob3Rvc19jb3VudDogMyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiAnaW1hZ2VzL3AyLnBuZycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2plY3QgVGl0bGUgMicsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaG90b3NfY291bnQ6IDQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogJ2ltYWdlcy9wMy5wbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9qZWN0IFRpdGxlIDMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGhvdG9zX2NvdW50OiA1LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWc6ICdpbWFnZXMvcDQucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvamVjdCBUaXRsZSA0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBob3Rvc19jb3VudDogNixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1nOiAnaW1hZ2VzL3A1LnBuZycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2plY3QgVGl0bGUgNScsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaG90b3NfY291bnQ6IDcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZzogJ2ltYWdlcy9wNi5wbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9qZWN0IFRpdGxlIDYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGhvdG9zX2NvdW50OiA4LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgc2VydmljZXM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9mZXNpb25hbCBDYXRlZ29yaWVzIGluIFNlbGRlbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiAnU2VsZGVuIERyaXZld2F5IEluc3RhbGF0aW9uICYgTWFpbnRlbmFuY2UgLiBTZWxkZW4gRmVuY2UgQ29udHJhY3RvcnMgLiBTZWxkZW4gRmlyZXBsYWNlcyAuIFNlbGRlbiBHYXJhZ2UgRG9vciBTYWxlcy5TZWxkZW4gR2xhc3MgJiBTaG93ZXIgRG9vciBEZWFsZXJzIC5TZWxkZW4gSGFuZHltYW4gLlNlbGRlbiBIYXJkd29vZCBGbG9vcmluZyBEZWFsZXJzIC4gU2VsZGVuIEhvdCBUdWIgJiBTcGEgRGVhbGVycy5TZWxkZW4gS2l0Y2hlbiAmIEJhdGggRml4dHVyZXMuU2VsZGVuIExpZ2h0aW5nJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdIYXJkd29vZCBGbG9vcmluZyBEZWFsZXJzICZhbXA7IEluc3RhbGxlcnMgbmVhciBTZWxkZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogJ1NldGF1a2V0LUVhc3QgU2V0YXVrZXQgSGFyZHdvb2QgRmxvb3JpbmcgRGVhbGVycyAmYW1wOyBJbnN0YWxsZXJzIC4gS2luZ3MgUGFyayBIYXJkd29vZCBGbG9vcmluZyBEZWFsZXJzICZhbXA7IEluc3RhbGxlcnMgLiBFYXN0IElzbGlwIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC5TdG9ueSBCcm9vayBIYXJkd29vZCBGbG9vcmluZyBEZWFsZXJzICYgSW5zdGFsbGVycyAuIFNhaW50IEphbWVzIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC5SaWRnZSBIYXJkd29vZCBGbG9vcmluZyBEZWFsZXJzICYgSW5zdGFsbGVycyAuTmVzY29uc2V0IEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC4gTWFzdGljIEJlYWNoIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC5UZXJyeXZpbGxlIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC4gUGF0Y2hvZ3VlIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZtLnJldmlld3MgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbWc6ICdpbWFnZXMvbG9nb190dW1ibHJfMjIucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FuZHJhIE1hcnRpbicsXG4gICAgICAgICAgICAgICAgICAgIHJhdGU6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudDogJ0RvbG9yIGxhYm9yaXMgdmVsaXQgZG9sb3IgaW4gbW9sbGl0IGV4IHNpdCBuaXNpIGN1cGlkYXRhdCBuaXNpIHVsbGFtY28gZXQgYW1ldCBjb25zZWN0ZXR1ci4nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbWc6ICdpbWFnZXMvbG9nb190dW1ibHJfMjIucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0pvaG4gRG9lJyxcbiAgICAgICAgICAgICAgICAgICAgcmF0ZTogJzMnLFxuICAgICAgICAgICAgICAgICAgICBjb21tZW50OiAnRXhlcmNpdGF0aW9uIG9jY2FlY2F0IHZlbmlhbSBlYSBleGVyY2l0YXRpb24gbGFib3J1bSBuaXNpIGFkIGRvIGN1cGlkYXRhdCBjdXBpZGF0YXQgYWxpcXVpcC4nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbWc6ICdpbWFnZXMvbG9nb190dW1ibHJfMjIucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FuZHJldyBNYXR0JyxcbiAgICAgICAgICAgICAgICAgICAgcmF0ZTogJzQnLFxuICAgICAgICAgICAgICAgICAgICBjb21tZW50OiAnUGFyaWF0dXIgYWRpcGlzaWNpbmcgYW5pbSBpcnVyZSBhZGlwaXNpY2luZyBlYSBldCBjb21tb2RvIGRvbG9yIGVpdXNtb2QgYW1ldC4nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbWc6ICdpbWFnZXMvbG9nb190dW1ibHJfMjIucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ01hdHQgT3J0bycsXG4gICAgICAgICAgICAgICAgICAgIHJhdGU6ICc1JyxcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudDogJ0V4ZXJjaXRhdGlvbiBhbmltIGxhYm9yaXMgY3VwaWRhdGF0IGFuaW0gZWEgbW9sbGl0IHNpdC4nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhbmd1bGFyLm9sZCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdwcm9maWxlQ3RyJywgcHJvZmlsZUN0cik7XG59KSgpO1xuIl19
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/scenes/profile/profile.ctr.js","/scenes/profile")
},{"Wb8Gej":2,"buffer":3}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

(function () {
    function profile() {
        return {
            restrict: 'A',
            templateUrl: 'directive/scenes/profile/profile.tpl.html'
        };
    }

    angular.module('angular.old').directive('profile', profile);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUuZGlyLmpzIl0sIm5hbWVzIjpbInByb2ZpbGUiLCJyZXN0cmljdCIsInRlbXBsYXRlVXJsIiwiYW5ndWxhciIsIm1vZHVsZSIsImRpcmVjdGl2ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFlBQU07QUFDSCxhQUFTQSxPQUFULEdBQW1CO0FBQ2YsZUFBTztBQUNIQyxzQkFBVSxHQURQO0FBRUhDLHlCQUFhO0FBRlYsU0FBUDtBQUlIOztBQUVEQyxZQUNLQyxNQURMLENBQ1ksYUFEWixFQUVLQyxTQUZMLENBRWUsU0FGZixFQUUwQkwsT0FGMUI7QUFHSCxDQVhEIiwiZmlsZSI6InByb2ZpbGUuZGlyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcbiAgICBmdW5jdGlvbiBwcm9maWxlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZGlyZWN0aXZlL3NjZW5lcy9wcm9maWxlL3Byb2ZpbGUudHBsLmh0bWwnLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYW5ndWxhci5vbGQnKVxuICAgICAgICAuZGlyZWN0aXZlKCdwcm9maWxlJywgcHJvZmlsZSk7XG59KSgpO1xuIl19
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/scenes/profile/profile.dir.js","/scenes/profile")
},{"Wb8Gej":2,"buffer":3}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

(function () {
    angular.module('app.services').factory('profileFac', ["$rootScope", function ($rootScope) {
        function getProfile() {
            return $rootScope.makeRequest('GET', 'profile/1');
        }

        return {
            getProfile: getProfile()
        };
    }]);
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUuZmFjLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJmYWN0b3J5IiwiJHJvb3RTY29wZSIsImdldFByb2ZpbGUiLCJtYWtlUmVxdWVzdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFlBQU07QUFDSEEsWUFDS0MsTUFETCxDQUNZLGNBRFosRUFFS0MsT0FGTCxDQUVhLFlBRmIsRUFFMkIsVUFBQ0MsVUFBRCxFQUFnQjtBQUNuQyxpQkFBU0MsVUFBVCxHQUFzQjtBQUNsQixtQkFBT0QsV0FBV0UsV0FBWCxDQUF1QixLQUF2QixFQUE4QixXQUE5QixDQUFQO0FBQ0g7O0FBRUQsZUFBTztBQUNIRCx3QkFBWUE7QUFEVCxTQUFQO0FBR0gsS0FWTDtBQVdILENBWkQiLCJmaWxlIjoicHJvZmlsZS5mYWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoKCkgPT4ge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnNlcnZpY2VzJylcbiAgICAgICAgLmZhY3RvcnkoJ3Byb2ZpbGVGYWMnLCAoJHJvb3RTY29wZSkgPT4ge1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UHJvZmlsZSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS5tYWtlUmVxdWVzdCgnR0VUJywgJ3Byb2ZpbGUvMScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldFByb2ZpbGU6IGdldFByb2ZpbGUoKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufSkoKTtcbiJdfQ==
}).call(this,require("Wb8Gej"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/scenes/profile/profile.fac.js","/scenes/profile")
},{"Wb8Gej":2,"buffer":3}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3plcm90b29uZS9Eb2N1bWVudHMvbGVhcm4tYW5ndWxhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvemVyb3Rvb25lL0RvY3VtZW50cy9sZWFybi1hbmd1bGFyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIi9ob21lL3plcm90b29uZS9Eb2N1bWVudHMvbGVhcm4tYW5ndWxhci9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvemVyb3Rvb25lL0RvY3VtZW50cy9sZWFybi1hbmd1bGFyL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCIvaG9tZS96ZXJvdG9vbmUvRG9jdW1lbnRzL2xlYXJuLWFuZ3VsYXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvaG9tZS96ZXJvdG9vbmUvRG9jdW1lbnRzL2xlYXJuLWFuZ3VsYXIvc3JjL2FwcC9hcHAuY29yZS5qcyIsIi9ob21lL3plcm90b29uZS9Eb2N1bWVudHMvbGVhcm4tYW5ndWxhci9zcmMvYXBwL2FwcC5tb2R1bGUuanMiLCIvaG9tZS96ZXJvdG9vbmUvRG9jdW1lbnRzL2xlYXJuLWFuZ3VsYXIvc3JjL2FwcC9hcHAucm91dGVzLmpzIiwiL2hvbWUvemVyb3Rvb25lL0RvY3VtZW50cy9sZWFybi1hbmd1bGFyL3NyYy9hcHAvYXBwLnNlcnZpY2VzLmpzIiwiL2hvbWUvemVyb3Rvb25lL0RvY3VtZW50cy9sZWFybi1hbmd1bGFyL3NyYy9hcHAvY29tcG9uZW50cy9mb290ZXIvZm9vdGVyLmRpci5qcyIsIi9ob21lL3plcm90b29uZS9Eb2N1bWVudHMvbGVhcm4tYW5ndWxhci9zcmMvYXBwL2NvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmRpci5qcyIsIi9ob21lL3plcm90b29uZS9Eb2N1bWVudHMvbGVhcm4tYW5ndWxhci9zcmMvYXBwL2Zha2VfZjQ0Y2YzNGEuanMiLCIvaG9tZS96ZXJvdG9vbmUvRG9jdW1lbnRzL2xlYXJuLWFuZ3VsYXIvc3JjL2FwcC9zY2VuZXMvcHJvZmlsZS9wcm9maWxlLmN0ci5qcyIsIi9ob21lL3plcm90b29uZS9Eb2N1bWVudHMvbGVhcm4tYW5ndWxhci9zcmMvYXBwL3NjZW5lcy9wcm9maWxlL3Byb2ZpbGUuZGlyLmpzIiwiL2hvbWUvemVyb3Rvb25lL0RvY3VtZW50cy9sZWFybi1hbmd1bGFyL3NyYy9hcHAvc2NlbmVzL3Byb2ZpbGUvcHJvZmlsZS5mYWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJXYjhHZWpcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIldiOEdlalwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiV2I4R2VqXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9idWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiV2I4R2VqXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5jb3JlJywgWyduZ0FuaW1hdGUnLCAnbmdUb3VjaCcsICd1aS5ib290c3RyYXAnXSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbUZ3Y0M1amIzSmxMbXB6SWwwc0ltNWhiV1Z6SWpwYkltRnVaM1ZzWVhJaUxDSnRiMlIxYkdVaVhTd2liV0Z3Y0dsdVozTWlPaUk3TzBGQlFVRkJMRkZCUVZGRExFMUJRVklzUTBGQlpTeFZRVUZtTEVWQlFUSkNMRU5CUVVNc1YwRkJSQ3hGUVVGakxGTkJRV1FzUlVGQmVVSXNZMEZCZWtJc1EwRkJNMElpTENKbWFXeGxJam9pWVhCd0xtTnZjbVV1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmhibWQxYkdGeUxtMXZaSFZzWlNnbllYQndMbU52Y21VbkxDQmJKMjVuUVc1cGJXRjBaU2NzSUNkdVoxUnZkV05vSnl3Z0ozVnBMbUp2YjNSemRISmhjQ2RkS1R0Y2JpSmRmUT09XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIldiOEdlalwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2FwcC5jb3JlLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYW5ndWxhci5vbGQnLCBbJ2FwcC5jb3JlJywgJ2FwcC5zZXJ2aWNlcycsICdhcHAucm91dGVzJ10pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Gd2NDNXRiMlIxYkdVdWFuTWlYU3dpYm1GdFpYTWlPbHNpWVc1bmRXeGhjaUlzSW0xdlpIVnNaU0pkTENKdFlYQndhVzVuY3lJNklqczdRVUZCUVVFc1VVRkJVVU1zVFVGQlVpeERRVUZsTEdGQlFXWXNSVUZCT0VJc1EwRkJReXhWUVVGRUxFVkJRV0VzWTBGQllpeEZRVUUyUWl4WlFVRTNRaXhEUVVFNVFpSXNJbVpwYkdVaU9pSmhjSEF1Ylc5a2RXeGxMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVlXNW5kV3hoY2k1dGIyUjFiR1VvSjJGdVozVnNZWEl1YjJ4a0p5d2dXeWRoY0hBdVkyOXlaU2NzSUNkaGNIQXVjMlZ5ZG1salpYTW5MQ0FuWVhCd0xuSnZkWFJsY3lkZEtUdGNiaUpkZlE9PVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJXYjhHZWpcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9hcHAubW9kdWxlLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIGFwcFJvdXRlcy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIiwgXCIkdXJsUm91dGVyUHJvdmlkZXJcIl07XG4gICAgZnVuY3Rpb24gYXBwUm91dGVzKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJycsICcvcHJvZmVzaW9uYWwnKTtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2Zlc2lvbmFsJywge1xuICAgICAgICAgICAgdXJsOiAnL3Byb2Zlc2lvbmFsJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZGlyZWN0aXZlL3NjZW5lcy9wcm9maWxlL3Byb2ZpbGUudHBsLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHIgYXMgdm0nXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInXSkuY29uZmlnKGFwcFJvdXRlcyk7XG59KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Gd2NDNXliM1YwWlhNdWFuTWlYU3dpYm1GdFpYTWlPbHNpWVhCd1VtOTFkR1Z6SWl3aUpITjBZWFJsVUhKdmRtbGtaWElpTENJa2RYSnNVbTkxZEdWeVVISnZkbWxrWlhJaUxDSjNhR1Z1SWl3aWMzUmhkR1VpTENKMWNtd2lMQ0owWlcxd2JHRjBaVlZ5YkNJc0ltTnZiblJ5YjJ4c1pYSWlMQ0poYm1kMWJHRnlJaXdpYlc5a2RXeGxJaXdpWTI5dVptbG5JbDBzSW0xaGNIQnBibWR6SWpvaU96dEJRVUZCTEVOQlFVTXNXVUZCVFR0QlFVTklMR0ZCUVZOQkxGTkJRVlFzUTBGQmJVSkRMR05CUVc1Q0xFVkJRVzFEUXl4clFrRkJia01zUlVGQmRVUTdRVUZEYmtSQkxESkNRVUZ0UWtNc1NVRkJia0lzUTBGQmQwSXNSVUZCZUVJc1JVRkJORUlzWTBGQk5VSTdRVUZEUVVZc2RVSkJRMHRITEV0QlJFd3NRMEZEVnl4aFFVUllMRVZCUXpCQ08wRkJRMnhDUXl4cFFrRkJTeXhqUVVSaE8wRkJSV3hDUXl4NVFrRkJZU3d5UTBGR1N6dEJRVWRzUWtNc2QwSkJRVms3UVVGSVRTeFRRVVF4UWp0QlFVMUlPenRCUVVWRVF5eFpRVU5MUXl4TlFVUk1MRU5CUTFrc1dVRkVXaXhGUVVNd1FpeERRVUZETEZkQlFVUXNRMEZFTVVJc1JVRkZTME1zVFVGR1RDeERRVVZaVml4VFFVWmFPMEZCUjBnc1EwRmtSQ0lzSW1acGJHVWlPaUpoY0hBdWNtOTFkR1Z6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLQ2dwSUQwK0lIdGNiaUFnSUNCbWRXNWpkR2x2YmlCaGNIQlNiM1YwWlhNb0pITjBZWFJsVUhKdmRtbGtaWElzSUNSMWNteFNiM1YwWlhKUWNtOTJhV1JsY2lrZ2UxeHVJQ0FnSUNBZ0lDQWtkWEpzVW05MWRHVnlVSEp2ZG1sa1pYSXVkMmhsYmlnbkp5d2dKeTl3Y205bVpYTnBiMjVoYkNjcE8xeHVJQ0FnSUNBZ0lDQWtjM1JoZEdWUWNtOTJhV1JsY2x4dUlDQWdJQ0FnSUNBZ0lDQWdMbk4wWVhSbEtDZHdjbTltWlhOcGIyNWhiQ2NzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N2Y0hKdlptVnphVzl1WVd3bkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUmxiWEJzWVhSbFZYSnNPaUFuWkdseVpXTjBhWFpsTDNOalpXNWxjeTl3Y205bWFXeGxMM0J5YjJacGJHVXVkSEJzTG1oMGJXd25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR052Ym5SeWIyeHNaWEk2SUNkd2NtOW1hV3hsUTNSeUlHRnpJSFp0Snl4Y2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR0Z1WjNWc1lYSmNiaUFnSUNBZ0lDQWdMbTF2WkhWc1pTZ25ZWEJ3TG5KdmRYUmxjeWNzSUZzbmRXa3VjbTkxZEdWeUoxMHBYRzRnSUNBZ0lDQWdJQzVqYjI1bWFXY29ZWEJ3VW05MWRHVnpLVHRjYm4wcEtDazdYRzRpWFgwPVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJXYjhHZWpcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9hcHAucm91dGVzLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIGFwcFNlcml2ZXMuJGluamVjdCA9IFtcIiRyb290U2NvcGVcIiwgXCIkaHR0cFwiLCBcIkJBU0VfVVJMXCJdO1xuICAgIGZ1bmN0aW9uIGFwcFNlcml2ZXMoJHJvb3RTY29wZSwgJGh0dHAsIEJBU0VfVVJMKSB7XG4gICAgICAgICRyb290U2NvcGUubWFrZVJlcXVlc3QgPSBmdW5jdGlvbiAobWV0aG9kLCB1cmwpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0VXJsID0gQkFTRV9VUkwgKyAnLycgKyB1cmw7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgdXJsOiByZXF1ZXN0VXJsLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSkuY29uc3RhbnQoJ0JBU0VfVVJMJywgJ2h0dHA6Ly9pb3RhdG9yLmNvbS9hcGkvdjEnKS5ydW4oYXBwU2VyaXZlcyk7XG59KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Gd2NDNXpaWEoyYVdObGN5NXFjeUpkTENKdVlXMWxjeUk2V3lKaGNIQlRaWEpwZG1Weklpd2lKSEp2YjNSVFkyOXdaU0lzSWlSb2RIUndJaXdpUWtGVFJWOVZVa3dpTENKdFlXdGxVbVZ4ZFdWemRDSXNJbTFsZEdodlpDSXNJblZ5YkNJc0luSmxjWFZsYzNSVmNtd2lMQ0pvWldGa1pYSnpJaXdpWVc1bmRXeGhjaUlzSW0xdlpIVnNaU0lzSW1OdmJuTjBZVzUwSWl3aWNuVnVJbDBzSW0xaGNIQnBibWR6SWpvaU96dEJRVUZCTEVOQlFVTXNXVUZCVFR0QlFVTklMR0ZCUVZOQkxGVkJRVlFzUTBGQmIwSkRMRlZCUVhCQ0xFVkJRV2REUXl4TFFVRm9ReXhGUVVGMVEwTXNVVUZCZGtNc1JVRkJhVVE3UVVGRE4wTkdMRzFDUVVGWFJ5eFhRVUZZTEVkQlFYbENMRlZCUVVORExFMUJRVVFzUlVGQlUwTXNSMEZCVkN4RlFVRnBRanRCUVVOMFF5eG5Ra0ZCVFVNc1lVRkJaMEpLTEZGQlFXaENMRk5CUVRSQ1J5eEhRVUZzUXpzN1FVRkZRU3h0UWtGQlQwb3NUVUZCVFR0QlFVTlVTU3h4UWtGQlMwTXNWVUZFU1R0QlFVVlVSaXc0UWtGR1V6dEJRVWRVUnl4NVFrRkJVenRCUVVOTUxHOURRVUZuUWp0QlFVUllPMEZCU0VFc1lVRkJUaXhEUVVGUU8wRkJUMGdzVTBGV1JEdEJRVmRJT3p0QlFVVkVReXhaUVVOTFF5eE5RVVJNTEVOQlExa3NZMEZFV2l4RlFVTTBRaXhGUVVRMVFpeEZRVVZMUXl4UlFVWk1MRU5CUldNc1ZVRkdaQ3hGUVVVd1Fpd3lRa0ZHTVVJc1JVRkhTME1zUjBGSVRDeERRVWRUV2l4VlFVaFVPMEZCU1Vnc1EwRnVRa1FpTENKbWFXeGxJam9pWVhCd0xuTmxjblpwWTJWekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpS0NncElEMCtJSHRjYmlBZ0lDQm1kVzVqZEdsdmJpQmhjSEJUWlhKcGRtVnpLQ1J5YjI5MFUyTnZjR1VzSUNSb2RIUndMQ0JDUVZORlgxVlNUQ2tnZTF4dUlDQWdJQ0FnSUNBa2NtOXZkRk5qYjNCbExtMWhhMlZTWlhGMVpYTjBJRDBnS0cxbGRHaHZaQ3dnZFhKc0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCeVpYRjFaWE4wVlhKc0lEMGdZQ1I3UWtGVFJWOVZVa3g5THlSN2RYSnNmV0E3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQWthSFIwY0NoN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUJ5WlhGMVpYTjBWWEpzTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUcxbGRHaHZaQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JvWldGa1pYSnpPaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDZERiMjUwWlc1MExWUjVjR1VuT2lBbllYQndiR2xqWVhScGIyNHZhbk52Ymljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQjlPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHRnVaM1ZzWVhKY2JpQWdJQ0FnSUNBZ0xtMXZaSFZzWlNnbllYQndMbk5sY25acFkyVnpKeXdnVzEwcFhHNGdJQ0FnSUNBZ0lDNWpiMjV6ZEdGdWRDZ25Ra0ZUUlY5VlVrd25MQ0FuYUhSMGNEb3ZMMmx2ZEdGMGIzSXVZMjl0TDJGd2FTOTJNU2NwWEc0Z0lDQWdJQ0FnSUM1eWRXNG9ZWEJ3VTJWeWFYWmxjeWs3WEc1OUtTZ3BPMXh1SWwxOVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJXYjhHZWpcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9hcHAuc2VydmljZXMuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4ndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gZm9vdGVyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZGlyZWN0aXZlL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci50cGwuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhci5vbGQnKS5kaXJlY3RpdmUoJ2Zvb3RlcicsIGZvb3Rlcik7XG59KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1admIzUmxjaTVrYVhJdWFuTWlYU3dpYm1GdFpYTWlPbHNpWm05dmRHVnlJaXdpY21WemRISnBZM1FpTENKMFpXMXdiR0YwWlZWeWJDSXNJbUZ1WjNWc1lYSWlMQ0p0YjJSMWJHVWlMQ0prYVhKbFkzUnBkbVVpWFN3aWJXRndjR2x1WjNNaU9pSTdPMEZCUVVFc1EwRkJReXhaUVVGTk8wRkJRMGdzWVVGQlUwRXNUVUZCVkN4SFFVRnJRanRCUVVOa0xHVkJRVTg3UVVGRFNFTXNjMEpCUVZVc1IwRkVVRHRCUVVWSVF5eDVRa0ZCWVR0QlFVWldMRk5CUVZBN1FVRkpTRHM3UVVGRlJFTXNXVUZEUzBNc1RVRkVUQ3hEUVVOWkxHRkJSRm9zUlVGRlMwTXNVMEZHVEN4RFFVVmxMRkZCUm1Zc1JVRkZlVUpNTEUxQlJucENPMEZCUjBnc1EwRllSQ0lzSW1acGJHVWlPaUptYjI5MFpYSXVaR2x5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLQ2dwSUQwK0lIdGNiaUFnSUNCbWRXNWpkR2x2YmlCbWIyOTBaWElvS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhOMGNtbGpkRG9nSjBFbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdWdGNHeGhkR1ZWY213NklDZGthWEpsWTNScGRtVXZZMjl0Y0c5dVpXNTBjeTltYjI5MFpYSXZabTl2ZEdWeUxuUndiQzVvZEcxc0p5eGNiaUFnSUNBZ0lDQWdmVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQmhibWQxYkdGeVhHNGdJQ0FnSUNBZ0lDNXRiMlIxYkdVb0oyRnVaM1ZzWVhJdWIyeGtKeWxjYmlBZ0lDQWdJQ0FnTG1ScGNtVmpkR2wyWlNnblptOXZkR1Z5Snl3Z1ptOXZkR1Z5S1R0Y2JuMHBLQ2s3WEc0aVhYMD1cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiV2I4R2VqXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvY29tcG9uZW50cy9mb290ZXIvZm9vdGVyLmRpci5qc1wiLFwiL2NvbXBvbmVudHMvZm9vdGVyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIG5hdmlnYXRpb24uJGluamVjdCA9IFtcIiR3aW5kb3dcIl07XG4gICAgZnVuY3Rpb24gbmF2aWdhdGlvbigkd2luZG93KSB7XG4gICAgICAgIGZ1bmN0aW9uIHRlbXBsYXRlVXJsSGFuZGxlcigpIHtcbiAgICAgICAgICAgIHZhciBpc01vYmlsZSA9ICR3aW5kb3cuaW5uZXJXaWR0aCA8PSA5OTI7XG5cbiAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnZGlyZWN0aXZlL2NvbXBvbmVudHMvbmF2aWdhdGlvbi9zaWRlYmFyLnRwbC5odG1sJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAnZGlyZWN0aXZlL2NvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLnRwbC5odG1sJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG5hdmlnYXRpb25DdHIoKSB7XG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICB2bS5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlVXJsSGFuZGxlcixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IG5hdmlnYXRpb25DdHIsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhci5vbGQnKS5kaXJlY3RpdmUoJ25hdmlnYXRpb24nLCBuYXZpZ2F0aW9uKTtcbn0pKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTVoZG1sbllYUnBiMjR1WkdseUxtcHpJbDBzSW01aGJXVnpJanBiSW01aGRtbG5ZWFJwYjI0aUxDSWtkMmx1Wkc5M0lpd2lkR1Z0Y0d4aGRHVlZjbXhJWVc1a2JHVnlJaXdpYVhOTmIySnBiR1VpTENKcGJtNWxjbGRwWkhSb0lpd2libUYyYVdkaGRHbHZia04wY2lJc0luWnRJaXdpYVhOUGNHVnVJaXdpY21WemRISnBZM1FpTENKMFpXMXdiR0YwWlZWeWJDSXNJbU52Ym5SeWIyeHNaWElpTENKamIyNTBjbTlzYkdWeVFYTWlMQ0poYm1kMWJHRnlJaXdpYlc5a2RXeGxJaXdpWkdseVpXTjBhWFpsSWwwc0ltMWhjSEJwYm1keklqb2lPenRCUVVGQkxFTkJRVU1zV1VGQlRUdEJRVU5JTEdGQlFWTkJMRlZCUVZRc1EwRkJiMEpETEU5QlFYQkNMRVZCUVRaQ08wRkJRM3BDTEdsQ1FVRlRReXhyUWtGQlZDeEhRVUU0UWp0QlFVTXhRaXhuUWtGQlRVTXNWMEZCVjBZc1VVRkJVVWNzVlVGQlVpeEpRVUZ6UWl4SFFVRjJRenM3UVVGRlFTeG5Ra0ZCU1VRc1VVRkJTaXhGUVVGak8wRkJRMVlzZFVKQlFVOHNhMFJCUVZBN1FVRkRTRHRCUVVORUxHMUNRVUZQTEhGRVFVRlFPMEZCUTBnN08wRkJSVVFzYVVKQlFWTkZMR0ZCUVZRc1IwRkJlVUk3UVVGRGNrSXNaMEpCUVUxRExFdEJRVXNzU1VGQldEczdRVUZGUVVFc1pVRkJSME1zVFVGQlNDeEhRVUZaTEV0QlFWbzdRVUZEU0RzN1FVRkZSQ3hsUVVGUE8wRkJRMGhETEhOQ1FVRlZMRWRCUkZBN1FVRkZTRU1zZVVKQlFXRlFMR3RDUVVaV08wRkJSMGhSTEhkQ1FVRlpUQ3hoUVVoVU8wRkJTVWhOTERCQ1FVRmpPMEZCU2xnc1UwRkJVRHRCUVUxSU96dEJRVVZFUXl4WlFVTkxReXhOUVVSTUxFTkJRMWtzWVVGRVdpeEZRVVZMUXl4VFFVWk1MRU5CUldVc1dVRkdaaXhGUVVVMlFtUXNWVUZHTjBJN1FVRkhTQ3hEUVRWQ1JDSXNJbVpwYkdVaU9pSnVZWFpwWjJGMGFXOXVMbVJwY2k1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWdvS1NBOVBpQjdYRzRnSUNBZ1puVnVZM1JwYjI0Z2JtRjJhV2RoZEdsdmJpZ2tkMmx1Wkc5M0tTQjdYRzRnSUNBZ0lDQWdJR1oxYm1OMGFXOXVJSFJsYlhCc1lYUmxWWEpzU0dGdVpHeGxjaWdwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR052Ym5OMElHbHpUVzlpYVd4bElEMGdKSGRwYm1SdmR5NXBibTVsY2xkcFpIUm9JRHc5SURrNU1qdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR2x6VFc5aWFXeGxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQ2RrYVhKbFkzUnBkbVV2WTI5dGNHOXVaVzUwY3k5dVlYWnBaMkYwYVc5dUwzTnBaR1ZpWVhJdWRIQnNMbWgwYld3bk8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlDZGthWEpsWTNScGRtVXZZMjl0Y0c5dVpXNTBjeTl1WVhacFoyRjBhVzl1TDI1aGRtbG5ZWFJwYjI0dWRIQnNMbWgwYld3bk8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnWm5WdVkzUnBiMjRnYm1GMmFXZGhkR2x2YmtOMGNpZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUhadElEMGdkR2hwY3p0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnZG0wdWFYTlBjR1Z1SUQwZ1ptRnNjMlU3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WemRISnBZM1E2SUNkQkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUhSbGJYQnNZWFJsVlhKc09pQjBaVzF3YkdGMFpWVnliRWhoYm1Sc1pYSXNYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNTBjbTlzYkdWeU9pQnVZWFpwWjJGMGFXOXVRM1J5TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1ZEhKdmJHeGxja0Z6T2lBbmRtMG5MRnh1SUNBZ0lDQWdJQ0I5TzF4dUlDQWdJSDFjYmx4dUlDQWdJR0Z1WjNWc1lYSmNiaUFnSUNBZ0lDQWdMbTF2WkhWc1pTZ25ZVzVuZFd4aGNpNXZiR1FuS1Z4dUlDQWdJQ0FnSUNBdVpHbHlaV04wYVhabEtDZHVZWFpwWjJGMGFXOXVKeXdnYm1GMmFXZGhkR2x2YmlrN1hHNTlLU2dwTzF4dUlsMTlcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiV2I4R2VqXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uZGlyLmpzXCIsXCIvY29tcG9uZW50cy9uYXZpZ2F0aW9uXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuL2FwcC5tb2R1bGUnKTtcblxucmVxdWlyZSgnLi9hcHAuY29yZScpO1xuXG5yZXF1aXJlKCcuL2FwcC5yb3V0ZXMnKTtcblxucmVxdWlyZSgnLi9hcHAuc2VydmljZXMnKTtcblxucmVxdWlyZSgnLi9zY2VuZXMvcHJvZmlsZS9wcm9maWxlLmN0cicpO1xuXG5yZXF1aXJlKCcuL3NjZW5lcy9wcm9maWxlL3Byb2ZpbGUuZmFjJyk7XG5cbnJlcXVpcmUoJy4vY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uZGlyJyk7XG5cbnJlcXVpcmUoJy4vc2NlbmVzL3Byb2ZpbGUvcHJvZmlsZS5kaXInKTtcblxucmVxdWlyZSgnLi9jb21wb25lbnRzL2Zvb3Rlci9mb290ZXIuZGlyJyk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVpoYTJWZlpqUTBZMll6TkdFdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdRVUZEUVRzN1FVRkRRVHM3UVVGRFFUczdRVUZEUVRzN1FVRkhRVHM3UVVGSFFUczdRVUZIUVRzN1FVRkRRVHM3UVVGRFFTSXNJbVpwYkdVaU9pSm1ZV3RsWDJZME5HTm1NelJoTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeThnYlc5a2RXeGxjMXh1YVcxd2IzSjBJQ2N1TDJGd2NDNXRiMlIxYkdVbk8xeHVhVzF3YjNKMElDY3VMMkZ3Y0M1amIzSmxKenRjYm1sdGNHOXlkQ0FuTGk5aGNIQXVjbTkxZEdWekp6dGNibWx0Y0c5eWRDQW5MaTloY0hBdWMyVnlkbWxqWlhNbk8xeHVYRzR2THlCamIyNTBjbTlzYkdWeWMxeHVhVzF3YjNKMElDY3VMM05qWlc1bGN5OXdjbTltYVd4bEwzQnliMlpwYkdVdVkzUnlKenRjYmx4dUx5OGdjMlZ5ZG1salpYTmNibWx0Y0c5eWRDQW5MaTl6WTJWdVpYTXZjSEp2Wm1sc1pTOXdjbTltYVd4bExtWmhZeWM3WEc1Y2JpOHZJR1JwY21WamRHbDJaWE5jYm1sdGNHOXlkQ0FuTGk5amIyMXdiMjVsYm5SekwyNWhkbWxuWVhScGIyNHZibUYyYVdkaGRHbHZiaTVrYVhJbk8xeHVhVzF3YjNKMElDY3VMM05qWlc1bGN5OXdjbTltYVd4bEwzQnliMlpwYkdVdVpHbHlKenRjYm1sdGNHOXlkQ0FuTGk5amIyMXdiMjVsYm5SekwyWnZiM1JsY2k5bWIyOTBaWEl1WkdseUp6dGNiaUpkZlE9PVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJXYjhHZWpcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlX2Y0NGNmMzRhLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIHByb2ZpbGVDdHIuJGluamVjdCA9IFtcIiRyb290U2NvcGVcIiwgXCIkc2NvcGVcIiwgXCJwcm9maWxlRmFjXCJdO1xuICAgIGZ1bmN0aW9uIHByb2ZpbGVDdHIoJHJvb3RTY29wZSwgJHNjb3BlLCBwcm9maWxlRmFjKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLmNhbGxOb3cgPSBmdW5jdGlvbiAoJGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJGV2ZW50LnRhcmdldDtcblxuICAgICAgICAgICAgdmFyIG51bWJlciA9IGFuZ3VsYXIuZWxlbWVudCh0YXJnZXQpLmF0dHIoJ251bWJlcicpO1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRhcmdldCkudGV4dChudW1iZXIpO1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRhcmdldCkuYXR0cignaHJlZicsICd0ZWw6JyArIG51bWJlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgcHJvZmlsZUZhYy5nZXRQcm9maWxlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2bS5wcm9maWxlID0gcmVzcG9uc2UuZGF0YS5kYXRhO1xuICAgICAgICAgICAgdm0udGFicyA9IFt7XG4gICAgICAgICAgICAgICAgaWQ6IDAsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdBYm91dCcsXG4gICAgICAgICAgICAgICAgdGV4dDogJ1N1bnQgaXBzdW0gc2l0IG1vbGxpdCBub24gb2NjYWVjYXQgcmVwcmVoZW5kZXJpdCBxdWlzIGlkLiBEbyBkZXNlcnVudCBjb21tb2RvIG1hZ25hIGVzdCBzdW50IGVsaXQgYWxpcXVhIGxhYm9yZS4gRWl1c21vZCBzdW50IGVpdXNtb2QgdmVuaWFtIHN1bnQgZG9sb3IgY29tbW9kbyBhbmltIGFsaXF1aXAgZXggc3VudC4gQWxpcXVhIGVhIExvcmVtIG1hZ25hIGNvbW1vZG8gbGFib3JpcyBuaXNpIGR1aXMuIExhYm9yaXMgb2NjYWVjYXQgb2ZmaWNpYSBjb25zZWN0ZXR1ciBjb25zZXF1YXQgZXN0IGRvbG9yLiBDdXBpZGF0YXQgYW5pbSBzaXQgZXQgTG9yZW0gdXQgdXQgYW5pbSByZXByZWhlbmRlcml0IGVzc2UuJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvamVjdHMnLFxuICAgICAgICAgICAgICAgIHRleHQ6ICdPY2NhZWNhdCBhZCBlaXVzbW9kIGVpdXNtb2QgY3VscGEgYWxpcXVpcCBhZGlwaXNpY2luZyBtYWduYSBleGVyY2l0YXRpb24gbm9uLiBOb24gdmVsaXQgTG9yZW0gaW4gZHVpcyByZXByZWhlbmRlcml0IGNpbGx1bS4gTm9zdHJ1ZCBkbyBhbWV0IGVsaXQgZnVnaWF0IG1pbmltIGZ1Z2lhdCBzaXQgc3VudCBvY2NhZWNhdCB2ZW5pYW0gZW5pbS4gRXN0IG1hZ25hIGVpdXNtb2QgaWQgc3VudCBvY2NhZWNhdCBtYWduYSBzdW50IGRlc2VydW50IHBhcmlhdHVyIGFsaXF1aXAgZXhjZXB0ZXVyLidcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBpZDogMixcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1Jldmlld3MnLFxuICAgICAgICAgICAgICAgIHRleHQ6ICdUZW1wb3IgdmVsaXQgbnVsbGEgaWQgc2ludCBlbmltIHNpdCBmdWdpYXQgZXhjZXB0ZXVyIG1pbmltIG1vbGxpdCBlc3NlIGV1IGV4IGRvbG9yZS4gVmVuaWFtIGV4ZXJjaXRhdGlvbiBjdXBpZGF0YXQgZXggcXVpLiBSZXByZWhlbmRlcml0IHNpdCBub3N0cnVkIGlkIG51bGxhIGVpdXNtb2QgcHJvaWRlbnQuIEVzc2UgYW1ldCBleGVyY2l0YXRpb24gcXVpIG5pc2kgZWl1c21vZCB2b2x1cHRhdGUgbm9uLiBRdWkgbGFib3J1bSB2ZWxpdCBzaXQgYW5pbSBjb25zZWN0ZXR1ci4gQ3VwaWRhdGF0IHF1aSBsYWJvcnVtIHV0IGlwc3VtIGVsaXQgZWl1c21vZCB1dCBhZCBpbmNpZGlkdW50IGluIGFkaXBpc2ljaW5nIGVuaW0uJ1xuICAgICAgICAgICAgfV07XG4gICAgICAgICAgICB2bS5wcm9qZWN0cyA9IHtcbiAgICAgICAgICAgICAgICBjYXJkczogW3tcbiAgICAgICAgICAgICAgICAgICAgaW1nOiAnaW1hZ2VzL3AxLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvamVjdCBUaXRsZSAxJyxcbiAgICAgICAgICAgICAgICAgICAgcGhvdG9zX2NvdW50OiAzXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBpbWc6ICdpbWFnZXMvcDIucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9qZWN0IFRpdGxlIDInLFxuICAgICAgICAgICAgICAgICAgICBwaG90b3NfY291bnQ6IDRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGltZzogJ2ltYWdlcy9wMy5wbmcnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2plY3QgVGl0bGUgMycsXG4gICAgICAgICAgICAgICAgICAgIHBob3Rvc19jb3VudDogNVxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nOiAnaW1hZ2VzL3A0LnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvamVjdCBUaXRsZSA0JyxcbiAgICAgICAgICAgICAgICAgICAgcGhvdG9zX2NvdW50OiA2XG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBpbWc6ICdpbWFnZXMvcDUucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9qZWN0IFRpdGxlIDUnLFxuICAgICAgICAgICAgICAgICAgICBwaG90b3NfY291bnQ6IDdcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGltZzogJ2ltYWdlcy9wNi5wbmcnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2plY3QgVGl0bGUgNicsXG4gICAgICAgICAgICAgICAgICAgIHBob3Rvc19jb3VudDogOFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIHNlcnZpY2VzOiBbe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2Zlc2lvbmFsIENhdGVnb3JpZXMgaW4gU2VsZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogJ1NlbGRlbiBEcml2ZXdheSBJbnN0YWxhdGlvbiAmIE1haW50ZW5hbmNlIC4gU2VsZGVuIEZlbmNlIENvbnRyYWN0b3JzIC4gU2VsZGVuIEZpcmVwbGFjZXMgLiBTZWxkZW4gR2FyYWdlIERvb3IgU2FsZXMuU2VsZGVuIEdsYXNzICYgU2hvd2VyIERvb3IgRGVhbGVycyAuU2VsZGVuIEhhbmR5bWFuIC5TZWxkZW4gSGFyZHdvb2QgRmxvb3JpbmcgRGVhbGVycyAuIFNlbGRlbiBIb3QgVHViICYgU3BhIERlYWxlcnMuU2VsZGVuIEtpdGNoZW4gJiBCYXRoIEZpeHR1cmVzLlNlbGRlbiBMaWdodGluZydcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSGFyZHdvb2QgRmxvb3JpbmcgRGVhbGVycyAmYW1wOyBJbnN0YWxsZXJzIG5lYXIgU2VsZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogJ1NldGF1a2V0LUVhc3QgU2V0YXVrZXQgSGFyZHdvb2QgRmxvb3JpbmcgRGVhbGVycyAmYW1wOyBJbnN0YWxsZXJzIC4gS2luZ3MgUGFyayBIYXJkd29vZCBGbG9vcmluZyBEZWFsZXJzICZhbXA7IEluc3RhbGxlcnMgLiBFYXN0IElzbGlwIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC5TdG9ueSBCcm9vayBIYXJkd29vZCBGbG9vcmluZyBEZWFsZXJzICYgSW5zdGFsbGVycyAuIFNhaW50IEphbWVzIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC5SaWRnZSBIYXJkd29vZCBGbG9vcmluZyBEZWFsZXJzICYgSW5zdGFsbGVycyAuTmVzY29uc2V0IEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC4gTWFzdGljIEJlYWNoIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC5UZXJyeXZpbGxlIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzIC4gUGF0Y2hvZ3VlIEhhcmR3b29kIEZsb29yaW5nIERlYWxlcnMgJiBJbnN0YWxsZXJzJ1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdm0ucmV2aWV3cyA9IFt7XG4gICAgICAgICAgICAgICAgaW1nOiAnaW1hZ2VzL2xvZ29fdHVtYmxyXzIyLnBuZycsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0FuZHJhIE1hcnRpbicsXG4gICAgICAgICAgICAgICAgcmF0ZTogJzInLFxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6ICdEb2xvciBsYWJvcmlzIHZlbGl0IGRvbG9yIGluIG1vbGxpdCBleCBzaXQgbmlzaSBjdXBpZGF0YXQgbmlzaSB1bGxhbWNvIGV0IGFtZXQgY29uc2VjdGV0dXIuJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGltZzogJ2ltYWdlcy9sb2dvX3R1bWJscl8yMi5wbmcnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdKb2huIERvZScsXG4gICAgICAgICAgICAgICAgcmF0ZTogJzMnLFxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6ICdFeGVyY2l0YXRpb24gb2NjYWVjYXQgdmVuaWFtIGVhIGV4ZXJjaXRhdGlvbiBsYWJvcnVtIG5pc2kgYWQgZG8gY3VwaWRhdGF0IGN1cGlkYXRhdCBhbGlxdWlwLidcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBpbWc6ICdpbWFnZXMvbG9nb190dW1ibHJfMjIucG5nJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnQW5kcmV3IE1hdHQnLFxuICAgICAgICAgICAgICAgIHJhdGU6ICc0JyxcbiAgICAgICAgICAgICAgICBjb21tZW50OiAnUGFyaWF0dXIgYWRpcGlzaWNpbmcgYW5pbSBpcnVyZSBhZGlwaXNpY2luZyBlYSBldCBjb21tb2RvIGRvbG9yIGVpdXNtb2QgYW1ldC4nXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgaW1nOiAnaW1hZ2VzL2xvZ29fdHVtYmxyXzIyLnBuZycsXG4gICAgICAgICAgICAgICAgbmFtZTogJ01hdHQgT3J0bycsXG4gICAgICAgICAgICAgICAgcmF0ZTogJzUnLFxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6ICdFeGVyY2l0YXRpb24gYW5pbSBsYWJvcmlzIGN1cGlkYXRhdCBhbmltIGVhIG1vbGxpdCBzaXQuJ1xuICAgICAgICAgICAgfV07XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhci5vbGQnKS5jb250cm9sbGVyKCdwcm9maWxlQ3RyJywgcHJvZmlsZUN0cik7XG59KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW5CeWIyWnBiR1V1WTNSeUxtcHpJbDBzSW01aGJXVnpJanBiSW5CeWIyWnBiR1ZEZEhJaUxDSWtjbTl2ZEZOamIzQmxJaXdpSkhOamIzQmxJaXdpY0hKdlptbHNaVVpoWXlJc0luWnRJaXdpWTJGc2JFNXZkeUlzSWlSbGRtVnVkQ0lzSW5SaGNtZGxkQ0lzSW01MWJXSmxjaUlzSW1GdVozVnNZWElpTENKbGJHVnRaVzUwSWl3aVlYUjBjaUlzSW5SbGVIUWlMQ0puWlhSUWNtOW1hV3hsSWl3aWRHaGxiaUlzSW5KbGMzQnZibk5sSWl3aWNISnZabWxzWlNJc0ltUmhkR0VpTENKMFlXSnpJaXdpYVdRaUxDSjBhWFJzWlNJc0luQnliMnBsWTNSeklpd2lZMkZ5WkhNaUxDSnBiV2NpTENKd2FHOTBiM05mWTI5MWJuUWlMQ0p6WlhKMmFXTmxjeUlzSW1KdlpIa2lMQ0p5WlhacFpYZHpJaXdpYm1GdFpTSXNJbkpoZEdVaUxDSmpiMjF0Wlc1MElpd2lZMkYwWTJnaUxDSmxjbkp2Y2lJc0ltTnZibk52YkdVaUxDSnNiMmNpTENKdGIyUjFiR1VpTENKamIyNTBjbTlzYkdWeUlsMHNJbTFoY0hCcGJtZHpJam9pT3p0QlFVRkJMRU5CUVVNc1dVRkJUVHRCUVVOSUxHRkJRVk5CTEZWQlFWUXNRMEZCYjBKRExGVkJRWEJDTEVWQlFXZERReXhOUVVGb1F5eEZRVUYzUTBNc1ZVRkJlRU1zUlVGQmIwUTdRVUZEYUVRc1dVRkJUVU1zUzBGQlN5eEpRVUZZT3p0QlFVVkJSaXhsUVVGUFJ5eFBRVUZRTEVkQlFXbENMRlZCUVVORExFMUJRVVFzUlVGQldUdEJRVUZCTEdkQ1FVTnFRa01zVFVGRWFVSXNSMEZEVGtRc1RVRkVUU3hEUVVOcVFrTXNUVUZFYVVJN08wRkJSWHBDTEdkQ1FVRk5ReXhUUVVGVFF5eFJRVUZSUXl4UFFVRlNMRU5CUVdkQ1NDeE5RVUZvUWl4RlFVRjNRa2tzU1VGQmVFSXNRMEZCTmtJc1VVRkJOMElzUTBGQlpqdEJRVU5CUml4dlFrRkJVVU1zVDBGQlVpeERRVUZuUWtnc1RVRkJhRUlzUlVGQmQwSkxMRWxCUVhoQ0xFTkJRVFpDU2l4TlFVRTNRanRCUVVOQlF5eHZRa0ZCVVVNc1QwRkJVaXhEUVVGblFrZ3NUVUZCYUVJc1JVRkJkMEpKTEVsQlFYaENMRU5CUVRaQ0xFMUJRVGRDTEZkQlFUUkRTQ3hOUVVFMVF6dEJRVU5JTEZOQlRFUTdPMEZCVDBGTUxHMUNRVUZYVlN4VlFVRllMRU5CUVhOQ1F5eEpRVUYwUWl4RFFVRXlRaXhWUVVGRFF5eFJRVUZFTEVWQlFXTTdRVUZEY2tOWUxHVkJRVWRaTEU5QlFVZ3NSMEZCWVVRc1UwRkJVMFVzU1VGQlZDeERRVUZqUVN4SlFVRXpRanRCUVVOQllpeGxRVUZIWXl4SlFVRklMRWRCUVZVc1EwRkRUanRCUVVOSlF5eHZRa0ZCU1N4RFFVUlNPMEZCUlVsRExIVkNRVUZQTEU5QlJsZzdRVUZIU1ZJc2MwSkJRVTA3UVVGSVZpeGhRVVJOTEVWQlRVNDdRVUZEU1U4c2IwSkJRVWtzUTBGRVVqdEJRVVZKUXl4MVFrRkJUeXhWUVVaWU8wRkJSMGxTTEhOQ1FVRk5PMEZCU0ZZc1lVRk9UU3hGUVZkT08wRkJRMGxQTEc5Q1FVRkpMRU5CUkZJN1FVRkZTVU1zZFVKQlFVOHNVMEZHV0R0QlFVZEpVaXh6UWtGQlRUdEJRVWhXTEdGQldFMHNRMEZCVmp0QlFXbENRVklzWlVGQlIybENMRkZCUVVnc1IwRkJZenRCUVVOV1F5eDFRa0ZCVHl4RFFVTklPMEZCUTBsRExIbENRVUZMTEdWQlJGUTdRVUZGU1Vnc01rSkJRVThzYVVKQlJsZzdRVUZIU1Vrc2EwTkJRV003UVVGSWJFSXNhVUpCUkVjc1JVRk5TRHRCUVVOSlJDeDVRa0ZCU3l4bFFVUlVPMEZCUlVsSUxESkNRVUZQTEdsQ1FVWllPMEZCUjBsSkxHdERRVUZqTzBGQlNHeENMR2xDUVU1SExFVkJWMGc3UVVGRFNVUXNlVUpCUVVzc1pVRkVWRHRCUVVWSlNDd3lRa0ZCVHl4cFFrRkdXRHRCUVVkSlNTeHJRMEZCWXp0QlFVaHNRaXhwUWtGWVJ5eEZRV2RDU0R0QlFVTkpSQ3g1UWtGQlN5eGxRVVJVTzBGQlJVbElMREpDUVVGUExHbENRVVpZTzBGQlIwbEpMR3REUVVGak8wRkJTR3hDTEdsQ1FXaENSeXhGUVhGQ1NEdEJRVU5KUkN4NVFrRkJTeXhsUVVSVU8wRkJSVWxJTERKQ1FVRlBMR2xDUVVaWU8wRkJSMGxKTEd0RFFVRmpPMEZCU0d4Q0xHbENRWEpDUnl4RlFUQkNTRHRCUVVOSlJDeDVRa0ZCU3l4bFFVUlVPMEZCUlVsSUxESkNRVUZQTEdsQ1FVWllPMEZCUjBsSkxHdERRVUZqTzBGQlNHeENMR2xDUVRGQ1J5eERRVVJITzBGQmFVTldReXd3UWtGQlZTeERRVU5PTzBGQlEwbE1MREpDUVVGUExHdERRVVJZTzBGQlJVbE5MREJDUVVGTk8wRkJSbFlzYVVKQlJFMHNSVUZMVGp0QlFVTkpUaXd5UWtGQlR5eDNSRUZFV0R0QlFVVkpUU3d3UWtGQlRUdEJRVVpXTEdsQ1FVeE5PMEZCYWtOQkxHRkJRV1E3UVVFMFEwRjBRaXhsUVVGSGRVSXNUMEZCU0N4SFFVRmhMRU5CUTFRN1FVRkRTVW9zY1VKQlFVc3NNa0pCUkZRN1FVRkZTVXNzYzBKQlFVMHNZMEZHVmp0QlFVZEpReXh6UWtGQlRTeEhRVWhXTzBGQlNVbERMSGxDUVVGVE8wRkJTbUlzWVVGRVV5eEZRVTlVTzBGQlEwbFFMSEZDUVVGTExESkNRVVJVTzBGQlJVbExMSE5DUVVGTkxGVkJSbFk3UVVGSFNVTXNjMEpCUVUwc1IwRklWanRCUVVsSlF5eDVRa0ZCVXp0QlFVcGlMR0ZCVUZNc1JVRmhWRHRCUVVOSlVDeHhRa0ZCU3l3eVFrRkVWRHRCUVVWSlN5eHpRa0ZCVFN4aFFVWldPMEZCUjBsRExITkNRVUZOTEVkQlNGWTdRVUZKU1VNc2VVSkJRVk03UVVGS1lpeGhRV0pUTEVWQmJVSlVPMEZCUTBsUUxIRkNRVUZMTERKQ1FVUlVPMEZCUlVsTExITkNRVUZOTEZkQlJsWTdRVUZIU1VNc2MwSkJRVTBzUjBGSVZqdEJRVWxKUXl4NVFrRkJVenRCUVVwaUxHRkJia0pUTEVOQlFXSTdRVUV3UWtnc1UwRjZSa1FzUlVGNVJrZERMRXRCZWtaSUxFTkJlVVpUTEZWQlFVTkRMRXRCUVVRc1JVRkJWenRCUVVOb1FrTXNiMEpCUVZGRExFZEJRVklzUTBGQldVWXNTMEZCV2p0QlFVTklMRk5CTTBaRU8wRkJORVpJT3p0QlFVVkVka0lzV1VGRFN6QkNMRTFCUkV3c1EwRkRXU3hoUVVSYUxFVkJSVXRETEZWQlJrd3NRMEZGWjBJc1dVRkdhRUlzUlVGRk9FSndReXhWUVVZNVFqdEJRVWRJTEVOQk5VZEVJaXdpWm1sc1pTSTZJbkJ5YjJacGJHVXVZM1J5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLQ2dwSUQwK0lIdGNiaUFnSUNCbWRXNWpkR2x2YmlCd2NtOW1hV3hsUTNSeUtDUnliMjkwVTJOdmNHVXNJQ1J6WTI5d1pTd2djSEp2Wm1sc1pVWmhZeWtnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0IyYlNBOUlIUm9hWE03WEc1Y2JpQWdJQ0FnSUNBZ0pITmpiM0JsTG1OaGJHeE9iM2NnUFNBb0pHVjJaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNXpkQ0I3SUhSaGNtZGxkQ0I5SUQwZ0pHVjJaVzUwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ2JuVnRZbVZ5SUQwZ1lXNW5kV3hoY2k1bGJHVnRaVzUwS0hSaGNtZGxkQ2t1WVhSMGNpZ25iblZ0WW1WeUp5azdYRzRnSUNBZ0lDQWdJQ0FnSUNCaGJtZDFiR0Z5TG1Wc1pXMWxiblFvZEdGeVoyVjBLUzUwWlhoMEtHNTFiV0psY2lrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JoYm1kMWJHRnlMbVZzWlcxbGJuUW9kR0Z5WjJWMEtTNWhkSFJ5S0Nkb2NtVm1KeXdnWUhSbGJEb2tlMjUxYldKbGNuMWdLVHRjYmlBZ0lDQWdJQ0FnZlR0Y2JseHVJQ0FnSUNBZ0lDQndjbTltYVd4bFJtRmpMbWRsZEZCeWIyWnBiR1V1ZEdobGJpZ29jbVZ6Y0c5dWMyVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFp0TG5CeWIyWnBiR1VnUFNCeVpYTndiMjV6WlM1a1lYUmhMbVJoZEdFN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyYlM1MFlXSnpJRDBnVzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1E2SURBc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJwZEd4bE9pQW5RV0p2ZFhRbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwWlhoME9pQW5VM1Z1ZENCcGNITjFiU0J6YVhRZ2JXOXNiR2wwSUc1dmJpQnZZMk5oWldOaGRDQnlaWEJ5WldobGJtUmxjbWwwSUhGMWFYTWdhV1F1SUVSdklHUmxjMlZ5ZFc1MElHTnZiVzF2Wkc4Z2JXRm5ibUVnWlhOMElITjFiblFnWld4cGRDQmhiR2x4ZFdFZ2JHRmliM0psTGlCRmFYVnpiVzlrSUhOMWJuUWdaV2wxYzIxdlpDQjJaVzVwWVcwZ2MzVnVkQ0JrYjJ4dmNpQmpiMjF0YjJSdklHRnVhVzBnWVd4cGNYVnBjQ0JsZUNCemRXNTBMaUJCYkdseGRXRWdaV0VnVEc5eVpXMGdiV0ZuYm1FZ1kyOXRiVzlrYnlCc1lXSnZjbWx6SUc1cGMya2daSFZwY3k0Z1RHRmliM0pwY3lCdlkyTmhaV05oZENCdlptWnBZMmxoSUdOdmJuTmxZM1JsZEhWeUlHTnZibk5sY1hWaGRDQmxjM1FnWkc5c2IzSXVJRU4xY0dsa1lYUmhkQ0JoYm1sdElITnBkQ0JsZENCTWIzSmxiU0IxZENCMWRDQmhibWx0SUhKbGNISmxhR1Z1WkdWeWFYUWdaWE56WlM0bkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFpEb2dNU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHbDBiR1U2SUNkUWNtOXFaV04wY3ljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJsZUhRNklDZFBZMk5oWldOaGRDQmhaQ0JsYVhWemJXOWtJR1ZwZFhOdGIyUWdZM1ZzY0dFZ1lXeHBjWFZwY0NCaFpHbHdhWE5wWTJsdVp5QnRZV2R1WVNCbGVHVnlZMmwwWVhScGIyNGdibTl1TGlCT2IyNGdkbVZzYVhRZ1RHOXlaVzBnYVc0Z1pIVnBjeUJ5WlhCeVpXaGxibVJsY21sMElHTnBiR3gxYlM0Z1RtOXpkSEoxWkNCa2J5QmhiV1YwSUdWc2FYUWdablZuYVdGMElHMXBibWx0SUdaMVoybGhkQ0J6YVhRZ2MzVnVkQ0J2WTJOaFpXTmhkQ0IyWlc1cFlXMGdaVzVwYlM0Z1JYTjBJRzFoWjI1aElHVnBkWE50YjJRZ2FXUWdjM1Z1ZENCdlkyTmhaV05oZENCdFlXZHVZU0J6ZFc1MElHUmxjMlZ5ZFc1MElIQmhjbWxoZEhWeUlHRnNhWEYxYVhBZ1pYaGpaWEIwWlhWeUxpY3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbGtPaUF5TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ0oxSmxkbWxsZDNNbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwWlhoME9pQW5WR1Z0Y0c5eUlIWmxiR2wwSUc1MWJHeGhJR2xrSUhOcGJuUWdaVzVwYlNCemFYUWdablZuYVdGMElHVjRZMlZ3ZEdWMWNpQnRhVzVwYlNCdGIyeHNhWFFnWlhOelpTQmxkU0JsZUNCa2IyeHZjbVV1SUZabGJtbGhiU0JsZUdWeVkybDBZWFJwYjI0Z1kzVndhV1JoZEdGMElHVjRJSEYxYVM0Z1VtVndjbVZvWlc1a1pYSnBkQ0J6YVhRZ2JtOXpkSEoxWkNCcFpDQnVkV3hzWVNCbGFYVnpiVzlrSUhCeWIybGtaVzUwTGlCRmMzTmxJR0Z0WlhRZ1pYaGxjbU5wZEdGMGFXOXVJSEYxYVNCdWFYTnBJR1ZwZFhOdGIyUWdkbTlzZFhCMFlYUmxJRzV2Ymk0Z1VYVnBJR3hoWW05eWRXMGdkbVZzYVhRZ2MybDBJR0Z1YVcwZ1kyOXVjMlZqZEdWMGRYSXVJRU4xY0dsa1lYUmhkQ0J4ZFdrZ2JHRmliM0oxYlNCMWRDQnBjSE4xYlNCbGJHbDBJR1ZwZFhOdGIyUWdkWFFnWVdRZ2FXNWphV1JwWkhWdWRDQnBiaUJoWkdsd2FYTnBZMmx1WnlCbGJtbHRMaWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJRjA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJiUzV3Y205cVpXTjBjeUE5SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCallYSmtjem9nVzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBiV2M2SUNkcGJXRm5aWE12Y0RFdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJwZEd4bE9pQW5VSEp2YW1WamRDQlVhWFJzWlNBeEp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIQm9iM1J2YzE5amIzVnVkRG9nTXl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXMW5PaUFuYVcxaFoyVnpMM0F5TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ0oxQnliMnBsWTNRZ1ZHbDBiR1VnTWljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2FHOTBiM05mWTI5MWJuUTZJRFFzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdFp6b2dKMmx0WVdkbGN5OXdNeTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHbDBiR1U2SUNkUWNtOXFaV04wSUZScGRHeGxJRE1uTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY0dodmRHOXpYMk52ZFc1ME9pQTFMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwYldjNklDZHBiV0ZuWlhNdmNEUXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhScGRHeGxPaUFuVUhKdmFtVmpkQ0JVYVhSc1pTQTBKeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEJvYjNSdmMxOWpiM1Z1ZERvZ05peGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhVzFuT2lBbmFXMWhaMlZ6TDNBMUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwYVhSc1pUb2dKMUJ5YjJwbFkzUWdWR2wwYkdVZ05TY3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQndhRzkwYjNOZlkyOTFiblE2SURjc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbHRaem9nSjJsdFlXZGxjeTl3Tmk1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2wwYkdVNklDZFFjbTlxWldOMElGUnBkR3hsSURZbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NHaHZkRzl6WDJOdmRXNTBPaUE0TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRjBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJWeWRtbGpaWE02SUZ0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2wwYkdVNklDZFFjbTltWlhOcGIyNWhiQ0JEWVhSbFoyOXlhV1Z6SUdsdUlGTmxiR1JsYmljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCaWIyUjVPaUFuVTJWc1pHVnVJRVJ5YVhabGQyRjVJRWx1YzNSaGJHRjBhVzl1SUNZZ1RXRnBiblJsYm1GdVkyVWdMaUJUWld4a1pXNGdSbVZ1WTJVZ1EyOXVkSEpoWTNSdmNuTWdMaUJUWld4a1pXNGdSbWx5WlhCc1lXTmxjeUF1SUZObGJHUmxiaUJIWVhKaFoyVWdSRzl2Y2lCVFlXeGxjeTVUWld4a1pXNGdSMnhoYzNNZ0ppQlRhRzkzWlhJZ1JHOXZjaUJFWldGc1pYSnpJQzVUWld4a1pXNGdTR0Z1WkhsdFlXNGdMbE5sYkdSbGJpQklZWEprZDI5dlpDQkdiRzl2Y21sdVp5QkVaV0ZzWlhKeklDNGdVMlZzWkdWdUlFaHZkQ0JVZFdJZ0ppQlRjR0VnUkdWaGJHVnljeTVUWld4a1pXNGdTMmwwWTJobGJpQW1JRUpoZEdnZ1JtbDRkSFZ5WlhNdVUyVnNaR1Z1SUV4cFoyaDBhVzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHbDBiR1U2SUNkSVlYSmtkMjl2WkNCR2JHOXZjbWx1WnlCRVpXRnNaWEp6SUNaaGJYQTdJRWx1YzNSaGJHeGxjbk1nYm1WaGNpQlRaV3hrWlc0bkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1ltOWtlVG9nSjFObGRHRjFhMlYwTFVWaGMzUWdVMlYwWVhWclpYUWdTR0Z5WkhkdmIyUWdSbXh2YjNKcGJtY2dSR1ZoYkdWeWN5QW1ZVzF3T3lCSmJuTjBZV3hzWlhKeklDNGdTMmx1WjNNZ1VHRnlheUJJWVhKa2QyOXZaQ0JHYkc5dmNtbHVaeUJFWldGc1pYSnpJQ1poYlhBN0lFbHVjM1JoYkd4bGNuTWdMaUJGWVhOMElFbHpiR2x3SUVoaGNtUjNiMjlrSUVac2IyOXlhVzVuSUVSbFlXeGxjbk1nSmlCSmJuTjBZV3hzWlhKeklDNVRkRzl1ZVNCQ2NtOXZheUJJWVhKa2QyOXZaQ0JHYkc5dmNtbHVaeUJFWldGc1pYSnpJQ1lnU1c1emRHRnNiR1Z5Y3lBdUlGTmhhVzUwSUVwaGJXVnpJRWhoY21SM2IyOWtJRVpzYjI5eWFXNW5JRVJsWVd4bGNuTWdKaUJKYm5OMFlXeHNaWEp6SUM1U2FXUm5aU0JJWVhKa2QyOXZaQ0JHYkc5dmNtbHVaeUJFWldGc1pYSnpJQ1lnU1c1emRHRnNiR1Z5Y3lBdVRtVnpZMjl1YzJWMElFaGhjbVIzYjI5a0lFWnNiMjl5YVc1bklFUmxZV3hsY25NZ0ppQkpibk4wWVd4c1pYSnpJQzRnVFdGemRHbGpJRUpsWVdOb0lFaGhjbVIzYjI5a0lFWnNiMjl5YVc1bklFUmxZV3hsY25NZ0ppQkpibk4wWVd4c1pYSnpJQzVVWlhKeWVYWnBiR3hsSUVoaGNtUjNiMjlrSUVac2IyOXlhVzVuSUVSbFlXeGxjbk1nSmlCSmJuTjBZV3hzWlhKeklDNGdVR0YwWTJodlozVmxJRWhoY21SM2IyOWtJRVpzYjI5eWFXNW5JRVJsWVd4bGNuTWdKaUJKYm5OMFlXeHNaWEp6Snl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JkTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWnRMbkpsZG1sbGQzTWdQU0JiWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBiV2M2SUNkcGJXRm5aWE12Ykc5bmIxOTBkVzFpYkhKZk1qSXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ0owRnVaSEpoSUUxaGNuUnBiaWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmhkR1U2SUNjeUp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWTI5dGJXVnVkRG9nSjBSdmJHOXlJR3hoWW05eWFYTWdkbVZzYVhRZ1pHOXNiM0lnYVc0Z2JXOXNiR2wwSUdWNElITnBkQ0J1YVhOcElHTjFjR2xrWVhSaGRDQnVhWE5wSUhWc2JHRnRZMjhnWlhRZ1lXMWxkQ0JqYjI1elpXTjBaWFIxY2k0bkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGJXYzZJQ2RwYldGblpYTXZiRzluYjE5MGRXMWliSEpmTWpJdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JtRnRaVG9nSjBwdmFHNGdSRzlsSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbUYwWlRvZ0p6TW5MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCamIyMXRaVzUwT2lBblJYaGxjbU5wZEdGMGFXOXVJRzlqWTJGbFkyRjBJSFpsYm1saGJTQmxZU0JsZUdWeVkybDBZWFJwYjI0Z2JHRmliM0oxYlNCdWFYTnBJR0ZrSUdSdklHTjFjR2xrWVhSaGRDQmpkWEJwWkdGMFlYUWdZV3hwY1hWcGNDNG5MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBiV2M2SUNkcGJXRm5aWE12Ykc5bmIxOTBkVzFpYkhKZk1qSXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ0owRnVaSEpsZHlCTllYUjBKeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtRjBaVG9nSnpRbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JqYjIxdFpXNTBPaUFuVUdGeWFXRjBkWElnWVdScGNHbHphV05wYm1jZ1lXNXBiU0JwY25WeVpTQmhaR2x3YVhOcFkybHVaeUJsWVNCbGRDQmpiMjF0YjJSdklHUnZiRzl5SUdWcGRYTnRiMlFnWVcxbGRDNG5MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBiV2M2SUNkcGJXRm5aWE12Ykc5bmIxOTBkVzFpYkhKZk1qSXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ0owMWhkSFFnVDNKMGJ5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKaGRHVTZJQ2MxSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZMjl0YldWdWREb2dKMFY0WlhKamFYUmhkR2x2YmlCaGJtbHRJR3hoWW05eWFYTWdZM1Z3YVdSaGRHRjBJR0Z1YVcwZ1pXRWdiVzlzYkdsMElITnBkQzRuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JkTzF4dUlDQWdJQ0FnSUNCOUtTNWpZWFJqYUNnb1pYSnliM0lwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOdmJuTnZiR1V1Ykc5bktHVnljbTl5S1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1lXNW5kV3hoY2x4dUlDQWdJQ0FnSUNBdWJXOWtkV3hsS0NkaGJtZDFiR0Z5TG05c1pDY3BYRzRnSUNBZ0lDQWdJQzVqYjI1MGNtOXNiR1Z5S0Nkd2NtOW1hV3hsUTNSeUp5d2djSEp2Wm1sc1pVTjBjaWs3WEc1OUtTZ3BPMXh1SWwxOVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJXYjhHZWpcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9zY2VuZXMvcHJvZmlsZS9wcm9maWxlLmN0ci5qc1wiLFwiL3NjZW5lcy9wcm9maWxlXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIHByb2ZpbGUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdkaXJlY3RpdmUvc2NlbmVzL3Byb2ZpbGUvcHJvZmlsZS50cGwuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhci5vbGQnKS5kaXJlY3RpdmUoJ3Byb2ZpbGUnLCBwcm9maWxlKTtcbn0pKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbkJ5YjJacGJHVXVaR2x5TG1weklsMHNJbTVoYldWeklqcGJJbkJ5YjJacGJHVWlMQ0p5WlhOMGNtbGpkQ0lzSW5SbGJYQnNZWFJsVlhKc0lpd2lZVzVuZFd4aGNpSXNJbTF2WkhWc1pTSXNJbVJwY21WamRHbDJaU0pkTENKdFlYQndhVzVuY3lJNklqczdRVUZCUVN4RFFVRkRMRmxCUVUwN1FVRkRTQ3hoUVVGVFFTeFBRVUZVTEVkQlFXMUNPMEZCUTJZc1pVRkJUenRCUVVOSVF5eHpRa0ZCVlN4SFFVUlFPMEZCUlVoRExIbENRVUZoTzBGQlJsWXNVMEZCVUR0QlFVbElPenRCUVVWRVF5eFpRVU5MUXl4TlFVUk1MRU5CUTFrc1lVRkVXaXhGUVVWTFF5eFRRVVpNTEVOQlJXVXNVMEZHWml4RlFVVXdRa3dzVDBGR01VSTdRVUZIU0N4RFFWaEVJaXdpWm1sc1pTSTZJbkJ5YjJacGJHVXVaR2x5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLQ2dwSUQwK0lIdGNiaUFnSUNCbWRXNWpkR2x2YmlCd2NtOW1hV3hsS0NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WemRISnBZM1E2SUNkQkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUhSbGJYQnNZWFJsVlhKc09pQW5aR2x5WldOMGFYWmxMM05qWlc1bGN5OXdjbTltYVd4bEwzQnliMlpwYkdVdWRIQnNMbWgwYld3bkxGeHVJQ0FnSUNBZ0lDQjlPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHRnVaM1ZzWVhKY2JpQWdJQ0FnSUNBZ0xtMXZaSFZzWlNnbllXNW5kV3hoY2k1dmJHUW5LVnh1SUNBZ0lDQWdJQ0F1WkdseVpXTjBhWFpsS0Nkd2NtOW1hV3hsSnl3Z2NISnZabWxzWlNrN1hHNTlLU2dwTzF4dUlsMTlcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiV2I4R2VqXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvc2NlbmVzL3Byb2ZpbGUvcHJvZmlsZS5kaXIuanNcIixcIi9zY2VuZXMvcHJvZmlsZVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJykuZmFjdG9yeSgncHJvZmlsZUZhYycsIFtcIiRyb290U2NvcGVcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgZnVuY3Rpb24gZ2V0UHJvZmlsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiAkcm9vdFNjb3BlLm1ha2VSZXF1ZXN0KCdHRVQnLCAncHJvZmlsZS8xJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0UHJvZmlsZTogZ2V0UHJvZmlsZSgpXG4gICAgICAgIH07XG4gICAgfV0pO1xufSkoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluQnliMlpwYkdVdVptRmpMbXB6SWwwc0ltNWhiV1Z6SWpwYkltRnVaM1ZzWVhJaUxDSnRiMlIxYkdVaUxDSm1ZV04wYjNKNUlpd2lKSEp2YjNSVFkyOXdaU0lzSW1kbGRGQnliMlpwYkdVaUxDSnRZV3RsVW1WeGRXVnpkQ0pkTENKdFlYQndhVzVuY3lJNklqczdRVUZCUVN4RFFVRkRMRmxCUVUwN1FVRkRTRUVzV1VGRFMwTXNUVUZFVEN4RFFVTlpMR05CUkZvc1JVRkZTME1zVDBGR1RDeERRVVZoTEZsQlJtSXNSVUZGTWtJc1ZVRkJRME1zVlVGQlJDeEZRVUZuUWp0QlFVTnVReXhwUWtGQlUwTXNWVUZCVkN4SFFVRnpRanRCUVVOc1FpeHRRa0ZCVDBRc1YwRkJWMFVzVjBGQldDeERRVUYxUWl4TFFVRjJRaXhGUVVFNFFpeFhRVUU1UWl4RFFVRlFPMEZCUTBnN08wRkJSVVFzWlVGQlR6dEJRVU5JUkN4M1FrRkJXVUU3UVVGRVZDeFRRVUZRTzBGQlIwZ3NTMEZXVER0QlFWZElMRU5CV2tRaUxDSm1hV3hsSWpvaWNISnZabWxzWlM1bVlXTXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJb0tDa2dQVDRnZTF4dUlDQWdJR0Z1WjNWc1lYSmNiaUFnSUNBZ0lDQWdMbTF2WkhWc1pTZ25ZWEJ3TG5ObGNuWnBZMlZ6SnlsY2JpQWdJQ0FnSUNBZ0xtWmhZM1J2Y25rb0ozQnliMlpwYkdWR1lXTW5MQ0FvSkhKdmIzUlRZMjl3WlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1puVnVZM1JwYjI0Z1oyVjBVSEp2Wm1sc1pTZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdKSEp2YjNSVFkyOXdaUzV0WVd0bFVtVnhkV1Z6ZENnblIwVlVKeXdnSjNCeWIyWnBiR1V2TVNjcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2RsZEZCeWIyWnBiR1U2SUdkbGRGQnliMlpwYkdVb0tTeGNiaUFnSUNBZ0lDQWdJQ0FnSUgwN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1ZlNrb0tUdGNiaUpkZlE9PVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJXYjhHZWpcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9zY2VuZXMvcHJvZmlsZS9wcm9maWxlLmZhYy5qc1wiLFwiL3NjZW5lcy9wcm9maWxlXCIpIl19
