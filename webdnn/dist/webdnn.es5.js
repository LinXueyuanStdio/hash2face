(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WebDNN = {})));
}(this, (function (exports) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}











function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var common = createCommonjsModule(function (module, exports) {
'use strict';


var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
                (typeof Uint16Array !== 'undefined') &&
                (typeof Int32Array !== 'undefined');

function _has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

exports.assign = function (obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// reduce buffer size, avoiding mem copy
exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) { return buf; }
  if (buf.subarray) { return buf.subarray(0, size); }
  buf.length = size;
  return buf;
};


var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    // Fallback to ordinary array
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    var i, l, len, pos, chunk, result;

    // calculate data length
    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};

var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    return [].concat.apply([], chunks);
  }
};


// Enable/Disable typed arrays use, for testing
//
exports.setTyped = function (on) {
  if (on) {
    exports.Buf8  = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8  = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);
});

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.



/* Public constants ==========================================================*/
/* ===========================================================================*/


//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var Z_FIXED$1               = 4;
//var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
var Z_BINARY              = 0;
var Z_TEXT                = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var Z_UNKNOWN$1             = 2;

/*============================================================================*/


function zero$1(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES    = 2;
/* The three kinds of block type */

var MIN_MATCH$1    = 3;
var MAX_MATCH$1    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES$1  = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS$1      = 256;
/* number of literal bytes 0..255 */

var L_CODES$1       = LITERALS$1 + 1 + LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES$1       = 30;
/* number of distance codes */

var BL_CODES$1      = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE$1     = 2 * L_CODES$1 + 1;
/* maximum heap size */

var MAX_BITS$1      = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK   = 256;
/* end of block literal code */

var REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
var extra_lbits =   /* extra bits for each length code */
  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];

var extra_dbits =   /* extra bits for each distance code */
  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

var extra_blbits =  /* extra bits for each bit length code */
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];

var bl_order =
  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
var static_ltree  = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree  = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code    = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code  = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length   = new Array(LENGTH_CODES$1);
zero$1(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist     = new Array(D_CODES$1);
zero$1(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


var static_l_desc;
var static_d_desc;
var static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
function put_short(s, w) {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
}


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
function send_bits(s, value, length) {
  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
}


function send_code(s, c, tree) {
  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
}


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
function gen_bitlen(s, desc)
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
  var tree            = desc.dyn_tree;
  var max_code        = desc.max_code;
  var stree           = desc.stat_desc.static_tree;
  var has_stree       = desc.stat_desc.has_stree;
  var extra           = desc.stat_desc.extra_bits;
  var base            = desc.stat_desc.extra_base;
  var max_length      = desc.stat_desc.max_length;
  var h;              /* heap index */
  var n, m;           /* iterate over the tree elements */
  var bits;           /* bit length */
  var xbits;          /* extra bits */
  var f;              /* frequency */
  var overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
}


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
function gen_codes(tree, max_code, bl_count)
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
  var next_code = new Array(MAX_BITS$1 + 1); /* next code value for each bit length */
  var code = 0;              /* running code value */
  var bits;                  /* bit index */
  var n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS$1; bits++) {
    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    var len = tree[n * 2 + 1];
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
function tr_static_init() {
  var n;        /* iterates over tree elements */
  var bits;     /* bit counter */
  var length;   /* length value */
  var code;     /* code value */
  var dist;     /* distance index */
  var bl_count = new Array(MAX_BITS$1 + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES$1; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES$1 + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES$1; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES$1, MAX_BITS$1);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES$1, MAX_BL_BITS);

  //static_init_done = true;
}


/* ===========================================================================
 * Initialize a new block.
 */
function init_block(s) {
  var n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES$1;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES$1;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES$1; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
function bi_windup(s)
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
function copy_block(s, buf, len, header)
//DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
  bi_windup(s);        /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
//  while (len--) {
//    put_byte(s, *buf++);
//  }
  common.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
function smaller(tree, n, m, depth) {
  var _n2 = n * 2;
  var _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
function pqdownheap(s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
}


// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
function compress_block(s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist;           /* distance of matched string */
  var lc;             /* match length or unmatched char (if dist == 0) */
  var lx = 0;         /* running index in l_buf */
  var code;           /* the code to send */
  var extra;          /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS$1 + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");

    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
function build_tree(s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree     = desc.dyn_tree;
  var stree    = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems    = desc.stat_desc.elems;
  var n, m;          /* iterate over heap elements */
  var max_code = -1; /* largest code with non zero frequency */
  var node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE$1;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
}


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
function scan_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
function send_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
function build_bl_tree(s) {
  var max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
function send_all_trees(s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;

  /* Check for non-textual ("black-listed") bytes. */
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("white-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS$1; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
}


var static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
function _tr_init(s)
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
}


/* ===========================================================================
 * Send a stored block
 */
function _tr_stored_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  copy_block(s, buf, stored_len, true); /* with header */
}


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
function _tr_flush_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  var max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN$1) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
function _tr_tally(s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;

  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility

//#ifdef TRUNCATE_BLOCK
//  /* Try to guess if it is profitable to stop the current block here */
//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
//    /* Compute an upper bound for the compressed length */
//    out_length = s.last_lit*8;
//    in_length = s.strstart - s.block_start;
//
//    for (dcode = 0; dcode < D_CODES; dcode++) {
//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
//    }
//    out_length >>>= 3;
//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
//    //       s->last_lit, in_length, out_length,
//    //       100L - out_length*100L/in_length));
//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
//      return true;
//    }
//  }
//#endif

  return (s.last_lit === s.lit_bufsize - 1);
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

var _tr_init_1  = _tr_init;
var _tr_stored_block_1 = _tr_stored_block;
var _tr_flush_block_1  = _tr_flush_block;
var _tr_tally_1 = _tr_tally;
var _tr_align_1 = _tr_align;

var trees = {
	_tr_init: _tr_init_1,
	_tr_stored_block: _tr_stored_block_1,
	_tr_flush_block: _tr_flush_block_1,
	_tr_tally: _tr_tally_1,
	_tr_align: _tr_align_1
};

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function adler32(adler, buf, len, pos) {
  var s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
}


var adler32_1 = adler32;

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
function makeTable() {
  var c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();


function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;

  crc ^= -1;

  for (var i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}


var crc32_1 = crc32;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var messages = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.







/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
var Z_NO_FLUSH$1      = 0;
var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
var Z_FULL_FLUSH    = 3;
var Z_FINISH$1        = 4;
var Z_BLOCK         = 5;
//var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK$1            = 0;
var Z_STREAM_END$1    = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
//var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;


/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var Z_DEFAULT_COMPRESSION$1 = -1;


var Z_FILTERED            = 1;
var Z_HUFFMAN_ONLY        = 2;
var Z_RLE                 = 3;
var Z_FIXED               = 4;
var Z_DEFAULT_STRATEGY$1    = 0;

/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;


/* The deflate compression method */
var Z_DEFLATED$1  = 8;

/*============================================================================*/


var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_MEM_LEVEL = 8;


var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS      = 256;
/* number of literal bytes 0..255 */
var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES       = 30;
/* number of distance codes */
var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
var MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE     = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = messages[errorCode];
  return errorCode;
}

function rank(f) {
  return ((f) << 1) - ((f) > 4 ? 9 : 0);
}

function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(strm) {
  var s = strm.state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  common.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}


function flush_block_only(s, last) {
  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}


function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
function putShortMSB(s, b) {
//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  common.arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32_1(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32_1(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
}


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;      /* max hash chain length */
  var scan = s.strstart; /* current string */
  var match;                       /* matched string */
  var len;                           /* length of current match */
  var best_len = s.prev_length;              /* best match length so far */
  var nice_match = s.nice_match;             /* stop if match long enough */
  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;

  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1  = _win[scan + best_len - 1];
  var scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      common.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = (m >= _w_size ? m - _w_size : 0);
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    var curr = s.strstart + s.lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {

      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
//        s.block_start >= s.w_size)) {
//        throw  new Error("slide too late");
//      }

      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH$1) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->block_start >= 0L, "block gone");
//    if (s.block_start < 0) throw new Error("block gone");

    s.strstart += s.lookahead;
    s.lookahead = 0;

    /* Emit a stored block if pending_buf will be full: */
    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/


    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH$1) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head;        /* head of the hash chain */
  var bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$1) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH$1) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
function deflate_slow(s, flush) {
  var hash_head;          /* head of hash chain */
  var bflush;              /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$1) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$1) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush;            /* set if current block must be flushed */
  var prev;              /* byte at distance one to match */
  var scan, strend;      /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$1) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$1) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH$1) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$1) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;

configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED$1; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new common.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree  = new common.Buf16((2 * D_CODES + 1) * 2);
  this.bl_tree    = new common.Buf16((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new common.Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new common.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new common.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0;          /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0;      /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH$1;
  trees._tr_init(s);
  return Z_OK$1;
}


function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK$1) {
    lm_init(strm.state);
  }
  return ret;
}


function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
  strm.state.gzhead = head;
  return Z_OK$1;
}


function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR;
  }
  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION$1) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$1 ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new common.Buf8(s.w_size * 2);
  s.head = new common.Buf16(s.hash_size);
  s.prev = new common.Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4;

  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
  //s->pending_buf = (uchf *) overlay;
  s.pending_buf = new common.Buf8(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
  s.d_buf = 1 * s.lit_bufsize;

  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED$1, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
}


function deflate$1(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state ||
    flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  s = strm.state;

  if (!strm.output ||
      (!strm.input && strm.avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH$1)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  s.strm = strm; /* just in case */
  old_flush = s.last_flush;
  s.last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {

    if (s.wrap === 2) { // GZIP header
      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) { // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      }
      else {
        put_byte(s, (s.gzhead.text ? 1 : 0) +
                    (s.gzhead.hcrc ? 2 : 0) +
                    (!s.gzhead.extra ? 0 : 4) +
                    (!s.gzhead.name ? 0 : 8) +
                    (!s.gzhead.comment ? 0 : 16)
                );
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, (s.gzhead.time >> 8) & 0xff);
        put_byte(s, (s.gzhead.time >> 16) & 0xff);
        put_byte(s, (s.gzhead.time >> 24) & 0xff);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    else // DEFLATE header
    {
      var header = (Z_DEFLATED$1 + ((s.w_bits - 8) << 4)) << 8;
      var level_flags = -1;

      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= (level_flags << 6);
      if (s.strstart !== 0) { header |= PRESET_DICT; }
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1; // adler32(0L, Z_NULL, 0);
    }
  }

//#ifdef GZIP
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */

      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            break;
          }
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    }
    else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    }
    else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.status = HCRC_STATE;
      }
    }
    else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, (strm.adler >> 8) & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
        s.status = BUSY_STATE;
      }
    }
    else {
      s.status = BUSY_STATE;
    }
  }
//#endif

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK$1;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH$1) {
    return err(strm, Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH$1 && s.status !== FINISH_STATE)) {
    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
        configuration_table[s.level].func(s, flush));

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK$1;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      }
      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK$1;
      }
    }
  }
  //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}

  if (flush !== Z_FINISH$1) { return Z_OK$1; }
  if (s.wrap <= 0) { return Z_STREAM_END$1; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK$1 : Z_STREAM_END$1;
}

function deflateEnd(strm) {
  var status;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  status = strm.state.status;
  if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK$1;
}


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
function deflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var s;
  var str, n;
  var wrap;
  var avail;
  var next;
  var input;
  var tmpDict;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  s = strm.state;
  wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    tmpDict = new common.Buf8(s.w_size);
    common.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK$1;
}


var deflateInit_1 = deflateInit;
var deflateInit2_1 = deflateInit2;
var deflateReset_1 = deflateReset;
var deflateResetKeep_1 = deflateResetKeep;
var deflateSetHeader_1 = deflateSetHeader;
var deflate_2$1 = deflate$1;
var deflateEnd_1 = deflateEnd;
var deflateSetDictionary_1 = deflateSetDictionary;
var deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/

var deflate_1$2 = {
	deflateInit: deflateInit_1,
	deflateInit2: deflateInit2_1,
	deflateReset: deflateReset_1,
	deflateResetKeep: deflateResetKeep_1,
	deflateSetHeader: deflateSetHeader_1,
	deflate: deflate_2$1,
	deflateEnd: deflateEnd_1,
	deflateSetDictionary: deflateSetDictionary_1,
	deflateInfo: deflateInfo
};

// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
var STR_APPLY_OK = true;
var STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, [ 0 ]); } catch (__) { STR_APPLY_OK = false; }
try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
var _utf8len = new common.Buf8(256);
for (var q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
var string2buf = function (str) {
  var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new common.Buf8(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper (used in 2 places)
function buf2binstring(buf, len) {
  // use fallback for big arrays to avoid stack overflow
  if (len < 65537) {
    if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
      return String.fromCharCode.apply(null, common.shrinkBuf(buf, len));
    }
  }

  var result = '';
  for (var i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}


// Convert byte array to binary string
var buf2binstring_1 = function (buf) {
  return buf2binstring(buf, buf.length);
};


// Convert binary string (typed, when possible)
var binstring2buf = function (str) {
  var buf = new common.Buf8(str.length);
  for (var i = 0, len = buf.length; i < len; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
};


// convert array to string
var buf2string = function (buf, max) {
  var i, out, c, c_len;
  var len = max || buf.length;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  var utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var utf8border = function (buf, max) {
  var pos;

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};

var strings = {
	string2buf: string2buf,
	buf2binstring: buf2binstring_1,
	binstring2buf: binstring2buf,
	buf2string: buf2string,
	utf8border: utf8border
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

var zstream = ZStream;

var toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

var Z_NO_FLUSH      = 0;
var Z_FINISH        = 4;

var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_SYNC_FLUSH    = 2;

var Z_DEFAULT_COMPRESSION = -1;

var Z_DEFAULT_STRATEGY    = 0;

var Z_DEFLATED  = 8;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array|Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
 * push a chunk with explicit flush (call [[Deflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate(options) {
  if (!(this instanceof Deflate)) return new Deflate(options);

  this.options = common.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY,
    to: ''
  }, options || {});

  var opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new zstream();
  this.strm.avail_out = 0;

  var status = deflate_1$2.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }

  if (opt.header) {
    deflate_1$2.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    var dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = deflate_1$2.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK) {
      throw new Error(messages[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the compression context.
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * array format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var status, _mode;

  if (this.ended) { return false; }

  _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH : Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new common.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = deflate_1$2.deflate(strm, _mode);    /* no bad return value */

    if (status !== Z_STREAM_END && status !== Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }
    if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH))) {
      if (this.options.to === 'string') {
        this.onData(strings.buf2binstring(common.shrinkBuf(strm.output, strm.next_out)));
      } else {
        this.onData(common.shrinkBuf(strm.output, strm.next_out));
      }
    }
  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);

  // Finalize on the last chunk.
  if (_mode === Z_FINISH) {
    status = deflate_1$2.deflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === Z_SYNC_FLUSH) {
    this.onEnd(Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate(input, options) {
  var deflator = new Deflate(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || messages[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return deflate(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate(input, options);
}


var Deflate_1 = Deflate;
var deflate_2 = deflate;
var deflateRaw_1 = deflateRaw;
var gzip_1 = gzip;

var deflate_1 = {
	Deflate: Deflate_1,
	deflate: deflate_2,
	deflateRaw: deflateRaw_1,
	gzip: gzip_1
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
var BAD$1 = 30;       /* got a data error -- remain here until reset */
var TYPE$1 = 12;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
var inffast = function inflate_fast(strm, start) {
  var state;
  var _in;                    /* local strm.input */
  var last;                   /* have enough input while in < last */
  var _out;                   /* local strm.output */
  var beg;                    /* inflate()'s initial strm.output */
  var end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  var dmax;                   /* maximum distance from zlib header */
//#endif
  var wsize;                  /* window size or zero if not using window */
  var whave;                  /* valid bytes in the window */
  var wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  var s_window;               /* allocated sliding window, if wsize != 0 */
  var hold;                   /* local strm.hold */
  var bits;                   /* local strm.bits */
  var lcode;                  /* local strm.lencode */
  var dcode;                  /* local strm.distcode */
  var lmask;                  /* mask for first level of length codes */
  var dmask;                  /* mask for first level of distance codes */
  var here;                   /* retrieved table entry */
  var op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  var len;                    /* match length, unused bytes */
  var dist;                   /* match distance */
  var from;                   /* where to copy match from */
  var from_source;


  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD$1;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD$1;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD$1;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE$1;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD$1;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.



var MAXBITS = 15;
var ENOUGH_LENS$1 = 852;
var ENOUGH_DISTS$1 = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES$1 = 0;
var LENS$1 = 1;
var DISTS$1 = 2;

var lbase = [ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];

var lext = [ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
];

var dbase = [ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
];

var dext = [ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
];

var inftrees = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
{
  var bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  var len = 0;               /* a code's length in bits */
  var sym = 0;               /* index of code symbols */
  var min = 0, max = 0;          /* minimum and maximum code lengths */
  var root = 0;              /* number of index bits for root table */
  var curr = 0;              /* number of index bits for current table */
  var drop = 0;              /* code bits to drop for sub-table */
  var left = 0;                   /* number of prefix codes available */
  var used = 0;              /* code entries in table used */
  var huff = 0;              /* Huffman code */
  var incr;              /* for incrementing code, index */
  var fill;              /* index for replicating entries */
  var low;               /* low bits for current root entry */
  var mask;              /* mask for low root bits */
  var next;             /* next available space in table */
  var base = null;     /* base value table to use */
  var base_index = 0;
//  var shoextra;    /* extra bits table to use */
  var end;                    /* use base and extra for symbol > end */
  var count = new common.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  var offs = new common.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  var extra = null;
  var extra_index = 0;

  var here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES$1 || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES$1) {
    base = extra = work;    /* dummy value--not used */
    end = 19;

  } else if (type === LENS$1) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
    (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
        (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.







var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var Z_FINISH$2        = 4;
var Z_BLOCK$1         = 5;
var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK$2            = 0;
var Z_STREAM_END$2    = 1;
var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR$1  = -2;
var Z_DATA_ERROR$1    = -3;
var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR$1     = -5;
//var Z_VERSION_ERROR = -6;

/* The deflate compression method */
var Z_DEFLATED$2  = 8;


/* STATES ====================================================================*/
/* ===========================================================================*/


var HEAD = 1;       /* i: waiting for magic header */
var FLAGS = 2;      /* i: waiting for method and flags (gzip) */
var TIME = 3;       /* i: waiting for modification time (gzip) */
var OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
var EXLEN = 5;      /* i: waiting for extra length (gzip) */
var EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
var NAME = 7;       /* i: waiting for end of file name (gzip) */
var COMMENT = 8;    /* i: waiting for end of comment (gzip) */
var HCRC = 9;       /* i: waiting for header crc (gzip) */
var DICTID = 10;    /* i: waiting for dictionary check value */
var DICT = 11;      /* waiting for inflateSetDictionary() call */
var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
var TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
var STORED = 14;    /* i: waiting for stored size (length and complement) */
var COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
var COPY = 16;      /* i/o: waiting for input or output to copy stored block */
var TABLE = 17;     /* i: waiting for dynamic block table lengths */
var LENLENS = 18;   /* i: waiting for code length code lengths */
var CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
var LEN_ = 20;      /* i: same as LEN below, but only first time in */
var LEN = 21;       /* i: waiting for length/lit/eob code */
var LENEXT = 22;    /* i: waiting for length extra bits */
var DIST = 23;      /* i: waiting for distance code */
var DISTEXT = 24;   /* i: waiting for distance extra bits */
var MATCH = 25;     /* o: waiting for output space to copy string */
var LIT = 26;       /* o: waiting for output space to write literal */
var CHECK = 27;     /* i: waiting for 32-bit check value */
var LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
var DONE = 29;      /* finished check, done -- remain here until reset */
var BAD = 30;       /* got a data error -- remain here until reset */
var MEM = 31;       /* got an inflate() memory error -- remain here until reset */
var SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS$1 = 15;
/* 32K LZ77 window */
var DEF_WBITS = MAX_WBITS$1;


function zswap32(q) {
  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
}


function InflateState() {
  this.mode = 0;             /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new common.Buf16(320); /* temporary storage for code lengths */
  this.work = new common.Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new common.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new common.Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK$2;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;

  /* get the state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
  state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) { return Z_STREAM_ERROR$1; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.window = null/*Z_NULL*/;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$2) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix;
var distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new common.Buf32(512);
    distfix = new common.Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inftrees(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inftrees(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new common.Buf8(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    common.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    common.arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      common.arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
}

function inflate$1(strm, flush) {
  var state;
  var input, output;          // input/output buffers
  var next;                   /* next input INDEX */
  var put;                    /* next output INDEX */
  var have, left;             /* available input and output */
  var hold;                   /* bit buffer */
  var bits;                   /* bits in bit buffer */
  var _in, _out;              /* save starting available input and output */
  var copy;                   /* number of stored or match bytes to copy */
  var from;                   /* where to copy match bytes from */
  var from_source;
  var here = 0;               /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len;                    /* length to copy for repeats, bits to drop */
  var ret;                    /* return code */
  var hbuf = new common.Buf8(4);    /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */
    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];


  if (!strm || !strm.state || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR$1;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK$2;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        state.flags = 0;           /* expect zlib header */
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED$2) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        else if (len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }
        state.dmax = 1 << len;
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED$2) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if (state.flags & 0x0200) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32_1(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Array(state.head.extra_len);
              }
              common.arraySet(
                state.head.extra,
                input,
                next,
                // extra field is limited to 65536 bytes
                // - no need for additional size check
                copy,
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if (state.flags & 0x0200) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if (state.flags & 0x0200) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if (state.flags & 0x0200) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK$1 || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          common.arraySet(output, input, next, copy, put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inffast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if (_out) {
            strm.adler = state.check =
                /*UPDATE(state.check, put - _out, _out);*/
                (state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END$2;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR$1;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR$1;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH$2))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH$2) && ret === Z_OK$2) {
    ret = Z_BUF_ERROR$1;
  }
  return ret;
}

function inflateEnd(strm) {

  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
    return Z_STREAM_ERROR$1;
  }

  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$2;
}

function inflateGetHeader(strm, head) {
  var state;

  /* check state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
  state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR$1; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK$2;
}

function inflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var state;
  var dictid;
  var ret;

  /* check state */
  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR$1; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32_1(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK$2;
}

var inflateReset_1 = inflateReset;
var inflateReset2_1 = inflateReset2;
var inflateResetKeep_1 = inflateResetKeep;
var inflateInit_1 = inflateInit;
var inflateInit2_1 = inflateInit2;
var inflate_2$1 = inflate$1;
var inflateEnd_1 = inflateEnd;
var inflateGetHeader_1 = inflateGetHeader;
var inflateSetDictionary_1 = inflateSetDictionary;
var inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/

var inflate_1$2 = {
	inflateReset: inflateReset_1,
	inflateReset2: inflateReset2_1,
	inflateResetKeep: inflateResetKeep_1,
	inflateInit: inflateInit_1,
	inflateInit2: inflateInit2_1,
	inflate: inflate_2$1,
	inflateEnd: inflateEnd_1,
	inflateGetHeader: inflateGetHeader_1,
	inflateSetDictionary: inflateSetDictionary_1,
	inflateInfo: inflateInfo
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var constants = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

var gzheader = GZheader;

var toString$1 = Object.prototype.toString;

/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
 * push a chunk with explicit flush (call [[Inflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate(options) {
  if (!(this instanceof Inflate)) return new Inflate(options);

  this.options = common.assign({
    chunkSize: 16384,
    windowBits: 0,
    to: ''
  }, options || {});

  var opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new zstream();
  this.strm.avail_out = 0;

  var status  = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== constants.Z_OK) {
    throw new Error(messages[status]);
  }

  this.header = new gzheader();

  inflate_1$2.inflateGetHeader(this.strm, this.header);
}

/**
 * Inflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var dictionary = this.options.dictionary;
  var status, _mode;
  var next_out_utf8, tail, utf8str;
  var dict;

  // Flag to properly process Z_BUF_ERROR on testing inflate call
  // when we check that all output data was flushed.
  var allowBufError = false;

  if (this.ended) { return false; }
  _mode = (mode === ~~mode) ? mode : ((mode === true) ? constants.Z_FINISH : constants.Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // Only binary strings can be decompressed on practice
    strm.input = strings.binstring2buf(data);
  } else if (toString$1.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new common.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = inflate_1$2.inflate(strm, constants.Z_NO_FLUSH);    /* no bad return value */

    if (status === constants.Z_NEED_DICT && dictionary) {
      // Convert data if needed
      if (typeof dictionary === 'string') {
        dict = strings.string2buf(dictionary);
      } else if (toString$1.call(dictionary) === '[object ArrayBuffer]') {
        dict = new Uint8Array(dictionary);
      } else {
        dict = dictionary;
      }

      status = inflate_1$2.inflateSetDictionary(this.strm, dict);

    }

    if (status === constants.Z_BUF_ERROR && allowBufError === true) {
      status = constants.Z_OK;
      allowBufError = false;
    }

    if (status !== constants.Z_STREAM_END && status !== constants.Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === constants.Z_STREAM_END || (strm.avail_in === 0 && (_mode === constants.Z_FINISH || _mode === constants.Z_SYNC_FLUSH))) {

        if (this.options.to === 'string') {

          next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          tail = strm.next_out - next_out_utf8;
          utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) { common.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }

          this.onData(utf8str);

        } else {
          this.onData(common.shrinkBuf(strm.output, strm.next_out));
        }
      }
    }

    // When no more input data, we should check that internal inflate buffers
    // are flushed. The only way to do it when avail_out = 0 - run one more
    // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
    // Here we set flag to process this error properly.
    //
    // NOTE. Deflate does not return error in this case and does not needs such
    // logic.
    if (strm.avail_in === 0 && strm.avail_out === 0) {
      allowBufError = true;
    }

  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== constants.Z_STREAM_END);

  if (status === constants.Z_STREAM_END) {
    _mode = constants.Z_FINISH;
  }

  // Finalize on the last chunk.
  if (_mode === constants.Z_FINISH) {
    status = inflate_1$2.inflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === constants.Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === constants.Z_SYNC_FLUSH) {
    this.onEnd(constants.Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === constants.Z_OK) {
    if (this.options.to === 'string') {
      // Glue & convert here, until we teach pako to send
      // utf8 aligned strings to onData
      this.result = this.chunks.join('');
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
 *   , output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err)
 *   console.log(err);
 * }
 * ```
 **/
function inflate(input, options) {
  var inflator = new Inflate(options);

  inflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) { throw inflator.msg || messages[inflator.err]; }

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return inflate(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


var Inflate_1 = Inflate;
var inflate_2 = inflate;
var inflateRaw_1 = inflateRaw;
var ungzip  = inflate;

var inflate_1 = {
	Inflate: Inflate_1,
	inflate: inflate_2,
	inflateRaw: inflateRaw_1,
	ungzip: ungzip
};

var assign    = common.assign;





var pako$1 = {};

assign(pako$1, deflate_1, inflate_1, constants);

var pako_1 = pako$1;

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @private
 */
var pako = pako_1;
/**
 * @protected
 */
var WeightDecoderEightbit = /** @class */ (function () {
    function WeightDecoderEightbit() {
    }
    WeightDecoderEightbit.prototype.decode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded_arrays, total_dst_length, data_view, src_offset, dst_offset_1, body_size, scale, scaled_table, i, src_data_view, decompressed, dec_size, decoded_array, s, dst, dst_offset, i;
            return __generator(this, function (_a) {
                decoded_arrays = [];
                total_dst_length = 0;
                data_view = new DataView(data.buffer, data.byteOffset);
                src_offset = 0;
                while (src_offset < data.length) {
                    dst_offset_1 = data_view.getInt32(src_offset, true);
                    src_offset += 4;
                    body_size = data_view.getInt32(src_offset, true);
                    src_offset += 4;
                    scale = data_view.getFloat32(src_offset, true);
                    src_offset += 8;
                    scaled_table = new Float32Array(256);
                    for (i = 0; i < 256; i++) {
                        scaled_table[i] = WeightDecoderEightbit.decode_table[i & 0x7F] * scale * (i < 128 ? 1.0 : -1.0);
                    }
                    src_data_view = new Uint8Array(data.buffer, data.byteOffset + src_offset, body_size);
                    decompressed = pako.inflate(src_data_view);
                    dec_size = decompressed.length;
                    decoded_array = new Float32Array(dec_size);
                    for (s = 0; s < dec_size; s++) {
                        decoded_array[s] = scaled_table[decompressed[s]];
                    }
                    decoded_arrays.push(decoded_array);
                    total_dst_length += dec_size;
                    src_offset += body_size;
                }
                dst = new Float32Array(total_dst_length);
                dst_offset = 0;
                for (i = 0; i < decoded_arrays.length; i++) {
                    dst.set(decoded_arrays[i], dst_offset);
                    dst_offset += decoded_arrays[i].length;
                }
                return [2 /*return*/, dst];
            });
        });
    };
    WeightDecoderEightbit.decode_table = [0.0, 2.750000021e-06, 7.249999726e-06, 1.875000089e-05, 3.624999954e-05, 5.874999624e-05, 8.624999464e-05,
        1.437500032e-04, 2.312500001e-04, 3.187500115e-04, 4.062500084e-04, 5.187499919e-04, 6.562499912e-04,
        7.937499322e-04, 9.312499315e-04, 1.218750025e-03, 1.656249980e-03, 2.093750052e-03, 2.531250007e-03,
        2.968749963e-03, 3.406249918e-03, 3.843750106e-03, 4.281249829e-03, 4.843750037e-03, 5.531250034e-03,
        6.218749564e-03, 6.906249560e-03, 7.593749557e-03, 8.281249553e-03, 8.968749084e-03, 9.656248614e-03,
        1.109374966e-02, 1.328125037e-02, 1.546875015e-02, 1.765624993e-02, 1.984374970e-02, 2.203124948e-02,
        2.421874925e-02, 2.640625089e-02, 2.859375067e-02, 3.078125045e-02, 3.296874836e-02, 3.515625000e-02,
        3.734375164e-02, 3.953124955e-02, 4.171875119e-02, 4.390624911e-02, 4.671875015e-02, 5.015625060e-02,
        5.359374732e-02, 5.703124776e-02, 6.046874821e-02, 6.390624493e-02, 6.734374911e-02, 7.078124583e-02,
        7.421874255e-02, 7.765624672e-02, 8.109374344e-02, 8.453124017e-02, 8.796874434e-02, 9.140624106e-02,
        9.484373778e-02, 9.828124195e-02, 1.054687500e-01, 1.164062470e-01, 1.273437440e-01, 1.382812560e-01,
        1.492187530e-01, 1.601562500e-01, 1.710937470e-01, 1.820312440e-01, 1.929687560e-01, 2.039062530e-01,
        2.148437500e-01, 2.257812470e-01, 2.367187440e-01, 2.476562560e-01, 2.585937381e-01, 2.695312500e-01,
        2.804687619e-01, 2.914062440e-01, 3.023437560e-01, 3.132812381e-01, 3.242187500e-01, 3.351562619e-01,
        3.460937440e-01, 3.570312560e-01, 3.679687381e-01, 3.789062500e-01, 3.898437619e-01, 4.007812440e-01,
        4.117187560e-01, 4.226562381e-01, 4.335937500e-01, 4.445312619e-01, 4.585937560e-01, 4.757812321e-01,
        4.929687381e-01, 5.101562142e-01, 5.273437500e-01, 5.445312262e-01, 5.617187023e-01, 5.789062381e-01,
        5.960937142e-01, 6.132812500e-01, 6.304687262e-01, 6.476562023e-01, 6.648437381e-01, 6.820312142e-01,
        6.992186904e-01, 7.164062262e-01, 7.335937023e-01, 7.507811785e-01, 7.679687142e-01, 7.851561904e-01,
        8.023436666e-01, 8.195312023e-01, 8.367186785e-01, 8.539061546e-01, 8.710936904e-01, 8.882811666e-01,
        9.054686427e-01, 9.226561785e-01, 9.398436546e-01, 9.570311308e-01, 9.742186666e-01, 9.914061427e-01, 1.0,
    ];
    return WeightDecoderEightbit;
}());

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @protected
 */
var WeightDecoderRaw = /** @class */ (function () {
    function WeightDecoderRaw() {
    }
    WeightDecoderRaw.prototype.decode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Float32Array(data.buffer, data.byteOffset, data.byteLength / 4)];
            });
        });
    };
    return WeightDecoderRaw;
}());

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @protected
 */
function getWeightDecoder(name) {
    switch (name) {
        case 'raw':
            return new WeightDecoderRaw();
        case 'eightbit':
            return new WeightDecoderEightbit();
        default:
            throw new Error('Unknown weight encoding');
    }
}

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @private
 */
var NOT_SCHEDULED = -1;
/**
 * Schedule function which is called too much frequently.
 *
 * @private
 */
var DispatchScheduler = /** @class */ (function () {
    function DispatchScheduler() {
        this.scheduledCallbackId = NOT_SCHEDULED;
    }
    /**
     * Register scheduled function. If already other function is scheduled, it is canceled and dispatcher will dispatch only
     * function which is registered at last.
     * @param fn scheduled function
     */
    DispatchScheduler.prototype.request = function (fn) {
        var _this = this;
        this.fn = fn;
        if (this.scheduledCallbackId == NOT_SCHEDULED) {
            this.scheduledCallbackId = requestAnimationFrame(function () { return _this.forceDispatch(); });
        }
    };
    /**
     * Dispatch scheduled function just now. If no function is scheduled, dispatcher do nothing.
     */
    DispatchScheduler.prototype.forceDispatch = function () {
        if (this.scheduledCallbackId == NOT_SCHEDULED)
            return;
        this.cancel();
        this.fn();
    };
    /**
     * Cancel scheduled function. If no function is scheduled, dispatcher do nothing.
     */
    DispatchScheduler.prototype.cancel = function () {
        if (this.scheduledCallbackId == NOT_SCHEDULED)
            return;
        cancelAnimationFrame(this.scheduledCallbackId);
        this.scheduledCallbackId = NOT_SCHEDULED;
    };
    return DispatchScheduler;
}());

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @protected
 */
var transformDelegate = function (url) { return url; };
/**
 * Transform url generated based on current active backend
 * @param url transformed url
 * @protected
 */
function transformUrl(url) {
    return transformDelegate(url);
}
/**
 * Register delegate function for transform url.
 * @param delegate Delegate function which will be called with original url, and must return converted url strings.
 * @protected
 */
function registerTransformUrlDelegate(delegate) {
    transformDelegate = delegate;
}
/**
 * Fetch function. WebDNN API use this function instead of original `fetch` function.
 * FIXME
 * @param input Requested url
 * @param init Additional information about webdnnFetch
 * @param init.ignoreCache If true, cache is ignored by appending '?t=(timestamp)' to the end of request url.
 * @returns Response
 * @protected
 */
function webdnnFetch(input, init) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof input == 'string') {
                        input = transformUrl(input) + ((init && init.ignoreCache) ? '?t=' + Date.now() : '');
                    }
                    else {
                        input = Object.assign({}, input, {
                            url: transformUrl(input.url) + ((init && init.ignoreCache) ? '?t=' + Date.now() : '')
                        });
                    }
                    if (!(typeof input == 'string' && isXHR2WithBlobSupported())) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchUsingXHR(input, init && init.progressCallback)];
                case 1:
                    res = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, fetch(input, init)];
                case 3:
                    res = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!res.ok)
                        throw new Error("Fetch returns status code " + res.status + ": " + res.statusText);
                    return [2 /*return*/, res];
            }
        });
    });
}
/**
 * Read `Response.body` stream as ArrayBuffer. This function provide progress information by callback.
 * @param res Response object
 * @param callback Callback function.
 * @returns ArrayBuffer
 * @protected
 */
function readArrayBufferProgressively(res, callback) {
    if (!callback || !res.body)
        return res.arrayBuffer();
    var contentLength = res.headers.get('Content-Length');
    if (!contentLength)
        return res.arrayBuffer();
    var total = parseInt(contentLength);
    var buffer = new Uint8Array(total);
    var loaded = 0;
    var reader = res.body.getReader();
    var callbackScheduler = new DispatchScheduler();
    function accumulateLoadedSize(chunk) {
        buffer.set(chunk.value, loaded);
        loaded += chunk.value.length;
        if (callback) {
            callbackScheduler.request(function () { return callback(loaded, total); });
        }
        if (loaded == total) {
            callbackScheduler.forceDispatch();
            return buffer.buffer;
        }
        else {
            return reader.read().then(accumulateLoadedSize);
        }
    }
    return reader.read().then(accumulateLoadedSize);
}
/**
 * check whether XMLHttpRequest with Blob type is supported or not
 * @protected
 */
function isXHR2WithBlobSupported() {
    if (!window.hasOwnProperty('ProgressEvent') || !window.hasOwnProperty('FormData')) {
        return false;
    }
    var xhr = new XMLHttpRequest();
    if (typeof xhr.responseType === 'string') {
        try {
            xhr.responseType = 'blob';
            return xhr.responseType === 'blob';
        }
        catch (e) {
            return false;
        }
    }
    else {
        return false;
    }
}
/**
 * fetch with XMLHttpRequest
 * @protected
 */
function fetchUsingXHR(url, callback) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "blob";
        var callbackScheduler = new DispatchScheduler();
        req.onload = function (event) {
            callbackScheduler.forceDispatch();
            var res = new Response(req.response);
            resolve(res);
        };
        req.onprogress = function (event) {
            if (callback) {
                callbackScheduler.request(function () { return callback(event.loaded, event.total); });
            }
        };
        req.onerror = function (event) {
            reject(event);
        };
        req.send(null);
    });
}

/**
 * @module webdnn
 */
/**
 * PlaceholderContext manages the placeholders
 * @protected
 */
var PlaceholderContext = /** @class */ (function () {
    function PlaceholderContext(values) {
        this.values = {};
        if (values) {
            this.update(values);
        }
    }
    Object.defineProperty(PlaceholderContext.prototype, "isResolved", {
        get: function () {
            return Object.values(this.values).every(function (value) { return typeof value == 'number'; });
        },
        enumerable: true,
        configurable: true
    });
    PlaceholderContext.prototype.update = function (values) {
        this.values = Object.assign(this.values, values);
    };
    PlaceholderContext.prototype.resolve = function (placeholder) {
        var _this = this;
        // Literal value => return itself.
        if (typeof placeholder !== 'object')
            return placeholder;
        // Placeholder object ( { eval: string } ) => resolve
        if (Object.keys(placeholder).length == 1 && 'eval' in placeholder) {
            if (!this.isResolved)
                throw Error("Not all placeholders are resolved: " + this);
            return (function (placeholders) { return eval(placeholder.eval); })(this.values);
        }
        // Array => deep copy
        if (placeholder instanceof Array) {
            return placeholder.map(function (value) { return _this.resolve(value); });
        }
        // Object => deep copy
        return Object.entries(placeholder)
            .reduce(function (result, _a) {
            var key = _a[0], value = _a[1];
            result[key] = _this.resolve(value);
            return result;
        }, {});
    };
    PlaceholderContext.prototype.toString = function () {
        return JSON.stringify(this.values);
    };
    return PlaceholderContext;
}());

/**
 * @protected
 */
function flatten(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        var v = arr[i];
        if (v instanceof Array) {
            result.splice(result.length, 0, flatten(v));
        }
        else {
            result[result.length] = v;
        }
    }
    return result;
}
/**
 * SymbolicTypedArray is wrapper class of buffers used in DNN model.
 */
var SymbolicTypedArray = /** @class */ (function () {
    /**
     * toActual:
     *
     * If this buffer view is initialized based on placeholder offset or size and the placeholder is not resolved,
     * the error is thrown.
     */
    /**
     * @param {Allocation} allocation
     * @param {PlaceholderContext} placeholderContext
     * @param {boolean} ignoreOffsetOnActual
     * @protected
     */
    function SymbolicTypedArray(allocation, placeholderContext, ignoreOffsetOnActual) {
        if (ignoreOffsetOnActual === void 0) { ignoreOffsetOnActual = false; }
        this.ignoreOffsetOnActual = ignoreOffsetOnActual;
        this.allocation = allocation;
        if (this.isDynamic) {
            if (!placeholderContext) {
                throw Error('PlaceholderContext must be required when SymbolicTypedArray is initialized as dynamic buffer view.');
            }
        }
        this.placeholderContext = placeholderContext;
    }
    /**
     * @protected
     */
    SymbolicTypedArray.prototype.setArrayBuffer = function (arrayBuffer) {
        this.arrayBuffer = arrayBuffer;
    };
    Object.defineProperty(SymbolicTypedArray.prototype, "name", {
        /**
         * @protected
         */
        get: function () {
            return this.allocation.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolicTypedArray.prototype, "isDynamic", {
        /**
         * @protected
         */
        get: function () {
            return (typeof this.allocation.offset !== 'number' || typeof this.allocation.size !== 'number');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolicTypedArray.prototype, "offset", {
        /**
         * @protected
         */
        get: function () {
            //TODO
            if (this.isDynamic) {
                return this.placeholderContext.resolve(this.allocation.offset);
            }
            else {
                return this.allocation.offset;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolicTypedArray.prototype, "length", {
        /**
         * The number of elements in this buffer. Actual byte size is `(length * SIZE_OF_FLOAT)`.
         */
        get: function () {
            if (this.isDynamic) {
                return this.placeholderContext.resolve(this.allocation.size);
            }
            else {
                return this.allocation.size;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets a value or an array of values.
     *
     * @param array A typed or untyped array of values to set.
     * @param offset The index at which the values will be written.
     */
    SymbolicTypedArray.prototype.set = function (array, offset) {
        return this.toActual().set(flatten(array), offset);
    };
    return SymbolicTypedArray;
}());

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @protected
 */
var SymbolicFloat32Array = /** @class */ (function (_super) {
    __extends(SymbolicFloat32Array, _super);
    function SymbolicFloat32Array() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SymbolicFloat32Array.prototype.toActual = function () {
        if (!this.arrayBuffer) {
            throw new Error('Internal buffer for this variable is not set. DescriptorRunner.setPlaceholderValue() have to be called before calling this function.');
        }
        return new Float32Array(this.arrayBuffer, this.ignoreOffsetOnActual ? 0 : this.offset * Float32Array.BYTES_PER_ELEMENT, this.length);
    };
    return SymbolicFloat32Array;
}(SymbolicTypedArray));

var localforage_nopromises_min = createCommonjsModule(function (module, exports) {
/*!
    localForage -- Offline Storage, Improved
    Version 1.5.4
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/
!function(a){module.exports=a();}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof commonjsRequire&&commonjsRequire;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c||a)},k,k.exports,a,b,c,d);}return c[g].exports}for(var f="function"==typeof commonjsRequire&&commonjsRequire,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";function d(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function e(){try{if("undefined"!=typeof indexedDB)return indexedDB;if("undefined"!=typeof webkitIndexedDB)return webkitIndexedDB;if("undefined"!=typeof mozIndexedDB)return mozIndexedDB;if("undefined"!=typeof OIndexedDB)return OIndexedDB;if("undefined"!=typeof msIndexedDB)return msIndexedDB}catch(a){return}}function f(){try{if(!ta)return!1;var a="undefined"!=typeof openDatabase&&/(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)&&!/BlackBerry/.test(navigator.platform),b="function"==typeof fetch&&-1!==fetch.toString().indexOf("[native code");return(!a||b)&&"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange}catch(a){return!1}}function g(a,b){a=a||[],b=b||{};try{return new Blob(a,b)}catch(f){if("TypeError"!==f.name)throw f;for(var c="undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder,d=new c,e=0;e<a.length;e+=1)d.append(a[e]);return d.getBlob(b.type)}}function h(a,b){b&&a.then(function(a){b(null,a);},function(a){b(a);});}function i(a,b,c){"function"==typeof b&&a.then(b),"function"==typeof c&&a.catch(c);}function j(a){return"string"!=typeof a&&(console.warn(a+" used as a key, but it is not a string."),a=String(a)),a}function k(){if(arguments.length&&"function"==typeof arguments[arguments.length-1])return arguments[arguments.length-1]}function l(a){for(var b=a.length,c=new ArrayBuffer(b),d=new Uint8Array(c),e=0;e<b;e++)d[e]=a.charCodeAt(e);return c}function m(a){return new wa(function(b){var c=a.transaction(xa,Aa),d=g([""]);c.objectStore(xa).put(d,"key"),c.onabort=function(a){a.preventDefault(),a.stopPropagation(),b(!1);},c.oncomplete=function(){var a=navigator.userAgent.match(/Chrome\/(\d+)/),c=navigator.userAgent.match(/Edge\//);b(c||!a||parseInt(a[1],10)>=43);};}).catch(function(){return!1})}function n(a){return"boolean"==typeof ua?wa.resolve(ua):m(a).then(function(a){return ua=a})}function o(a){var b=va[a.name],c={};c.promise=new wa(function(a,b){c.resolve=a,c.reject=b;}),b.deferredOperations.push(c),b.dbReady?b.dbReady=b.dbReady.then(function(){return c.promise}):b.dbReady=c.promise;}function p(a){var b=va[a.name],c=b.deferredOperations.pop();if(c)return c.resolve(),c.promise}function q(a,b){var c=va[a.name],d=c.deferredOperations.pop();if(d)return d.reject(b),d.promise}function r(a,b){return new wa(function(c,d){if(a.db){if(!b)return c(a.db);o(a),a.db.close();}var e=[a.name];b&&e.push(a.version);var f=ta.open.apply(ta,e);b&&(f.onupgradeneeded=function(b){var c=f.result;try{c.createObjectStore(a.storeName),b.oldVersion<=1&&c.createObjectStore(xa);}catch(c){if("ConstraintError"!==c.name)throw c;console.warn('The database "'+a.name+'" has been upgraded from version '+b.oldVersion+" to version "+b.newVersion+', but the storage "'+a.storeName+'" already exists.');}}),f.onerror=function(a){a.preventDefault(),d(f.error);},f.onsuccess=function(){c(f.result),p(a);};})}function s(a){return r(a,!1)}function t(a){return r(a,!0)}function u(a,b){if(!a.db)return!0;var c=!a.db.objectStoreNames.contains(a.storeName),d=a.version<a.db.version,e=a.version>a.db.version;if(d&&(a.version!==b&&console.warn('The database "'+a.name+"\" can't be downgraded from version "+a.db.version+" to version "+a.version+"."),a.version=a.db.version),e||c){if(c){var f=a.db.version+1;f>a.version&&(a.version=f);}return!0}return!1}function v(a){return new wa(function(b,c){var d=new FileReader;d.onerror=c,d.onloadend=function(c){var d=btoa(c.target.result||"");b({__local_forage_encoded_blob:!0,data:d,type:a.type});},d.readAsBinaryString(a);})}function w(a){return g([l(atob(a.data))],{type:a.type})}function x(a){return a&&a.__local_forage_encoded_blob}function y(a){var b=this,c=b._initReady().then(function(){var a=va[b._dbInfo.name];if(a&&a.dbReady)return a.dbReady});return i(c,a,a),c}function z(a){o(a);for(var b=va[a.name],c=b.forages,d=0;d<c.length;d++){var e=c[d];e._dbInfo.db&&(e._dbInfo.db.close(),e._dbInfo.db=null);}return s(a).then(function(b){for(var d=0;d<c.length;d++)c[d]._dbInfo.db=b;a.db=b;}).then(function(){if(u(a))return t(a)}).catch(function(b){throw q(a,b),b})}function A(a,b,c,d){void 0===d&&(d=1);try{var e=a.db.transaction(a.storeName,b);c(null,e);}catch(e){if(d>0&&(!a.db||"InvalidStateError"===e.name||"NotFoundError"===e.name))return wa.resolve().then(function(){if(!a.db||"NotFoundError"===e.name&&!a.db.objectStoreNames.contains(a.storeName)&&a.version<=a.db.version)return a.db&&(a.version=a.db.version+1),t(a)}).then(function(){return z(a).then(function(){A(a,b,c,d-1);})}).catch(c);c(e);}}function B(a){function b(){return wa.resolve()}var c=this,d={db:null};if(a)for(var e in a)d[e]=a[e];va||(va={});var f=va[d.name];f||(f={forages:[],db:null,dbReady:null,deferredOperations:[]},va[d.name]=f),f.forages.push(c),c._initReady||(c._initReady=c.ready,c.ready=y);for(var g=[],h=0;h<f.forages.length;h++){var i=f.forages[h];i!==c&&g.push(i._initReady().catch(b));}var j=f.forages.slice(0);return wa.all(g).then(function(){return d.db=f.db,s(d)}).then(function(a){return d.db=a,u(d,c._defaultConfig.version)?t(d):a}).then(function(a){d.db=f.db=a,c._dbInfo=d;for(var b=0;b<j.length;b++){var e=j[b];e!==c&&(e._dbInfo.db=d.db,e._dbInfo.version=d.version);}})}function C(a,b){var c=this;a=j(a);var d=new wa(function(b,d){c.ready().then(function(){A(c._dbInfo,za,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=g.get(a);h.onsuccess=function(){var a=h.result;void 0===a&&(a=null),x(a)&&(a=w(a)),b(a);},h.onerror=function(){d(h.error);};}catch(a){d(a);}});}).catch(d);});return h(d,b),d}function D(a,b){var c=this,d=new wa(function(b,d){c.ready().then(function(){A(c._dbInfo,za,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=g.openCursor(),i=1;h.onsuccess=function(){var c=h.result;if(c){var d=c.value;x(d)&&(d=w(d));var e=a(d,c.key,i++);void 0!==e?b(e):c.continue();}else b();},h.onerror=function(){d(h.error);};}catch(a){d(a);}});}).catch(d);});return h(d,b),d}function E(a,b,c){var d=this;a=j(a);var e=new wa(function(c,e){var f;d.ready().then(function(){return f=d._dbInfo,"[object Blob]"===ya.call(b)?n(f.db).then(function(a){return a?b:v(b)}):b}).then(function(b){A(d._dbInfo,Aa,function(f,g){if(f)return e(f);try{var h=g.objectStore(d._dbInfo.storeName);null===b&&(b=void 0);var i=h.put(b,a);g.oncomplete=function(){void 0===b&&(b=null),c(b);},g.onabort=g.onerror=function(){var a=i.error?i.error:i.transaction.error;e(a);};}catch(a){e(a);}});}).catch(e);});return h(e,c),e}function F(a,b){var c=this;a=j(a);var d=new wa(function(b,d){c.ready().then(function(){A(c._dbInfo,Aa,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=g.delete(a);f.oncomplete=function(){b();},f.onerror=function(){d(h.error);},f.onabort=function(){var a=h.error?h.error:h.transaction.error;d(a);};}catch(a){d(a);}});}).catch(d);});return h(d,b),d}function G(a){var b=this,c=new wa(function(a,c){b.ready().then(function(){A(b._dbInfo,Aa,function(d,e){if(d)return c(d);try{var f=e.objectStore(b._dbInfo.storeName),g=f.clear();e.oncomplete=function(){a();},e.onabort=e.onerror=function(){var a=g.error?g.error:g.transaction.error;c(a);};}catch(a){c(a);}});}).catch(c);});return h(c,a),c}function H(a){var b=this,c=new wa(function(a,c){b.ready().then(function(){A(b._dbInfo,za,function(d,e){if(d)return c(d);try{var f=e.objectStore(b._dbInfo.storeName),g=f.count();g.onsuccess=function(){a(g.result);},g.onerror=function(){c(g.error);};}catch(a){c(a);}});}).catch(c);});return h(c,a),c}function I(a,b){var c=this,d=new wa(function(b,d){if(a<0)return void b(null);c.ready().then(function(){A(c._dbInfo,za,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=!1,i=g.openCursor();i.onsuccess=function(){var c=i.result;if(!c)return void b(null);0===a?b(c.key):h?b(c.key):(h=!0,c.advance(a));},i.onerror=function(){d(i.error);};}catch(a){d(a);}});}).catch(d);});return h(d,b),d}function J(a){var b=this,c=new wa(function(a,c){b.ready().then(function(){A(b._dbInfo,za,function(d,e){if(d)return c(d);try{var f=e.objectStore(b._dbInfo.storeName),g=f.openCursor(),h=[];g.onsuccess=function(){var b=g.result;if(!b)return void a(h);h.push(b.key),b.continue();},g.onerror=function(){c(g.error);};}catch(a){c(a);}});}).catch(c);});return h(c,a),c}function K(a,b){b=k.apply(this,arguments);var c=this.config();a="function"!=typeof a&&a||{},a.name||(a.name=a.name||c.name,a.storeName=a.storeName||c.storeName);var d,e=this;if(a.name){var f=a.name===c.name&&e._dbInfo.db?wa.resolve(e._dbInfo.db):s(a);d=a.storeName?f.then(function(b){if(b.objectStoreNames.contains(a.storeName)){var c=b.version+1;o(a);for(var d=va[a.name],e=d.forages,f=0;f<e.length;f++){var g=e[f];g._dbInfo.db&&(g._dbInfo.db.close(),g._dbInfo.db=null,g._dbInfo.version=c);}return new wa(function(b,d){var e=ta.open(a.name,c);e.onerror=d,e.onupgradeneeded=function(){e.result.deleteObjectStore(a.storeName);},e.onsuccess=function(){var a=e.result;b(a);};}).then(function(a){for(var b=0;b<e.length;b++){var c=e[b];c._dbInfo.db=a,p(c._dbInfo);}}).catch(function(b){throw(q(a,b)||wa.resolve()).catch(function(){}),b})}}):f.then(function(){o(a);for(var b=va[a.name],c=b.forages,d=0;d<c.length;d++){var e=c[d];e._dbInfo.db&&(e._dbInfo.db.close(),e._dbInfo.db=null);}return new wa(function(b,c){var d=ta.deleteDatabase(a.name);d.onerror=d.onblocked=c,d.onsuccess=b;}).then(function(){for(var a=0;a<c.length;a++)p(e._dbInfo);}).catch(function(b){throw(q(a,b)||wa.resolve()).catch(function(){}),b})});}else d=wa.reject("Invalid arguments");return h(d,b),d}function L(){return"function"==typeof openDatabase}function M(a){var b,c,d,e,f,g=.75*a.length,h=a.length,i=0;"="===a[a.length-1]&&(g--,"="===a[a.length-2]&&g--);var j=new ArrayBuffer(g),k=new Uint8Array(j);for(b=0;b<h;b+=4)c=Ca.indexOf(a[b]),d=Ca.indexOf(a[b+1]),e=Ca.indexOf(a[b+2]),f=Ca.indexOf(a[b+3]),k[i++]=c<<2|d>>4,k[i++]=(15&d)<<4|e>>2,k[i++]=(3&e)<<6|63&f;return j}function N(a){var b,c=new Uint8Array(a),d="";for(b=0;b<c.length;b+=3)d+=Ca[c[b]>>2],d+=Ca[(3&c[b])<<4|c[b+1]>>4],d+=Ca[(15&c[b+1])<<2|c[b+2]>>6],d+=Ca[63&c[b+2]];return c.length%3==2?d=d.substring(0,d.length-1)+"=":c.length%3==1&&(d=d.substring(0,d.length-2)+"=="),d}function O(a,b){var c="";if(a&&(c=Ta.call(a)),a&&("[object ArrayBuffer]"===c||a.buffer&&"[object ArrayBuffer]"===Ta.call(a.buffer))){var d,e=Fa;a instanceof ArrayBuffer?(d=a,e+=Ha):(d=a.buffer,"[object Int8Array]"===c?e+=Ja:"[object Uint8Array]"===c?e+=Ka:"[object Uint8ClampedArray]"===c?e+=La:"[object Int16Array]"===c?e+=Ma:"[object Uint16Array]"===c?e+=Oa:"[object Int32Array]"===c?e+=Na:"[object Uint32Array]"===c?e+=Pa:"[object Float32Array]"===c?e+=Qa:"[object Float64Array]"===c?e+=Ra:b(new Error("Failed to get type for BinaryArray"))),b(e+N(d));}else if("[object Blob]"===c){var f=new FileReader;f.onload=function(){var c=Da+a.type+"~"+N(this.result);b(Fa+Ia+c);},f.readAsArrayBuffer(a);}else try{b(JSON.stringify(a));}catch(c){console.error("Couldn't convert value into a JSON string: ",a),b(null,c);}}function P(a){if(a.substring(0,Ga)!==Fa)return JSON.parse(a);var b,c=a.substring(Sa),d=a.substring(Ga,Sa);if(d===Ia&&Ea.test(c)){var e=c.match(Ea);b=e[1],c=c.substring(e[0].length);}var f=M(c);switch(d){case Ha:return f;case Ia:return g([f],{type:b});case Ja:return new Int8Array(f);case Ka:return new Uint8Array(f);case La:return new Uint8ClampedArray(f);case Ma:return new Int16Array(f);case Oa:return new Uint16Array(f);case Na:return new Int32Array(f);case Pa:return new Uint32Array(f);case Qa:return new Float32Array(f);case Ra:return new Float64Array(f);default:throw new Error("Unkown type: "+d)}}function Q(a,b,c,d){a.executeSql("CREATE TABLE IF NOT EXISTS "+b.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],c,d);}function R(a){var b=this,c={db:null};if(a)for(var d in a)c[d]="string"!=typeof a[d]?a[d].toString():a[d];var e=new wa(function(a,d){try{c.db=openDatabase(c.name,String(c.version),c.description,c.size);}catch(a){return d(a)}c.db.transaction(function(e){Q(e,c,function(){b._dbInfo=c,a();},function(a,b){d(b);});},d);});return c.serializer=Ua,e}function S(a,b,c,d,e,f){a.executeSql(c,d,e,function(a,g){g.code===g.SYNTAX_ERR?a.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?",[name],function(a,h){h.rows.length?f(a,g):Q(a,b,function(){a.executeSql(c,d,e,f);},f);},f):f(a,g);},f);}function T(a,b){var c=this;a=j(a);var d=new wa(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){S(c,e,"SELECT * FROM "+e.storeName+" WHERE key = ? LIMIT 1",[a],function(a,c){var d=c.rows.length?c.rows.item(0).value:null;d&&(d=e.serializer.deserialize(d)),b(d);},function(a,b){d(b);});});}).catch(d);});return h(d,b),d}function U(a,b){var c=this,d=new wa(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){S(c,e,"SELECT * FROM "+e.storeName,[],function(c,d){for(var f=d.rows,g=f.length,h=0;h<g;h++){var i=f.item(h),j=i.value;if(j&&(j=e.serializer.deserialize(j)),void 0!==(j=a(j,i.key,h+1)))return void b(j)}b();},function(a,b){d(b);});});}).catch(d);});return h(d,b),d}function V(a,b,c,d){var e=this;a=j(a);var f=new wa(function(f,g){e.ready().then(function(){void 0===b&&(b=null);var h=b,i=e._dbInfo;i.serializer.serialize(b,function(b,j){j?g(j):i.db.transaction(function(c){S(c,i,"INSERT OR REPLACE INTO "+i.storeName+" (key, value) VALUES (?, ?)",[a,b],function(){f(h);},function(a,b){g(b);});},function(b){if(b.code===b.QUOTA_ERR){if(d>0)return void f(V.apply(e,[a,h,c,d-1]));g(b);}});});}).catch(g);});return h(f,c),f}function W(a,b,c){return V.apply(this,[a,b,c,1])}function X(a,b){var c=this;a=j(a);var d=new wa(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){S(c,e,"DELETE FROM "+e.storeName+" WHERE key = ?",[a],function(){b();},function(a,b){d(b);});});}).catch(d);});return h(d,b),d}function Y(a){var b=this,c=new wa(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){S(b,d,"DELETE FROM "+d.storeName,[],function(){a();},function(a,b){c(b);});});}).catch(c);});return h(c,a),c}function Z(a){var b=this,c=new wa(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){S(b,d,"SELECT COUNT(key) as c FROM "+d.storeName,[],function(b,c){var d=c.rows.item(0).c;a(d);},function(a,b){c(b);});});}).catch(c);});return h(c,a),c}function $(a,b){var c=this,d=new wa(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){S(c,e,"SELECT key FROM "+e.storeName+" WHERE id = ? LIMIT 1",[a+1],function(a,c){var d=c.rows.length?c.rows.item(0).key:null;b(d);},function(a,b){d(b);});});}).catch(d);});return h(d,b),d}function _(a){var b=this,c=new wa(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){S(b,d,"SELECT key FROM "+d.storeName,[],function(b,c){for(var d=[],e=0;e<c.rows.length;e++)d.push(c.rows.item(e).key);a(d);},function(a,b){c(b);});});}).catch(c);});return h(c,a),c}function aa(a){return new wa(function(b,c){a.transaction(function(d){d.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",[],function(c,d){for(var e=[],f=0;f<d.rows.length;f++)e.push(d.rows.item(f).name);b({db:a,storeNames:e});},function(a,b){c(b);});},function(a){c(a);});})}function ba(a,b){b=k.apply(this,arguments);var c=this.config();a="function"!=typeof a&&a||{},a.name||(a.name=a.name||c.name,a.storeName=a.storeName||c.storeName);var d,e=this;return d=a.name?new wa(function(b){var d;d=a.name===c.name?e._dbInfo.db:openDatabase(a.name,"","",0),b(a.storeName?{db:d,storeNames:[a.storeName]}:aa(d));}).then(function(a){return new wa(function(b,c){a.db.transaction(function(d){function e(a){return new wa(function(b,c){d.executeSql("DROP TABLE IF EXISTS "+a,[],function(){b();},function(a,b){c(b);});})}for(var f=[],g=0,h=a.storeNames.length;g<h;g++)f.push(e(a.storeNames[g]));wa.all(f).then(function(){b();}).catch(function(a){c(a);});},function(a){c(a);});})}):wa.reject("Invalid arguments"),h(d,b),d}function ca(){try{return"undefined"!=typeof localStorage&&"setItem"in localStorage&&"function"==typeof localStorage.setItem}catch(a){return!1}}function da(a,b){var c=a.name+"/";return a.storeName!==b.storeName&&(c+=a.storeName+"/"),c}function ea(){var a="_localforage_support_test";try{return localStorage.setItem(a,!0),localStorage.removeItem(a),!1}catch(a){return!0}}function fa(){return!ea()||localStorage.length>0}function ga(a){var b=this,c={};if(a)for(var d in a)c[d]=a[d];return c.keyPrefix=da(a,b._defaultConfig),fa()?(b._dbInfo=c,c.serializer=Ua,wa.resolve()):wa.reject()}function ha(a){var b=this,c=b.ready().then(function(){for(var a=b._dbInfo.keyPrefix,c=localStorage.length-1;c>=0;c--){var d=localStorage.key(c);0===d.indexOf(a)&&localStorage.removeItem(d);}});return h(c,a),c}function ia(a,b){var c=this;a=j(a);var d=c.ready().then(function(){var b=c._dbInfo,d=localStorage.getItem(b.keyPrefix+a);return d&&(d=b.serializer.deserialize(d)),d});return h(d,b),d}function ja(a,b){var c=this,d=c.ready().then(function(){for(var b=c._dbInfo,d=b.keyPrefix,e=d.length,f=localStorage.length,g=1,h=0;h<f;h++){var i=localStorage.key(h);if(0===i.indexOf(d)){var j=localStorage.getItem(i);if(j&&(j=b.serializer.deserialize(j)),void 0!==(j=a(j,i.substring(e),g++)))return j}}});return h(d,b),d}function ka(a,b){var c=this,d=c.ready().then(function(){var b,d=c._dbInfo;try{b=localStorage.key(a);}catch(a){b=null;}return b&&(b=b.substring(d.keyPrefix.length)),b});return h(d,b),d}function la(a){var b=this,c=b.ready().then(function(){for(var a=b._dbInfo,c=localStorage.length,d=[],e=0;e<c;e++){var f=localStorage.key(e);0===f.indexOf(a.keyPrefix)&&d.push(f.substring(a.keyPrefix.length));}return d});return h(c,a),c}function ma(a){var b=this,c=b.keys().then(function(a){return a.length});return h(c,a),c}function na(a,b){var c=this;a=j(a);var d=c.ready().then(function(){var b=c._dbInfo;localStorage.removeItem(b.keyPrefix+a);});return h(d,b),d}function oa(a,b,c){var d=this;a=j(a);var e=d.ready().then(function(){void 0===b&&(b=null);var c=b;return new wa(function(e,f){var g=d._dbInfo;g.serializer.serialize(b,function(b,d){if(d)f(d);else try{localStorage.setItem(g.keyPrefix+a,b),e(c);}catch(a){"QuotaExceededError"!==a.name&&"NS_ERROR_DOM_QUOTA_REACHED"!==a.name||f(a),f(a);}});})});return h(e,c),e}function pa(a,b){if(b=k.apply(this,arguments),a="function"!=typeof a&&a||{},!a.name){var c=this.config();a.name=a.name||c.name,a.storeName=a.storeName||c.storeName;}var d,e=this;return d=a.name?new wa(function(b){b(a.storeName?da(a,e._defaultConfig):a.name+"/");}).then(function(a){for(var b=localStorage.length-1;b>=0;b--){var c=localStorage.key(b);0===c.indexOf(a)&&localStorage.removeItem(c);}}):wa.reject("Invalid arguments"),h(d,b),d}function qa(a,b){a[b]=function(){var c=arguments;return a.ready().then(function(){return a[b].apply(a,c)})};}function ra(){for(var a=1;a<arguments.length;a++){var b=arguments[a];if(b)for(var c in b)b.hasOwnProperty(c)&&(Xa(b[c])?arguments[0][c]=b[c].slice():arguments[0][c]=b[c]);}return arguments[0]}var sa="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},ta=e();"undefined"==typeof Promise&&a("lie/polyfill");var ua,va,wa=Promise,xa="local-forage-detect-blob-support",ya=Object.prototype.toString,za="readonly",Aa="readwrite",Ba={_driver:"asyncStorage",_initStorage:B,_support:f(),iterate:D,getItem:C,setItem:E,removeItem:F,clear:G,length:H,key:I,keys:J,dropInstance:K},Ca="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Da="~~local_forage_type~",Ea=/^~~local_forage_type~([^~]+)~/,Fa="__lfsc__:",Ga=Fa.length,Ha="arbf",Ia="blob",Ja="si08",Ka="ui08",La="uic8",Ma="si16",Na="si32",Oa="ur16",Pa="ui32",Qa="fl32",Ra="fl64",Sa=Ga+Ha.length,Ta=Object.prototype.toString,Ua={serialize:O,deserialize:P,stringToBuffer:M,bufferToString:N},Va={_driver:"webSQLStorage",_initStorage:R,_support:L(),iterate:U,getItem:T,setItem:W,removeItem:X,clear:Y,length:Z,key:$,keys:_,dropInstance:ba},Wa={_driver:"localStorageWrapper",_initStorage:ga,_support:ca(),iterate:ja,getItem:ia,setItem:oa,removeItem:na,clear:ha,length:ma,key:ka,keys:la,dropInstance:pa},Xa=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},Ya={},Za={},$a={INDEXEDDB:Ba,WEBSQL:Va,LOCALSTORAGE:Wa},_a=[$a.INDEXEDDB._driver,$a.WEBSQL._driver,$a.LOCALSTORAGE._driver],ab=["dropInstance"],bb=["clear","getItem","iterate","key","keys","length","removeItem","setItem"].concat(ab),cb={description:"",driver:_a.slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1},db=function(){function a(b){d(this,a);for(var c in $a)if($a.hasOwnProperty(c)){var e=$a[c],f=e._driver;this[c]=f,Ya[f]||this.defineDriver(e);}this._defaultConfig=ra({},cb),this._config=ra({},this._defaultConfig,b),this._driverSet=null,this._initDriver=null,this._ready=!1,this._dbInfo=null,this._wrapLibraryMethodsWithReady(),this.setDriver(this._config.driver).catch(function(){});}return a.prototype.config=function(a){if("object"===(void 0===a?"undefined":sa(a))){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var b in a){if("storeName"===b&&(a[b]=a[b].replace(/\W/g,"_")),"version"===b&&"number"!=typeof a[b])return new Error("Database version must be a number.");this._config[b]=a[b];}return!("driver"in a&&a.driver)||this.setDriver(this._config.driver)}return"string"==typeof a?this._config[a]:this._config},a.prototype.defineDriver=function(a,b,c){var d=new wa(function(b,c){try{var d=a._driver,e=new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");if(!a._driver)return void c(e);for(var f=bb.concat("_initStorage"),g=0,i=f.length;g<i;g++){var j=f[g];if((ab.indexOf(j)<0||a[j])&&"function"!=typeof a[j])return void c(e)}(function(){for(var b=function(a){return function(){var b=new Error("Method "+a+" is not implemented by the current driver"),c=wa.reject(b);return h(c,arguments[arguments.length-1]),c}},c=0,d=ab.length;c<d;c++){var e=ab[c];a[e]||(a[e]=b(e));}})();var k=function(c){Ya[d]&&console.info("Redefining LocalForage driver: "+d),Ya[d]=a,Za[d]=c,b();};"_support"in a?a._support&&"function"==typeof a._support?a._support().then(k,c):k(!!a._support):k(!0);}catch(a){c(a);}});return i(d,b,c),d},a.prototype.driver=function(){return this._driver||null},a.prototype.getDriver=function(a,b,c){var d=Ya[a]?wa.resolve(Ya[a]):wa.reject(new Error("Driver not found."));return i(d,b,c),d},a.prototype.getSerializer=function(a){var b=wa.resolve(Ua);return i(b,a),b},a.prototype.ready=function(a){var b=this,c=b._driverSet.then(function(){return null===b._ready&&(b._ready=b._initDriver()),b._ready});return i(c,a,a),c},a.prototype.setDriver=function(a,b,c){function d(){g._config.driver=g.driver();}function e(a){return g._extend(a),d(),g._ready=g._initStorage(g._config),g._ready}function f(a){return function(){function b(){for(;c<a.length;){var f=a[c];return c++,g._dbInfo=null,g._ready=null,g.getDriver(f).then(e).catch(b)}d();var h=new Error("No available storage method found.");return g._driverSet=wa.reject(h),g._driverSet}var c=0;return b()}}var g=this;Xa(a)||(a=[a]);var h=this._getSupportedDrivers(a),j=null!==this._driverSet?this._driverSet.catch(function(){return wa.resolve()}):wa.resolve();return this._driverSet=j.then(function(){var a=h[0];return g._dbInfo=null,g._ready=null,g.getDriver(a).then(function(a){g._driver=a._driver,d(),g._wrapLibraryMethodsWithReady(),g._initDriver=f(h);})}).catch(function(){d();var a=new Error("No available storage method found.");return g._driverSet=wa.reject(a),g._driverSet}),i(this._driverSet,b,c),this._driverSet},a.prototype.supports=function(a){return!!Za[a]},a.prototype._extend=function(a){ra(this,a);},a.prototype._getSupportedDrivers=function(a){for(var b=[],c=0,d=a.length;c<d;c++){var e=a[c];this.supports(e)&&b.push(e);}return b},a.prototype._wrapLibraryMethodsWithReady=function(){for(var a=0,b=bb.length;a<b;a++)qa(this,bb[a]);},a.prototype.createInstance=function(b){return new a(b)},a}(),eb=new db;b.exports=eb;},{undefined:void 0}]},{},[1])(1)});
});

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * `DescriptorRunner` provides interface to execute DNN model and access input and output buffers.
 */
var DescriptorRunner = /** @class */ (function () {
    function DescriptorRunner() {
        /**
         * For Developer:
         *
         * `DescriptorRunner` executes computation based on `GraphDescriptor`.
         *
         * Typically, DescriptorRunner takes 3 steps to execute DNN model.
         *
         * 1. Initialize static configurations
         *
         *    Initialize things independent from runtime configuration.
         *
         *      - `init()`
         *      - `load()`
         *
         * 2. Initialize dynamic configurations
         *
         *    Initialize things depend on runtime configuration such as batch size, input image size, etc.
         *
         *      - `setPlaceholderValue()`
         *      - `getInputViews()`
         *      - `getOutputViews()`
         *
         * 3. Execute the model
         *
         *      - `run()`
         *
         * You need to do step 1 and 2 only once. We recommend to call `WebDNN.prepareAll()` instead
         * to call `GraphDescriptor#load()` directly. In that method, all procedures in step 1 and 2 are performed.
         */
        /**
         * descriptor
         * @type {null}
         */
        this.descriptor = null;
    }
    /**
     * Return `true` if this backend is available in this environment.
     * @returns {boolean}
     */
    DescriptorRunner.checkAvailability = function () {
        return false;
    };
    return DescriptorRunner;
}());

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @private
 */
var localforage = localforage_nopromises_min;
/**
 * @private
 */
function wait(duration) {
    if (duration === void 0) { duration = 10; }
    // let console.log to be displayed, and prevent freeze
    return new Promise(function (resolve) { return setTimeout(resolve, duration); });
}
/**
 * @protected
 */
var DescriptorRunnerFallback = /** @class */ (function (_super) {
    __extends(DescriptorRunnerFallback, _super);
    function DescriptorRunnerFallback() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.backendName = 'fallback';
        return _this;
    }
    DescriptorRunnerFallback.checkAvailability = function () {
        return true;
    };
    DescriptorRunnerFallback.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DescriptorRunnerFallback.prototype.setDescriptorAndParameters = function (descriptor, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setDescriptor(descriptor);
                        return [4 /*yield*/, this.compile()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.initializeStaticBuffer(parameters)];
                    case 2:
                        _a.sent();
                        if (!(this.placeholderContext && this.placeholderContext.isResolved)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.initializeDynamicBuffer()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerFallback.prototype.fetchDescriptor = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.directory = directory;
                        return [4 /*yield*/, webdnnFetch(directory + "/graph_" + this.backendName + ".json")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        });
    };
    DescriptorRunnerFallback.prototype.fetchParameters = function (directory, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, webdnnFetch(directory + "/weight_" + this.backendName + ".bin")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, readArrayBufferProgressively(res, progressCallback)];
                }
            });
        });
    };
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    DescriptorRunnerFallback.prototype.restoreCachedDescriptor = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, localforage.getItem(directory + "_" + this.backendName + "_descriptor").catch(function () { return null; })];
            });
        });
    };
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    DescriptorRunnerFallback.prototype.restoreCachedParameters = function (directory, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var parameter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localforage.getItem(directory + "_" + this.backendName + "_parameters").catch(function () { return null; })];
                    case 1:
                        parameter = _a.sent();
                        if (parameter && progressCallback)
                            progressCallback(parameter.byteLength, parameter.byteLength);
                        return [2 /*return*/, parameter];
                }
            });
        });
    };
    /**
     * save cache
     */
    DescriptorRunnerFallback.prototype.saveCache = function (directory, descriptor, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            localforage.setItem(directory + "_" + this.backendName + "_descriptor", descriptor),
                            localforage.setItem(directory + "_" + this.backendName + "_parameters", parameters)
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    
    DescriptorRunnerFallback.prototype.setDescriptor = function (descriptor) {
        this.descriptor = descriptor;
        // reset
        this.placeholderContext = new PlaceholderContext();
        this.placeholderContext.update(descriptor.placeholders);
        this.kernelObj = null;
        this.variableMap = null;
        this.outputViews = null;
        this.inputViews = null;
        this.staticBuffer = null;
        this.dynamicBuffer = null;
    };
    DescriptorRunnerFallback.prototype.compile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var script = document.createElement("script");
                                script.type = "text/javascript";
                                if (script.readyState) {
                                    script.onreadystatechange = function () {
                                        if (script.readyState == "loaded" || script.readyState == "complete") {
                                            script.onreadystatechange = null;
                                            resolve();
                                        }
                                    };
                                }
                                else {
                                    script.onload = resolve;
                                }
                                script.src = transformUrl(_this.directory + "/kernels_fallback.js");
                                document.getElementsByTagName("head")[0].appendChild(script);
                            })];
                    case 1:
                        _a.sent();
                        this.kernelObj = window.dnn_fallback_kernel; // "window.dnn_fallback_kernel" is defined in "kernels_fallback.js"
                        return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerFallback.prototype.initializeStaticBuffer = function (weightRawArray) {
        return __awaiter(this, void 0, void 0, function () {
            var descriptor, staticBuffer, variableMap, decoder, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        descriptor = this.descriptor;
                        staticBuffer = new Float32Array(descriptor.memory_layout.static.size);
                        this.staticBuffer = staticBuffer;
                        variableMap = this.variableMap || new Map();
                        this.variableMap = variableMap;
                        Object.entries(descriptor.memory_layout.static.allocations)
                            .forEach(function (_a) {
                            var name = _a[0], allocation = _a[1];
                            variableMap.set(name, new Float32Array(staticBuffer.buffer, allocation.offset * Float32Array.BYTES_PER_ELEMENT, allocation.size));
                        });
                        decoder = getWeightDecoder(this.descriptor.weight_encoding);
                        _b = (_a = staticBuffer).set;
                        return [4 /*yield*/, decoder.decode(new Uint8Array(weightRawArray))];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [4 /*yield*/, this.getInputViews()];
                    case 2:
                        (_c.sent())
                            .filter(function (view) { return !view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(staticBuffer.buffer); });
                        return [4 /*yield*/, this.getOutputViews()];
                    case 3:
                        (_c.sent())
                            .filter(function (view) { return !view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(staticBuffer.buffer); });
                        return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerFallback.prototype.initializeDynamicBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var descriptor, placeholderContext, dynamicBuffer, variableMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        if (!this.placeholderContext)
                            throw new Error('PlaceholderContext is not initialized');
                        descriptor = this.descriptor;
                        placeholderContext = this.placeholderContext;
                        dynamicBuffer = new Float32Array(placeholderContext.resolve(descriptor.memory_layout.dynamic.size));
                        this.dynamicBuffer = dynamicBuffer;
                        variableMap = this.variableMap || new Map();
                        this.variableMap = variableMap;
                        Object.entries(descriptor.memory_layout.dynamic.allocations)
                            .forEach(function (_a) {
                            var name = _a[0], allocation = _a[1];
                            variableMap.set(name, new Float32Array(dynamicBuffer.buffer, placeholderContext.resolve(allocation.offset) * Float32Array.BYTES_PER_ELEMENT, placeholderContext.resolve(allocation.size)));
                        });
                        return [4 /*yield*/, this.getInputViews()];
                    case 1:
                        (_a.sent())
                            .filter(function (view) { return view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(dynamicBuffer.buffer); });
                        return [4 /*yield*/, this.getOutputViews()];
                    case 2:
                        (_a.sent())
                            .filter(function (view) { return view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(dynamicBuffer.buffer); });
                        return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerFallback.prototype.setPlaceholderValue = function (values) {
        return __awaiter(this, void 0, void 0, function () {
            var placeholderContext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.placeholderContext)
                            throw new Error('placeholderContext is not initialized');
                        placeholderContext = this.placeholderContext;
                        placeholderContext.update(values);
                        if (!placeholderContext.isResolved)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.initializeDynamicBuffer()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerFallback.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var variableMap, placeholderContext, executionInfos, startDate, lastDate, i, currentDate, executionInfo, inputs, outputs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        if (!this.placeholderContext)
                            throw new Error('placeholderContext is not initialized');
                        if (!this.variableMap)
                            throw new Error('Variable map is not initialized');
                        if (!this.staticBuffer)
                            throw new Error('StaticBuffer map is not initialized');
                        if (!this.dynamicBuffer)
                            throw new Error('DynamicBuffer map is not initialized');
                        if (!this.inputViews || !this.outputViews)
                            throw new Error('getInputViews() and getOutputViews() must be called prior to run');
                        variableMap = this.variableMap;
                        placeholderContext = this.placeholderContext;
                        executionInfos = this.descriptor.exec_infos
                            .map(function (executionInfo) { return placeholderContext.resolve(executionInfo); });
                        startDate = Date.now();
                        lastDate = Date.now();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < executionInfos.length)) return [3 /*break*/, 5];
                        currentDate = Date.now();
                        if (!(currentDate - lastDate >= 1000)) return [3 /*break*/, 3];
                        console.log("Processed " + i + "/" + executionInfos.length + " kernels in " + (currentDate - startDate) + " ms");
                        lastDate = currentDate;
                        return [4 /*yield*/, wait()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        executionInfo = executionInfos[i];
                        inputs = executionInfo.inputs.map(function (name) { return variableMap.get(name); });
                        outputs = executionInfo.outputs.map(function (name) { return variableMap.get(name); });
                        this.kernelObj[executionInfo.entry_func_name](inputs, outputs, executionInfo.call_option);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5:
                        console.log("Processed " + executionInfos.length + "/" + executionInfos.length + " kernels in " + (Date.now() - startDate) + " ms");
                        return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerFallback.prototype.getInputViews = function () {
        if (this.inputViews)
            return this.inputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        var descriptor = this.descriptor;
        var placeholderContext = this.placeholderContext;
        this.inputViews = descriptor.inputs.map(function (name) {
            var allocation = descriptor.memory_layout.static.allocations[name] || descriptor.memory_layout.dynamic.allocations[name];
            var view = new SymbolicFloat32Array(allocation, placeholderContext);
            return view;
        });
        return this.inputViews;
    };
    DescriptorRunnerFallback.prototype.getOutputViews = function () {
        if (this.outputViews)
            return this.outputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        var descriptor = this.descriptor;
        var placeholderContext = this.placeholderContext;
        this.outputViews = descriptor.outputs.map(function (name) {
            var allocation = descriptor.memory_layout.static.allocations[name] || descriptor.memory_layout.dynamic.allocations[name];
            var view = new SymbolicFloat32Array(allocation, placeholderContext);
            return view;
        });
        return this.outputViews;
    };
    return DescriptorRunnerFallback;
}(DescriptorRunner));

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @private
 */
var localforage$1 = localforage_nopromises_min;
/**
 * @protected
 */
var DescriptorRunnerWebassembly = /** @class */ (function (_super) {
    __extends(DescriptorRunnerWebassembly, _super);
    function DescriptorRunnerWebassembly() {
        var _this = _super.call(this) || this;
        _this.backendName = 'webassembly';
        _this.worker_promise_reject_func = null;
        _this.worker_initial_error = null;
        if (typeof Worker === 'undefined')
            throw new Error('WebWorker is needed for WebAssembly backend');
        if (typeof WebAssembly !== 'object') {
            console.warn('WebAssembly is not supported on this browser, trying to use asm.js code');
        }
        return _this;
    }
    DescriptorRunnerWebassembly.checkAvailability = function () {
        return 'Worker' in window;
    };
    DescriptorRunnerWebassembly.prototype.init = function () {
        if (!DescriptorRunnerWebassembly.checkAvailability())
            throw Error('WebAssembly backend is not supported in this browser.');
        //nothing to do
        return Promise.resolve();
    };
    DescriptorRunnerWebassembly.prototype.setDescriptorAndParameters = function (descriptor, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var kernel_backend, worker_entry_js_path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.descriptor = descriptor;
                        this.placeholderContext = new PlaceholderContext(this.descriptor.placeholders);
                        kernel_backend = typeof WebAssembly === 'object' ? 'webassembly' : 'asmjs';
                        worker_entry_js_path = this.directory + "/kernels_" + kernel_backend + ".js";
                        worker_entry_js_path = transformUrl(worker_entry_js_path);
                        this.worker_entry_js_path = worker_entry_js_path;
                        return [4 /*yield*/, this.compile()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadWeights(new Uint8Array(parameters))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getInputViews()];
                    case 3:
                        //assign buffer to input/output buffer view
                        (_a.sent())
                            .filter(function (view) { return !view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer((new Float32Array(view.length)).buffer); });
                        return [4 /*yield*/, this.getOutputViews()];
                    case 4:
                        (_a.sent())
                            .filter(function (view) { return !view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer((new Float32Array(view.length)).buffer); });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetch graph descriptor from specified directory.
     *
     * @param directory directory where descriptor is contained.
     * You can also provide URL of other domain like this.
     *
     * ```javascript
     * await runner.load('://my.other.domain.com/my_model');
     * ```
     *
     * However sometimes it can't because of Cross-Origin-Resource-Security policy.
     *
     * @protected
     */
    DescriptorRunnerWebassembly.prototype.fetchDescriptor = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.directory = directory;
                        return [4 /*yield*/, webdnnFetch(directory + "/graph_" + this.backendName + ".json")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        });
    };
    /**
     * Fetch parameter files from specified directory.
     *
     * @param directory directory where descriptor is contained.
     * You can also provide URL of other domain like this.
     *
     * ```javascript
     * await runner.load('://my.other.domain.com/my_model');
     * ```
     *
     * However sometimes it can't because of Cross-Origin-Resource-Security policy.
     *
     * @param progressCallback callback which is called to notice the loading is progressing.
     * @protected
     */
    DescriptorRunnerWebassembly.prototype.fetchParameters = function (directory, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var weight_url, weight_fetch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weight_url = directory + "/weight_" + this.backendName + ".bin";
                        return [4 /*yield*/, webdnnFetch(weight_url)];
                    case 1:
                        weight_fetch = _a.sent();
                        return [2 /*return*/, readArrayBufferProgressively(weight_fetch, progressCallback)];
                }
            });
        });
    };
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    DescriptorRunnerWebassembly.prototype.restoreCachedDescriptor = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.directory = directory;
                return [2 /*return*/, localforage$1.getItem(directory + "_" + this.backendName + "_descriptor").catch(function () { return null; })];
            });
        });
    };
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    DescriptorRunnerWebassembly.prototype.restoreCachedParameters = function (directory, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var parameter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localforage$1.getItem(directory + "_" + this.backendName + "_parameters").catch(function () { return null; })];
                    case 1:
                        parameter = _a.sent();
                        if (parameter && progressCallback)
                            progressCallback(parameter.byteLength, parameter.byteLength);
                        return [2 /*return*/, parameter];
                }
            });
        });
    };
    /**
     * save cache
     */
    DescriptorRunnerWebassembly.prototype.saveCache = function (directory, descriptor, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            localforage$1.setItem(directory + "_" + this.backendName + "_descriptor", descriptor),
                            localforage$1.setItem(directory + "_" + this.backendName + "_parameters", parameters)
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    
    DescriptorRunnerWebassembly.prototype.setPlaceholderValue = function (values) {
        return __awaiter(this, void 0, void 0, function () {
            var placeholderContext, descriptor, unresolvedValueLists, metaBufferFillList, _loop_1, kernel_order, dynamicBufferSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.placeholderContext)
                            throw new Error('PlaceholderContext is not initialized.');
                        placeholderContext = this.placeholderContext;
                        placeholderContext.update(values);
                        if (!placeholderContext.isResolved)
                            return [2 /*return*/];
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        descriptor = this.descriptor;
                        unresolvedValueLists = descriptor.unresolved_value_lists;
                        metaBufferFillList = [];
                        _loop_1 = function (kernel_order) {
                            var unresolvedValueList = unresolvedValueLists[kernel_order];
                            unresolvedValueList.forEach(function (offset_placeholder) {
                                var resolved_value = placeholderContext.resolve(offset_placeholder.placeholder);
                                metaBufferFillList.push(kernel_order, offset_placeholder.offset, resolved_value);
                            });
                        };
                        for (kernel_order = 0; kernel_order < unresolvedValueLists.length; kernel_order++) {
                            _loop_1(kernel_order);
                        }
                        return [4 /*yield*/, this.getInputViews()];
                    case 1:
                        (_a.sent())
                            .filter(function (view) { return view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer((new Float32Array(view.length)).buffer); });
                        return [4 /*yield*/, this.getOutputViews()];
                    case 2:
                        (_a.sent())
                            .filter(function (view) { return view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer((new Float32Array(view.length)).buffer); });
                        dynamicBufferSize = this.placeholderContext.resolve(this.descriptor.memory_layout.dynamic.size);
                        return [4 /*yield*/, this.setPlaceholderValueWorker(dynamicBufferSize, new Int32Array(metaBufferFillList))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerWebassembly.prototype.setPlaceholderValueWorker = function (dynamicBufferSize, metaBufferFillArray) {
        if (!this.worker)
            throw Error("Worker is not initialized");
        var worker = this.worker;
        return new Promise(function (resolve, reject) {
            worker.onmessage = function (event) {
                if (event.data === 0) {
                    resolve();
                }
                else {
                    console.log(event.data);
                    worker.terminate();
                    reject(new Error(event.data));
                }
            };
            worker.postMessage({ type: 'set_dynamic_buffer', size: dynamicBufferSize, data: metaBufferFillArray });
        });
    };
    DescriptorRunnerWebassembly.prototype.compile = function () {
        var _this = this;
        var worker = new Worker(this.worker_entry_js_path);
        worker.onerror = function (event) {
            console.error(event);
            // console.error('Worker Exception: ' + event.message);
            if (_this.worker_promise_reject_func) {
                _this.worker_promise_reject_func(event);
            }
            else {
                _this.worker_initial_error = event;
            }
        };
        var promise = new Promise(function (resolve, reject) {
            // occurs when this.worker_entry_js_path is 404
            if (_this.worker_initial_error)
                return reject(_this.worker_initial_error);
            _this.worker_promise_reject_func = reject;
            worker.onmessage = function (event) {
                if (event.data === 0) {
                    resolve();
                }
                else {
                    console.error(event.data);
                    worker.terminate();
                    reject(new Error(event.data));
                }
            };
        });
        this.worker = worker;
        return promise;
    };
    DescriptorRunnerWebassembly.prototype.loadWeights = function (weightsData) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var decoder, weight_data, worker, promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        if (!this.worker)
                            throw new Error('Worker is not initialized');
                        decoder = getWeightDecoder(this.descriptor.weight_encoding);
                        return [4 /*yield*/, decoder.decode(weightsData)];
                    case 1:
                        weight_data = _a.sent();
                        worker = this.worker;
                        promise = new Promise(function (resolve, reject) {
                            _this.worker_promise_reject_func = reject;
                            worker.onmessage = function (event) {
                                if (event.data === 0) {
                                    resolve();
                                }
                                else {
                                    console.log(event.data);
                                    worker.terminate();
                                    reject(new Error(event.data));
                                }
                            };
                            worker.postMessage({ type: 'weight', data: weight_data }, [weight_data.buffer]);
                        });
                        return [2 /*return*/, promise];
                }
            });
        });
    };
    DescriptorRunnerWebassembly.prototype.getInputViews = function () {
        if (this.inputViews)
            return this.inputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        var descriptor = this.descriptor;
        var placeholderContext = this.placeholderContext;
        this.inputViews = descriptor.inputs.map(function (name) {
            var allocation = descriptor.memory_layout.static.allocations[name] || descriptor.memory_layout.dynamic.allocations[name];
            var view = new SymbolicFloat32Array(allocation, placeholderContext, true);
            return view;
        });
        return this.inputViews;
    };
    DescriptorRunnerWebassembly.prototype.getOutputViews = function () {
        if (this.outputViews)
            return this.outputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        var descriptor = this.descriptor;
        var placeholderContext = this.placeholderContext;
        this.outputViews = descriptor.outputs.map(function (name) {
            var allocation = descriptor.memory_layout.static.allocations[name] || descriptor.memory_layout.dynamic.allocations[name];
            // buffer for SymbolicFloat32Array is dedicated for IO, since computation is performed on separate memory space.
            var view = new SymbolicFloat32Array(allocation, placeholderContext, true);
            return view;
        });
        return this.outputViews;
    };
    DescriptorRunnerWebassembly.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var descriptor, worker, inputViews, outputViews, promise;
            return __generator(this, function (_a) {
                // if (this._running) throw new Error('Calling another run() while running.');
                if (!this.descriptor)
                    throw new Error('Descriptor is not loaded');
                if (!this.inputViews || !this.outputViews)
                    throw new Error('getInputViews and getOutputViews must be called prior to run');
                if (!this.worker)
                    throw new Error('Worker is not initialized');
                descriptor = this.descriptor;
                worker = this.worker;
                inputViews = this.inputViews;
                outputViews = this.outputViews;
                promise = new Promise(function (resolve, reject) {
                    // TODO: better way not to generate function on every run
                    _this.worker_promise_reject_func = reject;
                    worker.onmessage = function (event) {
                        if (Array.isArray(event.data)) {
                            for (var i = 0; i < event.data.length; i++) {
                                outputViews[i].set(event.data[i]);
                            }
                            resolve();
                        }
                        else {
                            console.log(event.data);
                            worker.terminate();
                            reject(new Error(event.data));
                        }
                    };
                    var allocations = [descriptor.memory_layout.static.allocations, descriptor.memory_layout.dynamic.allocations];
                    var inputs = [];
                    for (var i = 0; i < descriptor.inputs.length; i++) {
                        for (var allocation_space = 0; allocation_space < 2; allocation_space++) {
                            var var_alloc = allocations[allocation_space][descriptor.inputs[i]];
                            if (var_alloc) {
                                var symAb = inputViews[i];
                                inputs.push({
                                    space: allocation_space,
                                    offset: symAb.offset,
                                    size: symAb.length,
                                    data: symAb.toActual()
                                });
                                break;
                            }
                        }
                    }
                    var outputs = [];
                    for (var i = 0; i < descriptor.outputs.length; i++) {
                        for (var allocation_space = 0; allocation_space < 2; allocation_space++) {
                            var var_alloc = allocations[allocation_space][descriptor.outputs[i]];
                            if (var_alloc) {
                                var symAb = outputViews[i];
                                outputs.push({ space: allocation_space, offset: symAb.offset, size: symAb.length });
                                break;
                            }
                        }
                    }
                    worker.postMessage({ type: 'run', inputs: inputs, outputs: outputs });
                });
                return [2 /*return*/, promise];
            });
        });
    };
    return DescriptorRunnerWebassembly;
}(DescriptorRunner));

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/// <reference path="./webgl2.d.ts" />
/**
 * @protected
 */
function isWebGL2(gl) {
    return gl.constructor.name === 'WebGL2RenderingContext';
}
/**
 * @private
 */
var instance;
/**
 * @protected
 */
var WebGLHandler = /** @class */ (function () {
    /**
     * WebGLHandler is singleton class and instantiate directly is forbidden (constructor is hidden).
     *
     * Since the number of GPU contexts may be limited, the handler is used as a singleton
     * and only one context is shared among multiple runners.
     */
    function WebGLHandler() {
        this.gl = checkNull(WebGLHandler.initializeContext());
    }
    WebGLHandler.getInstance = function () {
        if (!instance)
            instance = new WebGLHandler();
        return instance;
    };
    WebGLHandler.prototype.createTexture = function (textureWidth, textureHeight, internalFormat, format) {
        var gl = this.gl;
        var texture = checkNull(gl.createTexture());
        gl.activeTexture(gl.TEXTURE0 + 9); // TODO: texture unit 9 is always available?
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, textureWidth, textureHeight, 0, format, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    };
    WebGLHandler.prototype.createVertexShader = function (source) {
        return this.createShader(this.gl.VERTEX_SHADER, source);
    };
    WebGLHandler.prototype.createFragmentShader = function (source) {
        return this.createShader(this.gl.FRAGMENT_SHADER, source);
    };
    WebGLHandler.prototype.createShader = function (type, source) {
        var shader = checkNull(this.gl.createShader(type));
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(shader));
            throw Error("Shader Compile failed: " + this.gl.getShaderInfoLog(shader));
        }
        return shader;
    };
    WebGLHandler.prototype.createProgram = function (vertexShader, fragmentShader) {
        var program = checkNull(this.gl.createProgram());
        this.gl.attachShader(program, fragmentShader);
        this.gl.attachShader(program, vertexShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramInfoLog(program));
            throw Error('ShaderProgram Initialization failed.');
        }
        return program;
    };
    WebGLHandler.prototype.createArrayBuffer = function (vertexArray) {
        var buffer = checkNull(this.gl.createBuffer());
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.STATIC_DRAW);
        return buffer;
    };
    WebGLHandler.prototype.createFrameBuffer = function () {
        return checkNull(this.gl.createFramebuffer());
    };
    WebGLHandler.prototype.bindArrayBuffer = function (buffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    };
    WebGLHandler.prototype.bindFrameBuffer = function (frameBuffer, width, height) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
        this.gl.viewport(0, 0, width, height);
        this.gl.scissor(0, 0, width, height);
    };
    WebGLHandler.prototype.useProgram = function (program) {
        this.gl.useProgram(program);
    };
    WebGLHandler.prototype.deleteTexture = function (texture) {
        this.gl.deleteTexture(texture);
    };
    WebGLHandler.initializeWebGL2Context = function (canvas) {
        if (canvas === void 0) { canvas = document.createElement('canvas'); }
        var gl;
        gl = (canvas.getContext('webgl2'));
        if (!gl)
            return null;
        if (!gl.getExtension('EXT_color_buffer_float'))
            return null;
        if (getConfiguration('DEBUG', false) && !gl.getExtension('WEBGL_debug_renderer_info'))
            return null;
        return gl;
    };
    WebGLHandler.initializeWebGL1Context = function (canvas) {
        if (canvas === void 0) { canvas = document.createElement('canvas'); }
        var gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        if (!gl)
            return null;
        if (!gl.getExtension('OES_texture_float'))
            return null;
        if (WebGLHandler.IS_SAFARI) {
            //TODO(Kiikurage)
            // Safari supports WebGL with OES_TEXTURE_FLOAT extension. However,
            // currently when WebGLRenderingContext#readPixels is called, an error is thrown.
            return null;
        }
        if (getConfiguration('DEBUG', false) && !gl.getExtension('WEBGL_debug_renderer_info'))
            return null;
        return gl;
    };
    WebGLHandler.initializeContext = function () {
        var canvas = document.createElement('canvas');
        var gl;
        gl = WebGLHandler.initializeWebGL2Context(canvas);
        if (gl) {
            if (getConfiguration('DEBUG', false))
                console.info('WebGL2 is enabled');
        }
        else {
            gl = WebGLHandler.initializeWebGL1Context(canvas);
            if (gl) {
                if (getConfiguration('DEBUG', false))
                    console.info('WebGL2 is disabled');
            }
            else {
                return null;
            }
        }
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.STENCIL_TEST);
        gl.disable(gl.BLEND);
        gl.disable(gl.DITHER);
        gl.disable(gl.POLYGON_OFFSET_FILL);
        gl.disable(gl.SAMPLE_COVERAGE);
        gl.enable(gl.SCISSOR_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        return gl;
    };
    /**
     * Check whether WebGL is supported or not
     * @protected
     */
    WebGLHandler.checkAvailability = function () {
        if (availability === null) {
            var gl = WebGLHandler.initializeContext();
            if (!gl) {
                availability = false;
            }
            else if (getConfiguration('MAX_TEXTURE_SIZE', gl.getParameter(gl.MAX_TEXTURE_SIZE)) < 4096) {
                availability = false;
            }
            else {
                availability = true;
            }
        }
        return availability;
    };
    WebGLHandler.prototype.waitForComplete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gl, sync, status_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gl = this.gl;
                        if (!isWebGL2(gl)) return [3 /*break*/, 4];
                        sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
                        status_1 = gl.clientWaitSync(sync, 0, 0);
                        _a.label = 1;
                    case 1:
                        if (!(status_1 !== gl.CONDITION_SATISFIED && status_1 !== gl.ALREADY_SIGNALED)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1); })];
                    case 2:
                        _a.sent();
                        status_1 = gl.clientWaitSync(sync, 0, 0);
                        return [3 /*break*/, 1];
                    case 3:
                        gl.deleteSync(sync);
                        return [3 /*break*/, 5];
                    case 4:
                        gl.finish();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(WebGLHandler.prototype, "MAX_TEXTURE_SIZE", {
        get: function () {
            var MAX_TEXTURE_SIZE = getConfiguration('MAX_TEXTURE_SIZE', this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE));
            // FIXME: In most case, MAX_TEXTURE_SIZE=4096 is the fastest (Why?).
            if (MAX_TEXTURE_SIZE >= 16384) {
                return 4096;
            }
            else if (MAX_TEXTURE_SIZE >= 8192) {
                return 4096;
            }
            else if (MAX_TEXTURE_SIZE >= 4096) {
                return 4096;
            }
            else {
                throw new Error("MAX_TEXTURE_SIZE is too small: " + MAX_TEXTURE_SIZE);
            }
        },
        enumerable: true,
        configurable: true
    });
    WebGLHandler.IS_SAFARI = navigator.userAgent.toLowerCase().indexOf('safari') !== -1 && navigator.userAgent.toLowerCase().indexOf('chrome') === -1;
    return WebGLHandler;
}());
/**
 * @private
 */
var availability = null;
function checkNull(obj) {
    if (obj === null)
        throw Error('Null is detected');
    return obj;
}

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * Abstract buffer interface. Read/write transactions are regarded as asynchronous operation.
 *
 * @protected
 */
var Buffer = /** @class */ (function () {
    function Buffer(byteLength, backend) {
        this.byteLength = byteLength;
        this.backend = backend;
    }
    return Buffer;
}());

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @protected
 */
var BufferWebGL = /** @class */ (function (_super) {
    __extends(BufferWebGL, _super);
    function BufferWebGL(byteLength, textureWidth, textureHeight, name, array, channelMode) {
        var _this = _super.call(this, byteLength, 'webgl') || this;
        _this._texture = null;
        _this.readTextureUnitIndices = [];
        _this.isBoundToDrawFrameBuffer = false;
        _this.handler = WebGLHandler.getInstance();
        _this.name = name;
        _this.channelMode = channelMode;
        switch (channelMode) {
            case 'RGBA':
                _this.elementsPerPixel = 4;
                break;
            case 'R':
                _this.elementsPerPixel = 1;
                break;
            default:
                throw Error('Unknown channel mode');
        }
        if (isWebGL2(_this.handler.gl)) {
            switch (channelMode) {
                case 'RGBA':
                    _this.textureFormat = _this.handler.gl.RGBA;
                    _this.textureInternalFormat = _this.handler.gl.RGBA32F;
                    _this.pixelStride = 4;
                    break;
                case 'R':
                    _this.textureFormat = _this.handler.gl.RED;
                    _this.textureInternalFormat = _this.handler.gl.R32F;
                    _this.pixelStride = 1;
                    break;
                default:
                    throw Error('Unknown channel mode');
            }
        }
        else {
            // In WebGL1, always RGBA channel mode is specified. If R channel mode is specified in graph descriptor,
            // other 3 channels are not used.
            _this.textureFormat = _this.handler.gl.RGBA;
            _this.textureInternalFormat = _this.handler.gl.RGBA;
            _this.pixelStride = 4;
        }
        if (_this.pixelStride < _this.elementsPerPixel)
            throw Error('elementsPerPixel must be smaller than pixelStride');
        _this.array = array || new Float32Array(_this.length);
        _this.textureWidth = textureWidth;
        _this.textureHeight = textureHeight;
        return _this;
    }
    Object.defineProperty(BufferWebGL.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferWebGL.prototype, "length", {
        get: function () {
            return this.byteLength / Float32Array.BYTES_PER_ELEMENT;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Write contents onto specified position synchronously.
     *
     * @param {ArrayBufferView} src contents source buffer
     * @param {number} offset position where contents are written on
     */
    BufferWebGL.prototype.write = function (src, offset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.array.set(src, offset);
                        return [4 /*yield*/, this.syncWriteViews()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Read contents from specified position synchronously.
     *
     * @param {Float32ArrayConstructor | Int32ArrayConstructor} dst buffer where contents are written on
     * @param {number} offset position where contents are read from
     * @param {length} length contents length
     */
    BufferWebGL.prototype.read = function (dst, offset, length) {
        if (offset === void 0) { offset = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (dst !== Float32Array)
                            throw new Error('Currently, only Float32Array is supported for parameter \'dst\'.');
                        return [4 /*yield*/, this.syncReadViews()];
                    case 1:
                        _a.sent();
                        new Float32Array(this.array.buffer, offset * Float32Array.BYTES_PER_ELEMENT, length);
                        return [2 /*return*/];
                }
            });
        });
    };
    BufferWebGL.prototype.getWriteView = function (offset, length, type) {
        return new type(this.array.buffer, offset * type.BYTES_PER_ELEMENT, length);
    };
    
    BufferWebGL.prototype.getReadView = function (offset, length, type) {
        return new type(this.array.buffer, offset * type.BYTES_PER_ELEMENT, length);
    };
    /**
     * Sync buffered data into memory.
     *
     * @see Buffer#getWriteView
     */
    BufferWebGL.prototype.syncWriteViews = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gl, tmp, tmp2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gl = this.handler.gl;
                        if (!this.texture)
                            this.allocateTexture();
                        tmp = this.pack(this.array);
                        if (tmp.length != this.textureWidth * this.textureHeight * this.pixelStride) {
                            tmp2 = new Float32Array(this.textureWidth * this.textureHeight * this.elementsPerPixel);
                            tmp2.set(tmp, 0);
                            tmp = tmp2;
                        }
                        return [4 /*yield*/, this.bindToReadTexture(9)];
                    case 1:
                        _a.sent(); //TODO: texture unit 9 is always available?
                        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.textureWidth, this.textureHeight, this.textureFormat, gl.FLOAT, tmp);
                        this.unbindFromReadTexture();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sync memory data into buffer view.
     *
     * @see Buffer#getReadView
     */
    BufferWebGL.prototype.syncReadViews = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gl, ELEMENT_PER_PIXEL, FORMAT, tmp;
            return __generator(this, function (_a) {
                gl = this.handler.gl;
                ELEMENT_PER_PIXEL = 4;
                FORMAT = gl.RGBA;
                tmp = new Float32Array(this.textureWidth * this.textureHeight * ELEMENT_PER_PIXEL);
                this.bindToDrawTexture();
                gl.readPixels(0, 0, this.textureWidth, this.textureHeight, FORMAT, gl.FLOAT, tmp);
                this.unbindFromDrawTexture();
                tmp = this.unpack(tmp);
                this.array.set(tmp.slice(0, this.length), 0);
                return [2 /*return*/];
            });
        });
    };
    BufferWebGL.prototype.bindToReadTexture = function (unit) {
        return __awaiter(this, void 0, void 0, function () {
            var gl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isBoundToDrawFrameBuffer)
                            throw Error('This buffer is already registered as draw buffer. ' +
                                'You may forgot to unbind the binding while previous operations.');
                        gl = this.handler.gl;
                        if (!!this.texture) return [3 /*break*/, 2];
                        this.allocateTexture();
                        return [4 /*yield*/, this.syncWriteViews()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        gl.activeTexture(gl.TEXTURE0 + unit);
                        gl.bindTexture(gl.TEXTURE_2D, this.texture);
                        this.readTextureUnitIndices.push(unit);
                        return [2 /*return*/];
                }
            });
        });
    };
    BufferWebGL.prototype.unbindFromReadTexture = function () {
        var gl = this.handler.gl;
        for (var _i = 0, _a = this.readTextureUnitIndices; _i < _a.length; _i++) {
            var unit = _a[_i];
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.readTextureUnitIndices = [];
    };
    BufferWebGL.prototype.bindToDrawTexture = function () {
        if (this.readTextureUnitIndices.length > 0)
            throw Error('This buffer is already registered as read buffer. ' +
                'You cannot bind a texture as both read and draw texture buffer at same time.');
        if (this.isBoundToDrawFrameBuffer)
            throw Error('This buffer is already registered as draw buffer. ' +
                'You may forgot to unbind the binding while previous operations.');
        var gl = this.handler.gl;
        if (!this.texture)
            this.allocateTexture();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        this.isBoundToDrawFrameBuffer = true;
    };
    BufferWebGL.prototype.unbindFromDrawTexture = function () {
        if (!this.isBoundToDrawFrameBuffer)
            return;
        var gl = this.handler.gl;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
        this.isBoundToDrawFrameBuffer = false;
    };
    BufferWebGL.prototype.pack = function (array) {
        var elementStride = this.pixelStride / this.elementsPerPixel;
        if (elementStride === 1) {
            return new Float32Array(array);
        }
        else {
            var result = new Float32Array(array.length * elementStride);
            for (var i = 0; i < array.length; i++)
                result[i * elementStride] = array[i];
            return result;
        }
    };
    BufferWebGL.prototype.unpack = function (array) {
        // FIXME(Kiikurage): more readable code
        var PIXEL_STRIDE = 4;
        var elementStride = PIXEL_STRIDE / this.elementsPerPixel;
        if (elementStride === 1) {
            return new Float32Array(array);
        }
        else {
            var result = new Float32Array(array.length / elementStride);
            for (var i = 0; i < array.length / elementStride; i++)
                result[i] = array[i * elementStride];
            return result;
        }
    };
    BufferWebGL.prototype.allocateTexture = function () {
        if (this.texture)
            throw Error('Texture is already allocated.');
        this._texture = this.handler.createTexture(this.textureWidth, this.textureHeight, this.textureInternalFormat, this.textureFormat);
    };
    return BufferWebGL;
}(Buffer));

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @private
 */
var localforage$2 = localforage_nopromises_min;
// [x y u v] * [upper-left, lower-left, upper-right, lower-right]
/**
 * @protected
 */
var vertexArray = new Float32Array([
    -1, +1,
    -1, -1,
    +1, +1,
    +1, -1,
]);
/**
 * @protected
 */
var DescriptorRunnerWebGL = /** @class */ (function (_super) {
    __extends(DescriptorRunnerWebGL, _super);
    function DescriptorRunnerWebGL() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.backendName = 'webgl';
        return _this;
    }
    DescriptorRunnerWebGL.checkAvailability = function () {
        return WebGLHandler.checkAvailability();
    };
    DescriptorRunnerWebGL.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vertexBuffer;
            return __generator(this, function (_a) {
                if (!DescriptorRunnerWebGL.checkAvailability())
                    throw Error('WebGL backend is not supported in this browser.');
                this.handler = WebGLHandler.getInstance();
                vertexBuffer = this.handler.createArrayBuffer(vertexArray);
                this.handler.bindArrayBuffer(vertexBuffer);
                this.buffers = new Map();
                return [2 /*return*/];
            });
        });
    };
    DescriptorRunnerWebGL.prototype.fetchDescriptor = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, webdnnFetch(directory + "/graph_" + this.backendName + "_" + this.handler.MAX_TEXTURE_SIZE + ".json")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        });
    };
    DescriptorRunnerWebGL.prototype.fetchParameters = function (directory, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, webdnnFetch(directory + "/weight_" + this.backendName + "_" + this.handler.MAX_TEXTURE_SIZE + ".bin")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, readArrayBufferProgressively(res, progressCallback)];
                }
            });
        });
    };
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    DescriptorRunnerWebGL.prototype.restoreCachedDescriptor = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, localforage$2.getItem(directory + "_" + this.backendName + "_" + this.handler.MAX_TEXTURE_SIZE + "_descriptor").catch(function () { return null; })];
            });
        });
    };
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    DescriptorRunnerWebGL.prototype.restoreCachedParameters = function (directory, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var parameter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localforage$2.getItem(directory + "_" + this.backendName + "_" + this.handler.MAX_TEXTURE_SIZE + "_parameters").catch(function () { return null; })];
                    case 1:
                        parameter = _a.sent();
                        if (parameter && progressCallback)
                            progressCallback(parameter.byteLength, parameter.byteLength);
                        return [2 /*return*/, parameter];
                }
            });
        });
    };
    /**
     * save cache
     */
    DescriptorRunnerWebGL.prototype.saveCache = function (directory, descriptor, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            localforage$2.setItem(directory + "_" + this.backendName + "_" + this.handler.MAX_TEXTURE_SIZE + "_descriptor", descriptor),
                            localforage$2.setItem(directory + "_" + this.backendName + "_" + this.handler.MAX_TEXTURE_SIZE + "_parameters", parameters)
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    
    DescriptorRunnerWebGL.prototype.setDescriptorAndParameters = function (descriptor, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setDescriptor(descriptor)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.compile()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.initializeStaticBuffer(parameters)];
                    case 3:
                        _a.sent();
                        if (!(this.placeholderContext && this.placeholderContext.isResolved)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.initializeDynamicBuffer()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerWebGL.prototype.initializeStaticBuffer = function (weightRawArray) {
        return __awaiter(this, void 0, void 0, function () {
            var descriptor, decoder, weight, buffers, mapping;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        descriptor = this.descriptor;
                        decoder = getWeightDecoder(this.descriptor.weight_encoding);
                        return [4 /*yield*/, decoder.decode(new Uint8Array(weightRawArray))];
                    case 1:
                        weight = _a.sent();
                        buffers = this.buffers;
                        mapping = descriptor.memory_layout.mapping;
                        Object.entries(descriptor.memory_layout.static.allocations)
                            .forEach(function (_a) {
                            var name = _a[0], _b = _a[1], width = _b.width, height = _b.height, size = _b.size, channel_mode = _b.channel_mode;
                            buffers.set(name, new BufferWebGL(size * Float32Array.BYTES_PER_ELEMENT, width, height, name, null, channel_mode));
                        });
                        Object.entries(descriptor.constants_map)
                            .forEach(function (_a) {
                            var name = _a[0], _b = _a[1], size = _b.size, byte_offset = _b.byte_offset;
                            buffers.get(name).array.set(new Float32Array(weight.buffer, byte_offset, size));
                        });
                        return [4 /*yield*/, this.getInputViews()];
                    case 2:
                        (_a.sent())
                            .filter(function (view) { return !view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(buffers.get(mapping[view.name]).getWriteView(0, view.length, Float32Array).buffer); });
                        return [4 /*yield*/, this.getOutputViews()];
                    case 3:
                        (_a.sent())
                            .filter(function (view) { return !view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(buffers.get(mapping[view.name]).getReadView(0, view.length, Float32Array).buffer); });
                        return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerWebGL.prototype.initializeDynamicBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var descriptor, placeholderContext, buffers, mapping;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.descriptor)
                            throw Error("GraphDescriptor is not loaded.");
                        if (!this.placeholderContext)
                            throw Error("PlaceholderContext is not initialized.");
                        descriptor = this.descriptor;
                        placeholderContext = this.placeholderContext;
                        buffers = this.buffers;
                        mapping = descriptor.memory_layout.mapping;
                        Object.entries(descriptor.memory_layout.dynamic.allocations)
                            .forEach(function (_a) {
                            var name = _a[0], _b = _a[1], width = _b.width, height = _b.height, size = _b.size, channel_mode = _b.channel_mode;
                            buffers.set(name, new BufferWebGL(placeholderContext.resolve(size) * Float32Array.BYTES_PER_ELEMENT, placeholderContext.resolve(width), placeholderContext.resolve(height), name, null, channel_mode));
                        });
                        return [4 /*yield*/, this.getInputViews()];
                    case 1:
                        (_a.sent())
                            .filter(function (view) { return view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(buffers.get(mapping[view.name]).getWriteView(0, placeholderContext.resolve(view.length), Float32Array).buffer); });
                        return [4 /*yield*/, this.getOutputViews()];
                    case 2:
                        (_a.sent())
                            .filter(function (view) { return view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(buffers.get(mapping[view.name]).getReadView(0, placeholderContext.resolve(view.length), Float32Array).buffer); });
                        this.buildPipeline();
                        return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerWebGL.prototype.setDescriptor = function (descriptor) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.descriptor = descriptor;
                //reset all datum depend on old descriptor
                this.placeholderContext = new PlaceholderContext(descriptor.placeholders);
                return [2 /*return*/];
            });
        });
    };
    DescriptorRunnerWebGL.prototype.compile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var descriptor;
            return __generator(this, function (_a) {
                if (!this.descriptor)
                    throw new Error('Descriptor is not loaded');
                descriptor = this.descriptor;
                this.programs = new Map();
                this.vertexShader = this.handler.createVertexShader("\n            precision highp float;\n            attribute vec2 _xy;\n            void main() { \n              gl_Position = vec4(_xy, 0, 1); \n            }\n        ");
                Object.keys(descriptor.shader_sources)
                    .forEach(function (name) {
                    var fragmentShader = _this.handler.createFragmentShader(descriptor.shader_sources[name]);
                    var program = _this.handler.createProgram(_this.vertexShader, fragmentShader);
                    _this.programs.set(name, program);
                });
                return [2 /*return*/];
            });
        });
    };
    DescriptorRunnerWebGL.prototype.setPlaceholderValue = function (values) {
        return __awaiter(this, void 0, void 0, function () {
            var placeholderContext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.placeholderContext)
                            throw new Error('PlaceholderContext is not initialized.');
                        placeholderContext = this.placeholderContext;
                        placeholderContext.update(values);
                        if (!placeholderContext.isResolved)
                            return [2 /*return*/];
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        return [4 /*yield*/, this.initializeDynamicBuffer()];
                    case 1:
                        _a.sent();
                        // resolve placeholders in execution info
                        // TODO:
                        if (Object.keys(this.descriptor.placeholders).length > 0)
                            throw Error('Currently, WebGL backend doesn\'t support Placeholder feature.');
                        return [2 /*return*/];
                }
            });
        });
    };
    DescriptorRunnerWebGL.prototype.getInputViews = function () {
        var _this = this;
        if (this.inputViews)
            return this.inputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        var descriptor = this.descriptor;
        var placeholderContext = this.placeholderContext;
        var mapping = this.descriptor.memory_layout.mapping;
        this.inputViews = descriptor.inputs.map(function (name) {
            var view = new SymbolicFloat32Array({
                name: name,
                size: _this.buffers.get(mapping[name]).length,
                offset: 0
            }, placeholderContext, true);
            return view;
        });
        return this.inputViews;
    };
    DescriptorRunnerWebGL.prototype.getOutputViews = function () {
        var _this = this;
        if (this.outputViews)
            return this.outputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        var descriptor = this.descriptor;
        var placeholderContext = this.placeholderContext;
        var mapping = this.descriptor.memory_layout.mapping;
        this.outputViews = descriptor.outputs.map(function (name) {
            var view = new SymbolicFloat32Array({
                name: name,
                size: _this.buffers.get(mapping[name]).length,
                offset: 0
            }, placeholderContext, true);
            return view;
        });
        return this.outputViews;
    };
    DescriptorRunnerWebGL.prototype.buildPipeline = function () {
        var _this = this;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        if (!this.placeholderContext.isResolved)
            throw new Error("Not all placeholders are resolved: " + this.placeholderContext);
        var gl = this.handler.gl;
        var buffers = this.buffers;
        var mapping = this.descriptor.memory_layout.mapping;
        var referenceCount = new Map();
        this.runtimeInfo = {
            inputs: this.getInputViews().map(function (view) { return buffers.get(mapping[view.name]); }),
            outputs: this.getOutputViews().map(function (view) { return buffers.get(mapping[view.name]); }),
            programs: this.descriptor.exec_infos.map(function (execInfo) {
                // inputs
                var inputs = execInfo.inputs.map(function (input) {
                    var buffer = buffers.get(mapping[input.variable_name]);
                    if (!referenceCount.has(buffer))
                        referenceCount.set(buffer, 0);
                    referenceCount.set(buffer, referenceCount.get(buffer) + 1);
                    return {
                        buffer: buffer,
                        uniformIndex: input.value
                    };
                });
                //output
                var output = buffers.get(mapping[execInfo.output]);
                // shader
                var program = _this.programs.get(execInfo.shader_name);
                _this.handler.useProgram(program);
                // uniforms
                var uniforms = Object.keys(execInfo.uniforms).map(function (name) {
                    var _a = execInfo.uniforms[name], type = _a.type, value = _a.value;
                    switch (type) {
                        case 'int':
                            return {
                                func: gl.uniform1i,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'float':
                            return {
                                func: gl.uniform1f,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'vec2':
                            return {
                                func: gl.uniform2fv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'vec3':
                            return {
                                func: gl.uniform3fv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'vec4':
                            return {
                                func: gl.uniform4fv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'ivec2':
                            return {
                                func: gl.uniform2iv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'ivec3':
                            return {
                                func: gl.uniform3iv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'ivec4':
                            return {
                                func: gl.uniform4iv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'sampler2D':
                            return {
                                func: gl.uniform1i,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        default:
                            throw TypeError("Incompatible type for uniform parameter: " + type);
                    }
                });
                // attributes
                var xyAttribLoc = gl.getAttribLocation(program, '_xy');
                // run
                return {
                    program: program,
                    frameBuffer: _this.handler.createFrameBuffer(),
                    name: execInfo.shader_name,
                    width: output.textureWidth,
                    height: output.textureHeight,
                    inputs: inputs,
                    output: output,
                    xyAttribLoc: xyAttribLoc,
                    uniforms: uniforms,
                    disposable: []
                };
            })
        };
        var _loop_1 = function (runtimeProgramInfo) {
            runtimeProgramInfo.inputs.forEach(function (_a) {
                var buffer = _a.buffer;
                var count = referenceCount.get(buffer) - 1;
                if (count == 0) {
                    runtimeProgramInfo.disposable.push(buffer);
                }
                referenceCount.set(buffer, count);
            });
        };
        for (var _i = 0, _a = this.runtimeInfo.programs; _i < _a.length; _i++) {
            var runtimeProgramInfo = _a[_i];
            _loop_1(runtimeProgramInfo);
        }
    };
    DescriptorRunnerWebGL.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gl, runtimeInfo, _i, _a, buffer, records, totalElapsedTime_1, _b, _c, runtimeProgramInfo, start, _d, _e, _f, buffer, uniformIndex, _g, _h, uniform, elapsedTime, xs, _j, _k, buffer, y, summary, _l, _m, runtimeProgramInfo, _o, _p, _q, buffer, uniformIndex, _r, _s, uniform, _t, _u, buffer, _v, _w, buffer;
            return __generator(this, function (_x) {
                switch (_x.label) {
                    case 0:
                        // if (this._running) throw new Error('Calling another run() while running.');
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        if (!this.inputViews || !this.outputViews)
                            throw new Error('getInputViews and getOutputViews must be called prior to run');
                        if (!this.placeholderContext)
                            throw new Error('PlaceholderContext is not initialized');
                        if (!this.placeholderContext.isResolved)
                            throw new Error("Not all placeholders are resolved: " + this.placeholderContext);
                        gl = this.handler.gl;
                        runtimeInfo = this.runtimeInfo;
                        if (!(this.runtimeInfo.programs.length > 0)) return [3 /*break*/, 29];
                        _i = 0, _a = runtimeInfo.inputs;
                        _x.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        buffer = _a[_i];
                        return [4 /*yield*/, buffer.syncWriteViews()];
                    case 2:
                        _x.sent();
                        _x.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!getConfiguration('DEBUG', false)) return [3 /*break*/, 18];
                        records = [];
                        totalElapsedTime_1 = 0;
                        _b = 0, _c = runtimeInfo.programs;
                        _x.label = 5;
                    case 5:
                        if (!(_b < _c.length)) return [3 /*break*/, 17];
                        runtimeProgramInfo = _c[_b];
                        start = performance.now();
                        this.handler.bindFrameBuffer(runtimeProgramInfo.frameBuffer, runtimeProgramInfo.width, runtimeProgramInfo.height);
                        _d = 0, _e = runtimeProgramInfo.inputs;
                        _x.label = 6;
                    case 6:
                        if (!(_d < _e.length)) return [3 /*break*/, 9];
                        _f = _e[_d], buffer = _f.buffer, uniformIndex = _f.uniformIndex;
                        return [4 /*yield*/, buffer.bindToReadTexture(uniformIndex)];
                    case 7:
                        _x.sent();
                        _x.label = 8;
                    case 8:
                        _d++;
                        return [3 /*break*/, 6];
                    case 9:
                        // output
                        runtimeProgramInfo.output.bindToDrawTexture();
                        // shader
                        this.handler.useProgram(runtimeProgramInfo.program);
                        // uniforms
                        for (_g = 0, _h = runtimeProgramInfo.uniforms; _g < _h.length; _g++) {
                            uniform = _h[_g];
                            uniform.func.apply(gl, uniform.args);
                        }
                        // attribute
                        gl.vertexAttribPointer(runtimeProgramInfo.xyAttribLoc, 2, gl.FLOAT, true, 8, 0);
                        gl.enableVertexAttribArray(runtimeProgramInfo.xyAttribLoc);
                        // run
                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexArray.length / 2);
                        return [4 /*yield*/, this.handler.waitForComplete()];
                    case 10:
                        _x.sent();
                        elapsedTime = performance.now() - start;
                        totalElapsedTime_1 += elapsedTime;
                        xs = [];
                        _j = 0, _k = runtimeProgramInfo.inputs;
                        _x.label = 11;
                    case 11:
                        if (!(_j < _k.length)) return [3 /*break*/, 14];
                        buffer = _k[_j].buffer;
                        buffer.unbindFromReadTexture();
                        return [4 /*yield*/, buffer.syncReadViews()];
                    case 12:
                        _x.sent();
                        xs.push(buffer.array.slice());
                        _x.label = 13;
                    case 13:
                        _j++;
                        return [3 /*break*/, 11];
                    case 14:
                        runtimeProgramInfo.output.unbindFromDrawTexture();
                        return [4 /*yield*/, runtimeProgramInfo.output.syncReadViews()];
                    case 15:
                        _x.sent();
                        y = runtimeProgramInfo.output.array.slice();
                        records.push({
                            'Kernel': runtimeProgramInfo.name,
                            'Elapsed time [ms]': elapsedTime,
                            'xs': xs,
                            'y': y
                        });
                        _x.label = 16;
                    case 16:
                        _b++;
                        return [3 /*break*/, 5];
                    case 17:
                        summary = Array.from(Object.values(records.reduce(function (summary, record) {
                            if (!(record['Kernel'] in summary)) {
                                summary[record['Kernel']] = {
                                    'Kernel': record['Kernel'],
                                    'Count': 0,
                                    'Elapsed time [ms]': 0,
                                };
                            }
                            summary[record['Kernel']]['Count']++;
                            summary[record['Kernel']]['Elapsed time [ms]'] += record['Elapsed time [ms]'];
                            return summary;
                        }, {})));
                        summary.forEach(function (record) { return record['Ratio [%]'] = (record['Elapsed time [ms]'] / totalElapsedTime_1).toFixed(2); });
                        console.table(records);
                        console.table(summary);
                        return [3 /*break*/, 25];
                    case 18:
                        _l = 0, _m = runtimeInfo.programs;
                        _x.label = 19;
                    case 19:
                        if (!(_l < _m.length)) return [3 /*break*/, 25];
                        runtimeProgramInfo = _m[_l];
                        this.handler.bindFrameBuffer(runtimeProgramInfo.frameBuffer, runtimeProgramInfo.width, runtimeProgramInfo.height);
                        _o = 0, _p = runtimeProgramInfo.inputs;
                        _x.label = 20;
                    case 20:
                        if (!(_o < _p.length)) return [3 /*break*/, 23];
                        _q = _p[_o], buffer = _q.buffer, uniformIndex = _q.uniformIndex;
                        return [4 /*yield*/, buffer.bindToReadTexture(uniformIndex)];
                    case 21:
                        _x.sent();
                        _x.label = 22;
                    case 22:
                        _o++;
                        return [3 /*break*/, 20];
                    case 23:
                        // output
                        runtimeProgramInfo.output.bindToDrawTexture();
                        // shader
                        this.handler.useProgram(runtimeProgramInfo.program);
                        // uniforms
                        for (_r = 0, _s = runtimeProgramInfo.uniforms; _r < _s.length; _r++) {
                            uniform = _s[_r];
                            uniform.func.apply(gl, uniform.args);
                        }
                        // attribute
                        gl.vertexAttribPointer(runtimeProgramInfo.xyAttribLoc, 2, gl.FLOAT, true, 8, 0);
                        gl.enableVertexAttribArray(runtimeProgramInfo.xyAttribLoc);
                        // run
                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexArray.length / 2);
                        // release buffers and binding
                        // for (let buffer of runtimeProgramInfo.disposable) buffer.releaseGPUMemory();
                        for (_t = 0, _u = runtimeProgramInfo.inputs; _t < _u.length; _t++) {
                            buffer = _u[_t].buffer;
                            buffer.unbindFromReadTexture();
                        }
                        runtimeProgramInfo.output.unbindFromDrawTexture();
                        _x.label = 24;
                    case 24:
                        _l++;
                        return [3 /*break*/, 19];
                    case 25:
                        _v = 0, _w = runtimeInfo.outputs;
                        _x.label = 26;
                    case 26:
                        if (!(_v < _w.length)) return [3 /*break*/, 29];
                        buffer = _w[_v];
                        return [4 /*yield*/, buffer.syncReadViews()];
                    case 27:
                        _x.sent();
                        _x.label = 28;
                    case 28:
                        _v++;
                        return [3 /*break*/, 26];
                    case 29: return [2 /*return*/];
                }
            });
        });
    };
    return DescriptorRunnerWebGL;
}(DescriptorRunner));

///<reference path="./webgpu.d.ts" />
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @private
 */
var instance$1;
/**
 * @protected
 */
var WebGPUHandler = /** @class */ (function () {
    /**
     * WebGPUHandler is singleton class and instantiate directly is forbidden (constructor is hidden).
     *
     * Since the number of GPU contexts may be limited, the handler is used as a singleton
     * and only one context is shared among multiple runners.
     */
    function WebGPUHandler() {
        this.pipelineStates = new Map();
        if (!IS_WEBGPU_SUPPORTED)
            throw new Error('This browser does not support WebGPU');
        var context;
        try {
            context = document.createElement('canvas').getContext('webgpu');
        }
        catch (err) {
            throw new Error("During initializing WebGPURenderingContext, unexpected error is occurred: " + err.message);
        }
        if (!context)
            throw new Error('WebGPURenderingContext initialization failed');
        this.context = context;
        this.commandQueue = context.createCommandQueue();
        this.loadKernel('kernel void sync(){}', 'basic');
    }
    WebGPUHandler.getInstance = function () {
        if (!instance$1)
            instance$1 = new WebGPUHandler();
        return instance$1;
    };
    WebGPUHandler.prototype.createBuffer = function (arrayBuffer) {
        return this.context.createBuffer(arrayBuffer);
    };
    WebGPUHandler.prototype.loadKernel = function (librarySource, namespace) {
        if (namespace === void 0) { namespace = ''; }
        var library = this.context.createLibrary(librarySource);
        for (var _i = 0, _a = library.functionNames; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var kernelFunction = library.functionWithName(name_1);
            var pipelineStates = this.context.createComputePipelineState(kernelFunction);
            this.pipelineStates.set(namespace + '.' + name_1, pipelineStates);
        }
    };
    WebGPUHandler.prototype.createCommandBuffer = function () {
        return this.commandQueue.createCommandBuffer();
    };
    WebGPUHandler.prototype.getPipelineStateByName = function (name) {
        var state = this.pipelineStates.get(name);
        if (!state) {
            throw TypeError("Kernel function \"" + name + "\" is not loaded.");
        }
        return state;
    };
    WebGPUHandler.prototype.executeSinglePipelineState = function (name, threadgroupsPerGrid, threadsPerThreadgroup, buffers, getCompletedPromise) {
        var commandBuffer = this.commandBuffer || (this.commandBuffer = this.createCommandBuffer());
        var commandEncoder = commandBuffer.createComputeCommandEncoder();
        commandEncoder.setComputePipelineState(this.getPipelineStateByName(name));
        for (var i = 0; i < buffers.length; i++) {
            var buffer = buffers[i];
            var wgbuf = void 0;
            if (buffer instanceof BufferWebGPU) {
                wgbuf = buffer.buffer;
            }
            else {
                // cannot perform (buffer instanceof WebGPUBuffer) currently
                wgbuf = buffer;
            }
            commandEncoder.setBuffer(wgbuf, 0, i);
        }
        commandEncoder.dispatch(threadgroupsPerGrid, threadsPerThreadgroup);
        commandEncoder.endEncoding();
        var promise = null;
        if (getCompletedPromise) {
            promise = commandBuffer.completed;
        }
        this.commandBuffer = null;
        commandBuffer.commit();
        return promise;
    };
    WebGPUHandler.prototype.sync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commandBuffer, commandEncoder, promise;
            return __generator(this, function (_a) {
                commandBuffer = this.createCommandBuffer();
                commandEncoder = commandBuffer.createComputeCommandEncoder();
                commandEncoder.setComputePipelineState(this.getPipelineStateByName('basic.sync'));
                commandEncoder.dispatch({
                    width: 1,
                    height: 1,
                    depth: 1
                }, {
                    width: 1,
                    height: 1,
                    depth: 1
                });
                commandEncoder.endEncoding();
                promise = commandBuffer.completed;
                commandBuffer.commit();
                return [2 /*return*/, promise];
            });
        });
    };
    return WebGPUHandler;
}());
/**
 * Flag whether WebGPU is supported or not
 * @protected
 */
var IS_WEBGPU_SUPPORTED = 'WebGPURenderingContext' in window && 'WebGPUComputeCommandEncoder' in window;

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @protected
 */
var BufferWebGPU = /** @class */ (function (_super) {
    __extends(BufferWebGPU, _super);
    function BufferWebGPU(byteLength) {
        var _this = _super.call(this, byteLength, 'webgpu') || this;
        if (byteLength == 0) {
            byteLength = 4; //0 length buffer causes error
        }
        _this.handler = WebGPUHandler.getInstance();
        _this.buffer = _this.handler.createBuffer(new Uint8Array(byteLength));
        _this.bufferView = new Uint8Array(_this.buffer.contents);
        return _this;
    }
    // async: there may be platforms synchronization is needed before writing
    BufferWebGPU.prototype.write = function (src, dst_offset) {
        return __awaiter(this, void 0, void 0, function () {
            var viewSameType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handler.sync()];
                    case 1:
                        _a.sent();
                        viewSameType = new src.constructor(this.bufferView.buffer);
                        viewSameType.set(src, dst_offset);
                        return [2 /*return*/];
                }
            });
        });
    };
    BufferWebGPU.prototype.read = function (dst, src_offset, length) {
        if (src_offset === void 0) { src_offset = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var dstConstructor, viewSameType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dst)
                            throw new Error('dst cannot be null');
                        return [4 /*yield*/, this.handler.sync()];
                    case 1:
                        _a.sent();
                        if (this.byteLength === 0)
                            return [2 /*return*/];
                        dstConstructor = dst.constructor;
                        viewSameType = new dstConstructor(this.bufferView.buffer, this.bufferView.byteOffset + src_offset * dstConstructor.BYTES_PER_ELEMENT, length);
                        dst.set(viewSameType);
                        return [2 /*return*/];
                }
            });
        });
    };
    BufferWebGPU.prototype.getWriteView = function (offset, length, type) {
        return new type(this.bufferView.buffer, this.bufferView.byteOffset + offset * type.BYTES_PER_ELEMENT, length);
    };
    BufferWebGPU.prototype.getReadView = function (offset, length, type) {
        return new type(this.bufferView.buffer, this.bufferView.byteOffset + offset * type.BYTES_PER_ELEMENT, length);
    };
    BufferWebGPU.prototype.syncWriteViews = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    BufferWebGPU.prototype.syncReadViews = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // if the user awaits promise from final kernel execution, this function call is not needed.
                    return [4 /*yield*/, this.handler.sync()];
                    case 1:
                        // if the user awaits promise from final kernel execution, this function call is not needed.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BufferWebGPU;
}(Buffer));

/**
 * @module webdnn
 */
/** Don't Remove This comment block */
/**
 * @private
 */
var localforage$3 = localforage_nopromises_min;
/**
 * Check this device is iOS devices or not.
 * @private
 */
var IS_IOS = navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad');
/**
 * DescriptorRunner for WebGPU
 * @protected
 */
var DescriptorRunnerWebGPU = /** @class */ (function (_super) {
    __extends(DescriptorRunnerWebGPU, _super);
    function DescriptorRunnerWebGPU() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * backend name
         * @type {string}
         */
        _this.backendName = 'webgpu';
        return _this;
    }
    /**
     * Return `true` if this backend is available in this environment.
     * @returns {boolean}
     */
    DescriptorRunnerWebGPU.checkAvailability = function () {
        return IS_WEBGPU_SUPPORTED;
    };
    /**
     * Initialize descriptor runner asynchronously
     * @returns {Promise<void>} Promise object which is resolved when the initialization finished.
     */
    DescriptorRunnerWebGPU.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.webgpuHandler = WebGPUHandler.getInstance();
                        return [4 /*yield*/, this.checkIncompatibleGPU()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check whether current GPU is supported or not. If it's not supported, an error is thrown.
     * @returns {Promise<void>}
     */
    DescriptorRunnerWebGPU.prototype.checkIncompatibleGPU = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, threadExecutionWidth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /**
                         * It is reported that AMD GPU crashes when performing sgemm (matrix multiplication).
                         * Until this problem is solved, blocking WebGPU backend in the environment is needed.
                         * API in WebGPU does not directly gives hardware information, so trying to determine hardware heuristically.
                         *
                         * Criteria: thread_execution_width == 32 is required
                         * (on AMD FirePro D500, thread_execution_width == 64)
                         *
                         * @see https://github.com/mil-tokyo/webdnn/issues/286
                         */
                        this.webgpuHandler.loadKernel("\n#include <metal_stdlib>\nusing namespace metal;\n        kernel void check_compatibility(\n            device uint *A[[buffer(0)]],\n            uint global_index[[thread_position_in_grid]],\n            uint thread_execution_width[[thread_execution_width]]\n        ){\n            if (global_index == 0) {\n                A[0] = thread_execution_width;\n            }\n        }", 'basic');
                        buffer = this.webgpuHandler.createBuffer(new Uint32Array(1));
                        return [4 /*yield*/, this.webgpuHandler.executeSinglePipelineState('basic.check_compatibility', { width: 1, height: 1, depth: 1 }, { width: 1, height: 1, depth: 1 }, [buffer], true)];
                    case 1:
                        _a.sent();
                        threadExecutionWidth = (new Uint32Array(buffer.contents))[0];
                        if (threadExecutionWidth != 32) {
                            throw new Error("Sorry, this GPU does not compatible with WebGPU (thread_execution_width == " + threadExecutionWidth + ". See checkIncompatibleGPU method of https://github.com/mil-tokyo/webdnn/blob/master/src/descriptor_runner/descriptor_runner/descriptor_runner_webgpu.ts");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetch graph descriptor from specified directory.
     *
     * @param directory directory where descriptor is contained.
     * You can also provide URL of other domain like this.
     *
     * ```javascript
     * await runner.load('://my.other.domain.com/my_model');
     * ```
     *
     * However sometimes it can't because of Cross-Origin-Resource-Security policy.
     *
     * @protected
     */
    DescriptorRunnerWebGPU.prototype.fetchDescriptor = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, webdnnFetch(directory + "/graph_" + this.backendName + ".json")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        });
    };
    /**
     * Fetch parameter files from specified directory.
     *
     * @param directory directory where descriptor is contained.
     * You can also provide URL of other domain like this.
     *
     * ```javascript
     * await runner.load('://my.other.domain.com/my_model');
     * ```
     *
     * However sometimes it can't because of Cross-Origin-Resource-Security policy.
     *
     * @param progressCallback callback which is called to notice the loading is progressing.
     * @protected
     */
    DescriptorRunnerWebGPU.prototype.fetchParameters = function (directory, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, webdnnFetch(directory + "/weight_" + this.backendName + ".bin")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, readArrayBufferProgressively(res, progressCallback)];
                }
            });
        });
    };
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    DescriptorRunnerWebGPU.prototype.restoreCachedDescriptor = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, localforage$3.getItem(directory + "_" + this.backendName + "_descriptor").catch(function () { return null; })];
            });
        });
    };
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    DescriptorRunnerWebGPU.prototype.restoreCachedParameters = function (directory, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var parameter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localforage$3.getItem(directory + "_" + this.backendName + "_parameters").catch(function () { return null; })];
                    case 1:
                        parameter = _a.sent();
                        if (parameter && progressCallback)
                            progressCallback(parameter.byteLength, parameter.byteLength);
                        return [2 /*return*/, parameter];
                }
            });
        });
    };
    /**
     * save cache
     */
    DescriptorRunnerWebGPU.prototype.saveCache = function (directory, descriptor, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            localforage$3.setItem(directory + "_" + this.backendName + "_descriptor", descriptor),
                            localforage$3.setItem(directory + "_" + this.backendName + "_parameters", parameters)
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    
    DescriptorRunnerWebGPU.prototype.setDescriptorAndParameters = function (descriptor, parameter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.descriptor = descriptor;
                        //reset all datum depend on old descriptor
                        this.staticBuffer = null;
                        this.dynamicBuffer = null;
                        this.metaBuffers = null;
                        this.placeholderContext = new PlaceholderContext(descriptor.placeholders);
                        this.executionInfos = descriptor.exec_infos;
                        //compile kernels
                        this.webgpuHandler.loadKernel(this.descriptor.kernel_source, 'descriptor');
                        return [4 /*yield*/, this.initializeStaticBuffer(parameter)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.initializeMetaBuffers()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.setPlaceholderValue({
                                '__MAX_THREADS_PER_THREADGROUP__': IS_IOS ? 512 : 1024
                            })];
                    case 3:
                        _a.sent();
                        if (!(this.placeholderContext && this.placeholderContext.isResolved)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.initializeDynamicBuffer()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initialize static buffers, whose size and position can be determined in compile time.
     *
     * @param {ArrayBuffer} weightRawArray constant weight buffer
     * @returns {Promise<void>}
     */
    DescriptorRunnerWebGPU.prototype.initializeStaticBuffer = function (weightRawArray) {
        return __awaiter(this, void 0, void 0, function () {
            var descriptor, staticBuffer, decoder, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.descriptor)
                            throw Error("GraphDescriptor is not loaded.");
                        descriptor = this.descriptor;
                        staticBuffer = new BufferWebGPU(descriptor.memory_layout.static.size * Float32Array.BYTES_PER_ELEMENT);
                        this.staticBuffer = staticBuffer;
                        decoder = getWeightDecoder(descriptor.weight_encoding);
                        _b = (_a = staticBuffer).write;
                        return [4 /*yield*/, decoder.decode(new Uint8Array(weightRawArray))];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.getInputViews()];
                    case 3:
                        (_c.sent())
                            .filter(function (view) { return !view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(staticBuffer.bufferView.buffer); });
                        return [4 /*yield*/, this.getOutputViews()];
                    case 4:
                        (_c.sent())
                            .filter(function (view) { return !view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(staticBuffer.bufferView.buffer); });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initialize meta buffers, which contains metadata shared in each GPU kernel thread (ex. hyper parameters).
     * @returns {Promise<void>}
     */
    DescriptorRunnerWebGPU.prototype.initializeMetaBuffers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.descriptor)
                            throw Error("GraphDescriptor is not loaded.");
                        _a = this;
                        return [4 /*yield*/, Promise.all(this.descriptor.exec_infos.map(function (executionInfo) { return __awaiter(_this, void 0, void 0, function () {
                                var buffer;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            buffer = new BufferWebGPU(executionInfo.meta_buffer.length * Int32Array.BYTES_PER_ELEMENT);
                                            return [4 /*yield*/, buffer.write(new Uint8Array(executionInfo.meta_buffer))];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, buffer];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.metaBuffers = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initialize dynamic buffers, whose size and position cannot be determined without runtime-information such as input image size
     * (if it's dynamic).
     * When all placeholder is resolved, this method is automatically called.
     *
     * @returns {Promise<void>}
     */
    DescriptorRunnerWebGPU.prototype.initializeDynamicBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var descriptor, placeholderContext, dynamicBufferSize, dynamicBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.descriptor)
                            throw Error("GraphDescriptor is not loaded.");
                        if (!this.placeholderContext)
                            throw Error("PlaceholderContext is not initialized.");
                        descriptor = this.descriptor;
                        placeholderContext = this.placeholderContext;
                        dynamicBufferSize = placeholderContext.resolve(descriptor.memory_layout.dynamic.size);
                        dynamicBuffer = new BufferWebGPU(dynamicBufferSize * Float32Array.BYTES_PER_ELEMENT);
                        this.dynamicBuffer = dynamicBuffer;
                        return [4 /*yield*/, this.getInputViews()];
                    case 1:
                        (_a.sent())
                            .filter(function (view) { return view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(dynamicBuffer.bufferView.buffer); });
                        return [4 /*yield*/, this.getOutputViews()];
                    case 2:
                        (_a.sent())
                            .filter(function (view) { return view.isDynamic; })
                            .forEach(function (view) { return view.setArrayBuffer(dynamicBuffer.bufferView.buffer); });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set actual value into placeholder. If all placeholder is resolved,
     * [[DescriptorRunnerWebGPU#initializeDynamicBuffer|`initializeDynamicBuffer()`]] is automatically called.
     *
     * @param values mapping object of placeholder name and value
     * @returns {Promise<void>}
     */
    DescriptorRunnerWebGPU.prototype.setPlaceholderValue = function (values) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var placeholderContext, descriptor, metaBuffers, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.placeholderContext)
                            throw new Error('PlaceholderContext is not initialized.');
                        placeholderContext = this.placeholderContext;
                        placeholderContext.update(values);
                        if (!placeholderContext.isResolved)
                            return [2 /*return*/];
                        if (!this.descriptor)
                            throw new Error('Descriptor is not loaded');
                        if (!this.metaBuffers)
                            throw new Error('MetaBuffers are not initialized');
                        descriptor = this.descriptor;
                        metaBuffers = this.metaBuffers;
                        return [4 /*yield*/, this.initializeDynamicBuffer()];
                    case 1:
                        _b.sent();
                        // resolve placeholders in execution info
                        _a = this;
                        return [4 /*yield*/, Promise.all(descriptor.exec_infos.map(function (executionInfo, i) { return __awaiter(_this, void 0, void 0, function () {
                                var bufferView, _i, _a, unresolved_value;
                                return __generator(this, function (_b) {
                                    bufferView = new Int32Array(metaBuffers[i].bufferView.buffer);
                                    for (_i = 0, _a = executionInfo.unresolved_value_list; _i < _a.length; _i++) {
                                        unresolved_value = _a[_i];
                                        bufferView[unresolved_value.offset] = placeholderContext.resolve(unresolved_value.placeholder);
                                    }
                                    return [2 /*return*/, placeholderContext.resolve(executionInfo)];
                                });
                            }); }))];
                    case 2:
                        // resolve placeholders in execution info
                        _a.executionInfos = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get input [[webdnn.SymbolicFloat32Array|`SymbolicFloat32Array`]] object
     *
     * @returns array of input [[webdnn.SymbolicFloat32Array|`SymbolicFloat32Array`]]
     */
    DescriptorRunnerWebGPU.prototype.getInputViews = function () {
        if (this.inputViews)
            return this.inputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        var descriptor = this.descriptor;
        var placeholderContext = this.placeholderContext;
        this.inputViews = descriptor.inputs.map(function (name) {
            var allocation = descriptor.memory_layout.static.allocations[name] || descriptor.memory_layout.dynamic.allocations[name];
            var view = new SymbolicFloat32Array(allocation, placeholderContext);
            return view;
        });
        return this.inputViews;
    };
    /**
     * Get output [[webdnn.SymbolicFloat32Array|`SymbolicFloat32Array`]] object
     *
     * @returns array of output [[webdnn.SymbolicFloat32Array|`SymbolicFloat32Array`]]
     */
    DescriptorRunnerWebGPU.prototype.getOutputViews = function () {
        if (this.outputViews)
            return this.outputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        var descriptor = this.descriptor;
        var placeholderContext = this.placeholderContext;
        this.outputViews = descriptor.outputs.map(function (name) {
            var allocation = descriptor.memory_layout.static.allocations[name] || descriptor.memory_layout.dynamic.allocations[name];
            var view = new SymbolicFloat32Array(allocation, placeholderContext);
            return view;
        });
        return this.outputViews;
    };
    /**
     * Run descriptor. You must call [[webdnn.DescriptorRunner.getInputViews|`getInputViews`]] and
     * [[webdnn.DescriptorRunner.getOutputViews|`getOutputViews`]] before calling this function.
     */
    DescriptorRunnerWebGPU.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var staticBuffer, dynamicBuffer, metaBuffers, records, totalElapsedTime_1, i, exec_info, start, elapsedTime, summary, complete_promise, i, exec_info, is_last;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.executionInfos)
                            throw new Error('ExecutionInfos is not loaded');
                        if (!this.inputViews || !this.outputViews)
                            throw new Error('getInputViews and getOutputViews must be called prior to run');
                        if (!this.staticBuffer)
                            throw new Error('StaticBuffer is not initialized');
                        if (!this.dynamicBuffer)
                            throw new Error('DynamicBuffer is not initialized');
                        if (!this.metaBuffers)
                            throw new Error('MetaBuffer is not initialized');
                        if (!this.placeholderContext)
                            throw new Error('PlaceholderContext is not initialized');
                        if (!this.placeholderContext.isResolved)
                            throw new Error("Not all placeholders are resolved: " + this.placeholderContext);
                        staticBuffer = this.staticBuffer;
                        dynamicBuffer = this.dynamicBuffer;
                        metaBuffers = this.metaBuffers;
                        if (!getConfiguration('DEBUG', false)) return [3 /*break*/, 5];
                        records = [];
                        totalElapsedTime_1 = 0;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.executionInfos.length)) return [3 /*break*/, 4];
                        exec_info = this.executionInfos[i];
                        start = performance.now();
                        return [4 /*yield*/, this.webgpuHandler.executeSinglePipelineState('descriptor.' + exec_info.entry_func_name, exec_info.threadgroups_per_grid, exec_info.threads_per_thread_group, [staticBuffer, dynamicBuffer, metaBuffers[i]], true)];
                    case 2:
                        _a.sent();
                        elapsedTime = performance.now() - start;
                        records.push({
                            'Kernel': exec_info.entry_func_name,
                            'Elapsed time [ms]': elapsedTime
                        });
                        totalElapsedTime_1 += elapsedTime;
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        summary = Array.from(Object.values(records.reduce(function (summary, record) {
                            if (!(record['Kernel'] in summary)) {
                                summary[record['Kernel']] = {
                                    'Kernel': record['Kernel'],
                                    'Count': 0,
                                    'Elapsed time [ms]': 0,
                                };
                            }
                            summary[record['Kernel']]['Count']++;
                            summary[record['Kernel']]['Elapsed time [ms]'] += record['Elapsed time [ms]'];
                            return summary;
                        }, {})));
                        summary.forEach(function (record) { return record['Ratio [%]'] = (record['Elapsed time [ms]'] / totalElapsedTime_1).toFixed(2); });
                        console.table(records);
                        console.table(summary);
                        return [3 /*break*/, 6];
                    case 5:
                        complete_promise = null;
                        for (i = 0; i < this.executionInfos.length; i++) {
                            exec_info = this.executionInfos[i];
                            is_last = i == this.executionInfos.length - 1;
                            complete_promise = this.webgpuHandler.executeSinglePipelineState('descriptor.' + exec_info.entry_func_name, exec_info.threadgroups_per_grid, exec_info.threads_per_thread_group, [staticBuffer, dynamicBuffer, metaBuffers[i]], is_last);
                        }
                        return [2 /*return*/, complete_promise]; //wait to finish final kernel
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return DescriptorRunnerWebGPU;
}(DescriptorRunner));

/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
/**
 * The data order
 */
var Order;
(function (Order) {
    /** `[Channel, Height, Width]` format */
    Order[Order["CHW"] = 0] = "CHW";
    /** `[Height, Width, Channel]` format */
    Order[Order["HWC"] = 1] = "HWC";
})(Order || (Order = {}));
/**
 * The color format
 */
var Color;
(function (Color) {
    /** RGB format */
    Color[Color["RGB"] = 0] = "RGB";
    /** BGR format */
    Color[Color["BGR"] = 1] = "BGR";
    /** grey scale */
    Color[Color["GREY"] = 2] = "GREY";
})(Color || (Color = {}));

/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
/**
 * Get canvas rendering context and check whether it is nonnull value.
 *
 * @param {CanvasRenderingContext2D} canvas
 * @protected
 */
function getContext2D(canvas) {
    var context = canvas.getContext('2d');
    if (!context)
        throw Error('CanvasRenderingContext2D initialization failed');
    return context;
}

/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
/**
 * @protected
 */
function getImageDataFromCanvas(canvas, options) {
    if (options === void 0) { options = {}; }
    var _a = options.srcX, srcX = _a === void 0 ? 0 : _a, _b = options.srcY, srcY = _b === void 0 ? 0 : _b, _c = options.srcW, srcW = _c === void 0 ? canvas.width : _c, _d = options.srcH, srcH = _d === void 0 ? canvas.height : _d, _e = options.dstX, dstX = _e === void 0 ? 0 : _e, _f = options.dstY, dstY = _f === void 0 ? 0 : _f;
    var _g = options.dstW, dstW = _g === void 0 ? srcW : _g, _h = options.dstH, dstH = _h === void 0 ? srcH : _h;
    var imageData = getContext2D(canvas).getImageData(srcX, srcY, srcW, srcH);
    if (dstX !== 0 || dstY !== 0 || srcW !== dstW || srcH !== dstH) {
        imageData = cropAndResizeImageData(imageData, { dstX: dstX, dstY: dstY, dstW: dstW, dstH: dstH });
    }
    return imageData;
}
/**
 * @protected
 */
function getImageDataFromDrawable(drawable, options) {
    if (options === void 0) { options = {}; }
    var srcW, srcH;
    if (drawable instanceof HTMLVideoElement) {
        srcW = drawable.videoWidth;
        srcH = drawable.videoHeight;
    }
    else if (drawable instanceof HTMLImageElement) {
        srcW = drawable.naturalWidth;
        srcH = drawable.naturalHeight;
    }
    else
        throw TypeError('Failed to execute "getImageDataFromDrawable(drawable, options)": "drawable" must be an instanceof HTMLVideoElement or HTMLImageElement');
    var _a = options.srcX, srcX = _a === void 0 ? 0 : _a, _b = options.srcY, srcY = _b === void 0 ? 0 : _b, _c = options.dstX, dstX = _c === void 0 ? 0 : _c, _d = options.dstY, dstY = _d === void 0 ? 0 : _d, _e = options.dstW, dstW = _e === void 0 ? srcW : _e, _f = options.dstH, dstH = _f === void 0 ? srcH : _f;
    var canvas = document.createElement('canvas');
    canvas.width = dstX + dstW;
    canvas.height = dstY + dstH;
    var context = getContext2D(canvas);
    context.drawImage(drawable, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    return context.getImageData(0, 0, dstX + dstW, dstY + dstH);
}
/**
 * Source rectangle of source image is cropped and then copied into destination rectangle of new image data
 *
 * @param {ImageData} src
 * @param {SourceRect & DestinationRect} options
 * @returns {ImageData}
 * @protected
 */
function cropAndResizeImageData(src, options) {
    if (options === void 0) { options = {}; }
    var _a = options.srcX, srcX = _a === void 0 ? 0 : _a, _b = options.srcY, srcY = _b === void 0 ? 0 : _b, _c = options.srcW, srcW = _c === void 0 ? src.width : _c, _d = options.srcH, srcH = _d === void 0 ? src.height : _d, _e = options.dstX, dstX = _e === void 0 ? 0 : _e, _f = options.dstY, dstY = _f === void 0 ? 0 : _f;
    var _g = options.dstW, dstW = _g === void 0 ? srcW : _g, _h = options.dstH, dstH = _h === void 0 ? srcH : _h;
    var canvas1 = document.createElement('canvas');
    canvas1.width = srcW;
    canvas1.height = srcH;
    var context1 = getContext2D(canvas1);
    context1.putImageData(src, -srcX, -srcY);
    var canvas2 = document.createElement('canvas');
    canvas2.width = dstX + dstW;
    canvas2.height = dstY + dstH;
    var context2 = getContext2D(canvas2);
    context2.drawImage(canvas1, 0, 0, srcW, srcH, dstX, dstY, dstW, dstH);
    return context2.getImageData(0, 0, dstX + dstW, dstY + dstH);
}
/**
 * Return canvas `ImageData` object with specified scale.
 *
 * @param {HTMLCanvasElement | HTMLVideoElement | HTMLImageElement} image
 * @param [options] Options
 * @param {number} [options.srcX=0] left position of input clipping rect
 * @param {number} [options.srcY=0] top position of input clipping rect
 * @param {number} [options.srcW=canvas.width] width of input clipping rect
 * @param {number} [options.srcH=canvas.height] height of input clipping rect
 * @param {number} [options.dstW=options.srcW] width of output
 * @param {number} [options.dstH=options.srcH] height of output
 * @returns {ImageData}
 * @protected
 */
function getImageData(image, options) {
    if (options === void 0) { options = {}; }
    if (image instanceof HTMLCanvasElement) {
        return getImageDataFromCanvas(image, options);
    }
    else if (image instanceof HTMLVideoElement || image instanceof HTMLImageElement) {
        return getImageDataFromDrawable(image, options);
    }
    else
        throw TypeError('Failed to execute "getImageData(image, options)": "image" must be an instance of HTMLCanvasElement, HTMLVideoElement, or HTMLImageElement');
}
/**
 * @protected
 */
function setImageDataToCanvas(imageData, canvas, options) {
    if (options === void 0) { options = {}; }
    var _a = options.srcX, srcX = _a === void 0 ? 0 : _a, _b = options.srcY, srcY = _b === void 0 ? 0 : _b, _c = options.srcW, srcW = _c === void 0 ? imageData.width : _c, _d = options.srcH, srcH = _d === void 0 ? imageData.height : _d, _e = options.dstX, dstX = _e === void 0 ? 0 : _e, _f = options.dstY, dstY = _f === void 0 ? 0 : _f;
    var _g = options.dstW, dstW = _g === void 0 ? srcW : _g, _h = options.dstH, dstH = _h === void 0 ? srcH : _h;
    if (srcX !== 0 || srcY !== 0 || srcW !== dstW || srcH !== dstH) {
        imageData = cropAndResizeImageData(imageData, { srcX: srcX, srcY: srcY, srcW: srcW, srcH: srcH, dstW: dstW, dstH: dstH });
    }
    getContext2D(canvas).putImageData(imageData, dstX, dstY);
}

/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
/**
 * Load image of specified url
 *
 * @param {string} url the image url
 * @returns {Promise<HTMLImageElement>} image element
 */
function loadImageByUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var image;
        return __generator(this, function (_a) {
            image = document.createElement('img');
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    image.onload = resolve;
                    image.onerror = reject;
                    image.src = url;
                })
                    .then(function () { return image; })];
        });
    });
}
/* istanbul ignore next */
/**
 * Load image file selected in `<input type="file">` element.
 *
 * @param {HTMLInputElement} input the `<input type="file">` element
 * @returns {Promise<HTMLImageElement>} image element
 */
function loadImageFromFileInput(input) {
    return __awaiter(this, void 0, void 0, function () {
        var files, url;
        return __generator(this, function (_a) {
            files = input.files;
            if (!files || files.length == 0)
                throw new Error('No file is selected');
            url = URL.createObjectURL(files[0]);
            return [2 /*return*/, loadImageByUrl(url)];
        });
    });
}
/* istanbul ignore next */
/**
 * Load image selected in file picker dialog
 *
 * Currently, web specification not supported the case if the dialog is canceled and no file is selected. In this case,
 * the returned promise will never be resolved.
 *
 * @returns {Promise<HTMLImageElement>} image element
 * @protected
 */
function loadImageByDialog() {
    return __awaiter(this, void 0, void 0, function () {
        var input;
        return __generator(this, function (_a) {
            input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            return [2 /*return*/, new Promise(function (resolve) {
                    input.onchange = function () { return resolve(loadImageFromFileInput(input)); };
                    input.click();
                })];
        });
    });
}

/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
/**
 * @protected
 */
function flatten$1(arr) {
    return (arr instanceof Array) ? Array.prototype.concat.apply([], arr.map(function (arr) { return flatten$1(arr); })) : arr;
}
/**
 * @protected
 */
function normalizeBiasTuple(arr) {
    if (typeof (arr) == "number") {
        return [arr, arr, arr];
    }
    else {
        if (arr.length == 3) {
            return [arr[0], arr[1], arr[2]];
        }
        else if (arr.length == 1) {
            return [arr[0], arr[0], arr[0]];
        }
        else {
            throw new Error('bias and scale must be scalar number or array of length 1 or 3.');
        }
    }
}
/**
 * Get image array as `{Float32 or Int32}ArrayBufferView` from ImageData object.
 *
 * @returns {ArrayBufferView} buffer with specified type
 * @protected
 */
function getImageArrayFromImageData(imageData, options) {
    if (options === void 0) { options = {}; }
    var _a = options.type, type = _a === void 0 ? Float32Array : _a, _b = options.color, color = _b === void 0 ? Color.RGB : _b, _c = options.order, order = _c === void 0 ? Order.HWC : _c, _d = options.bias, bias = _d === void 0 ? [0, 0, 0] : _d, _e = options.scale, scale = _e === void 0 ? [1, 1, 1] : _e;
    var bias_n = normalizeBiasTuple(bias);
    var scale_n = normalizeBiasTuple(scale);
    var width = imageData.width;
    var height = imageData.height;
    var data = imageData.data;
    var array;
    var biasR, biasG, biasB;
    var scaleR, scaleG, scaleB;
    switch (color) {
        case Color.RGB:
            array = new type(width * height * 3);
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2];
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2];
            switch (order) {
                case Order.HWC:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(h * width + w) * 3 + 0] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(h * width + w) * 3 + 1] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(h * width + w) * 3 + 2] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                        }
                    }
                    break;
                case Order.CHW:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(0 * height + h) * width + w] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(1 * height + h) * width + w] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(2 * height + h) * width + w] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                        }
                    }
                    break;
            }
            break;
        case Color.BGR:
            array = new type(width * height * 3);
            biasB = bias_n[0], biasG = bias_n[1], biasR = bias_n[2];
            scaleB = scale_n[0], scaleG = scale_n[1], scaleR = scale_n[2];
            switch (order) {
                case Order.HWC:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(h * width + w) * 3 + 0] = (data[(h * width + w) * 4 + 2] - biasR) / scaleR;
                            array[(h * width + w) * 3 + 1] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(h * width + w) * 3 + 2] = (data[(h * width + w) * 4 + 0] - biasB) / scaleB;
                        }
                    }
                    break;
                case Order.CHW:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(0 * height + h) * width + w] = (data[(h * width + w) * 4 + 2] - biasR) / scaleR;
                            array[(1 * height + h) * width + w] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(2 * height + h) * width + w] = (data[(h * width + w) * 4 + 0] - biasB) / scaleB;
                        }
                    }
                    break;
            }
            break;
        case Color.GREY:
            array = new type(width * height);
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2];
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2];
            for (var h = 0; h < height; h++) {
                for (var w = 0; w < width; w++) {
                    var r = data[(h * width + w) * 4 + 0];
                    var g = data[(h * width + w) * 4 + 1];
                    var b = data[(h * width + w) * 4 + 2];
                    array[h * width + w] = 0.2126 * (r - biasR) / scaleR + 0.7162 * (g - biasG) / scaleG + 0.0722 * (b - biasB) / scaleB;
                }
            }
            break;
        default:
            throw Error("Unknown color format: " + color);
    }
    return array;
}
/**
 * Get image array from canvas element as `{Float32 or Int32}ArrayBufferView`.
 *
 * @returns {ImageData} buffer with specified type
 * @protected
 */
function getImageArrayFromCanvas(canvas, options) {
    if (options === void 0) { options = {}; }
    var _a = options.type, type = _a === void 0 ? Float32Array : _a, _b = options.color, color = _b === void 0 ? Color.RGB : _b, _c = options.order, order = _c === void 0 ? Order.HWC : _c, _d = options.srcX, srcX = _d === void 0 ? 0 : _d, _e = options.srcY, srcY = _e === void 0 ? 0 : _e, _f = options.srcW, srcW = _f === void 0 ? canvas.width : _f, _g = options.srcH, srcH = _g === void 0 ? canvas.height : _g, _h = options.dstX, dstX = _h === void 0 ? 0 : _h, _j = options.dstY, dstY = _j === void 0 ? 0 : _j, _k = options.bias, bias = _k === void 0 ? [0, 0, 0] : _k, _l = options.scale, scale = _l === void 0 ? [1, 1, 1] : _l;
    var _m = options.dstW, dstW = _m === void 0 ? srcW : _m, _o = options.dstH, dstH = _o === void 0 ? srcH : _o;
    var imageData = getImageData(canvas, { srcX: srcX, srcY: srcY, srcW: srcW, srcH: srcH, dstX: dstX, dstY: dstY, dstW: dstW, dstH: dstH });
    return getImageArrayFromImageData(imageData, { type: type, color: color, order: order, bias: bias, scale: scale });
}
/**
 * Get image array from image element as `{Float32 or Int32}ArrayBufferView`.
 *
 * @returns {ImageData} buffer with specified type
 * @protected
 */
function getImageArrayFromDrawable(drawable, options) {
    if (options === void 0) { options = {}; }
    var srcW, srcH;
    if (drawable instanceof HTMLVideoElement) {
        srcW = drawable.videoWidth;
        srcH = drawable.videoHeight;
    }
    else if (drawable instanceof HTMLImageElement) {
        srcW = drawable.naturalWidth;
        srcH = drawable.naturalHeight;
    }
    else if (drawable instanceof HTMLCanvasElement) {
        return getImageArrayFromCanvas(drawable, options);
    }
    else if (drawable instanceof ImageData) {
        return getImageArrayFromImageData(drawable, options);
    }
    else
        throw TypeError('Failed to execute "getImageDataFromDrawable(drawable, options)": "drawable" must be an instanceof Drawable');
    var _a = options.type, type = _a === void 0 ? Float32Array : _a, _b = options.color, color = _b === void 0 ? Color.RGB : _b, _c = options.order, order = _c === void 0 ? Order.HWC : _c, _d = options.srcX, srcX = _d === void 0 ? 0 : _d, _e = options.srcY, srcY = _e === void 0 ? 0 : _e, _f = options.dstX, dstX = _f === void 0 ? 0 : _f, _g = options.dstY, dstY = _g === void 0 ? 0 : _g, _h = options.dstW, dstW = _h === void 0 ? srcW : _h, _j = options.dstH, dstH = _j === void 0 ? srcH : _j, _k = options.bias, bias = _k === void 0 ? [0, 0, 0] : _k, _l = options.scale, scale = _l === void 0 ? [1, 1, 1] : _l;
    var canvas = document.createElement('canvas');
    canvas.width = dstX + dstW;
    canvas.height = dstY + dstH;
    var context = getContext2D(canvas);
    context.drawImage(drawable, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    return getImageArrayFromCanvas(canvas, { type: type, color: color, order: order, bias: bias, scale: scale });
}
/**
 * Create typed array by packing image data from image source with specified options.
 *
 * First, this method loads specified image resource. The behavior of this method depends on the `image` argument.
 *
 * - If `image` is an instance of `string`, it will be regarded as image url, and this method fetches that url.
 *
 * - If `image` is an instance of `HTMLInputElement`, it will be regarded as file inpu,
 *   and this method loads the selected image file.
 *
 * - Otherwise, `image` will be regarded as drawable object.
 *
 * Then, loaded images are packed into typed array based on `options` argument.
 *
 * - The image is cropped based on [[SourceRect|`{srcX, srcY, srcW, srcH}`]].
 *   As default, entire image is used.
 *
 * - The image is resized and translated into [[DestinationRect|`{dstX, dstY, dstW, dstH}`]].
 *   As default, no resize and translation is performed.
 *
 * - [[ImageArrayOption.type|`options.type`]] is the type of packed typed array. As default, Float32Array is used.
 *
 * - [[ImageArrayOption.type|`options.color`]] is the color format of packed typed array. As default, [[Color.RGB|`RGB`]] is used.
 *
 * - [[ImageArrayOption.type|`options.order`]] is the data order of packed typed array. As default, [[Order.HWC|`HWC`]] is used.
 *
 * - [[ImageArrayOption.bias|`options.bias`]] is the bias value.
 *   If specified, this method **subtracts** this value from original pixel value.
 *
 * - [[ImageArrayOption.scale|`options.scale`]] is the scale value. If specified, original pixel values are **divided** by this value.
 *   [[ImageArrayOption.scale|`options.scale`]] and [[ImageArrayOption.bias|`options.bias`]] is used for converting pixel value `x` and
 *   packed value `y` as follows:
 *
 *   - `y = (x - bias) / scale`
 *   - `x = y * scale + bias`
 *
 * ### Examples
 *
 * - Load image of specified url
 *
 *   ```ts
 *   let image = await WebDNN.Image.load('./cat.png');
 *   ```
 *
 * - Load image selected in file input and resize it into 224 x 224
 *
 *   ```ts
 *   let input = document.querySelector('input[type=file]');
 *   let image = await WebDNN.Image.load(input, { dstW: 224, dstH: 224 });
 *   ```
 *
 * - Load image data from canvas, normalize it into range `[-1, 1)`. In this case, normalized value `y` can be
 *   calculated from pixel value `x` as follows: `y = (x - 128) / 128`.
 *
 *   ```ts
 *   let canvas = document.getElementsByTagName('canvas')[0];
 *   let image = await WebDNN.Image.load(canvas, { bias: [128, 128, 128], scale: [128, 128, 128] });
 *   ```
 *
 * @param image please see above descriptions
 * @param options please see above descriptions.
 * @returns Created typed array
 */
function getImageArray(image, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(typeof image === 'string')) return [3 /*break*/, 2];
                    _a = getImageArrayFromDrawable;
                    return [4 /*yield*/, loadImageByUrl(image)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_c.sent(), options])];
                case 2:
                    if (!(image instanceof HTMLInputElement)) return [3 /*break*/, 4];
                    _b = getImageArrayFromDrawable;
                    return [4 /*yield*/, loadImageFromFileInput(image)];
                case 3: return [2 /*return*/, _b.apply(void 0, [_c.sent(), options])];
                case 4:
                    if (image instanceof HTMLCanvasElement) {
                        return [2 /*return*/, getImageArrayFromCanvas(image, options)];
                    }
                    else if (image instanceof HTMLImageElement || image instanceof HTMLVideoElement) {
                        return [2 /*return*/, getImageArrayFromDrawable(image, options)];
                        // FIXME: This feature is not supported for all web browsers.
                        // } else if (image === null) {
                        //     return getImageArrayFromDrawable(await loadImageByDialog(), options);
                    }
                    else
                        throw TypeError('Failed to execute "getImageData(image, options)": "image" must be an instance of string,' +
                            ' HTMLInputElement, HTMLCanvasElement, HTMLImageElement, or HTMLVideoElement object');
                    _c.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Set image array data into canvas.
 *
 * ### Examples
 *
 * - Show DNN model's result
 *
 *   ```ts
 *   let runner = await WebDNN.load('./model');
 *   let output = runner.getOutputViews()[0];
 *
 *   await runner.run();
 *
 *   WebDNN.Image.setImageArrayToCanvas(output.toActual(), 256, 256, document.getElementById('canvas'))
 *   ```
 *
 * - Generally image generation model's result contains noise pixel at their edge because of convolution's padding.
 *   In follow example, these noise are cut off.
 *
 *   ```ts
 *   WebDNN.Image.setImageArrayToCanvas(output, 256, 256, canvas, {
 *      srcX: 16, srcY: 16, srcH: 256-16*2, srcW: 256-16*2, // Discard both ends 16px
 *      dstW: 256, dstH: 256  // Resize cropped image into original output size.
 *   });
 *   ```
 *
 * @param array array which contains image data
 * @param imageW width of image
 * @param imageH height of image. The length of `array` must be `imageW * imageH * (# of channels)`
 * @param canvas destination canvas
 * @param options please see above descriptions and descriptions in [[webdnn/image.getImageArray|getImageArray()]].
 *                `srcW` and `srcH` is ignored (overwritten by `imageW` and `imageH`).
 */
function setImageArrayToCanvas(array, imageW, imageH, canvas, options) {
    if (options === void 0) { options = {}; }
    var _a = options.color, color = _a === void 0 ? Color.RGB : _a, _b = options.order, order = _b === void 0 ? Order.HWC : _b, _c = options.srcX, srcX = _c === void 0 ? 0 : _c, _d = options.srcY, srcY = _d === void 0 ? 0 : _d, _e = options.dstX, dstX = _e === void 0 ? 0 : _e, _f = options.dstY, dstY = _f === void 0 ? 0 : _f, _g = options.dstW, dstW = _g === void 0 ? canvas.width : _g, _h = options.dstH, dstH = _h === void 0 ? canvas.height : _h, _j = options.bias, bias = _j === void 0 ? [0, 0, 0] : _j, _k = options.scale, scale = _k === void 0 ? [1, 1, 1] : _k;
    var bias_n = normalizeBiasTuple(bias);
    var scale_n = normalizeBiasTuple(scale);
    var srcW = imageW, srcH = imageH;
    array = flatten$1(array);
    var data = new Uint8ClampedArray(srcW * srcH * 4);
    var biasR, biasG, biasB;
    var scaleR, scaleG, scaleB;
    switch (color) {
        case Color.RGB:
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2];
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2];
            switch (order) {
                case Order.HWC:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(h * imageW + w) * 3 + 0] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(h * imageW + w) * 3 + 1] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(h * imageW + w) * 3 + 2] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
                case Order.CHW:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(0 * imageH + h) * imageW + w] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(1 * imageH + h) * imageW + w] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(2 * imageH + h) * imageW + w] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
            }
            break;
        case Color.BGR:
            biasB = bias_n[0], biasG = bias_n[1], biasR = bias_n[2];
            scaleB = scale_n[0], scaleG = scale_n[1], scaleR = scale_n[2];
            switch (order) {
                case Order.HWC:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(h * imageW + w) * 3 + 2] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(h * imageW + w) * 3 + 1] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(h * imageW + w) * 3 + 0] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
                case Order.CHW:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(2 * imageH + h) * imageW + w] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(1 * imageH + h) * imageW + w] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(0 * imageH + h) * imageW + w] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
            }
            break;
        case Color.GREY:
            for (var h = srcY; h < srcY + srcH; h++) {
                for (var w = srcX; w < srcX + srcW; w++) {
                    data[(h * imageW + w) * 4 + 0] =
                        data[(h * imageW + w) * 4 + 1] =
                            data[(h * imageW + w) * 4 + 2] = array[h * imageW + w] * scale[0] + bias[0];
                    data[(h * imageW + w) * 4 + 3] = 255;
                }
            }
            break;
    }
    setImageDataToCanvas(new ImageData(data, srcW, srcH), canvas, { srcX: srcX, srcY: srcY, srcW: srcW, srcH: srcH, dstX: dstX, dstY: dstY, dstW: dstW, dstH: dstH });
}

/**
 * @module webdnn/image
 * @preferred
 *
 * Module `WebDNN.Image` provides basic image processing operations like follows.
 *
 * - Load image by various way (File picker dialog, url string, canvas, video, etc.)
 * - Pack image data into TypedArray
 * - Crop and resize.
 * - Show result on canvas element
 *
 */
/** Don't Remove This comment block */
// export * from "./image/canvas" // internal API



var image = Object.freeze({
	get Order () { return Order; },
	get Color () { return Color; },
	getImageArrayFromImageData: getImageArrayFromImageData,
	getImageArrayFromCanvas: getImageArrayFromCanvas,
	getImageArrayFromDrawable: getImageArrayFromDrawable,
	getImageArray: getImageArray,
	setImageArrayToCanvas: setImageArrayToCanvas,
	loadImageByUrl: loadImageByUrl,
	loadImageFromFileInput: loadImageFromFileInput,
	loadImageByDialog: loadImageByDialog
});

/**
 * @module webdnn/math
 */
/** Don't Remove This comment block */
/**
* Return indices of the top-K largest elements.
* This implementation is not stable sort.
*
* @param {number[]|Float32Array|Int32Array} arr array
* @param {number} k number of indices
* @returns {number[]} indices of top-K largest samples
*/
function argmax(arr, k) {
    // Top-k Quicksort
    if (k === void 0) { k = 1; }
    arr = arr.slice();
    var stack = [[0, arr.length]];
    var workspace = [];
    for (var i = 0; i < arr.length; i++)
        workspace[i] = i;
    while (stack.length > 0) {
        var _a = stack.pop(), from = _a[0], to = _a[1], pivot = arr[to - 1], left = from, right = to - 2, tmp = void 0;
        if (from >= to - 1)
            continue;
        while (true) {
            while (arr[left] > pivot && left <= right)
                left++;
            while (arr[right] <= pivot && left <= right)
                right--;
            if (left >= right)
                break;
            tmp = arr[left];
            arr[left] = arr[right];
            arr[right] = tmp;
            tmp = workspace[left];
            workspace[left] = workspace[right];
            workspace[right] = tmp;
        }
        arr[to - 1] = arr[left];
        arr[left] = pivot;
        tmp = workspace[to - 1];
        workspace[to - 1] = workspace[left];
        workspace[left] = tmp;
        // If partial segment contains top-K elements, append it into stack
        stack.push([from, left]); // left (=larger) segment always contains top-K elements
        if (left + 1 < k)
            stack.push([left + 1, to]);
    }
    var result = [];
    for (var i = 0; i < k; i++)
        result.push(workspace[i]);
    return result;
}
/**
 * Return indices of the top-K smallest elements.
 * This implementation is not stable sort.
 *
 * @param {number[]|Float32Array|Int32Array} arr array
 * @param {number} k number of indices
 * @returns {number[]} indices of top-K smallest samples
 */
function argmin(arr, k) {
    // Top-k Quicksort
    if (k === void 0) { k = 1; }
    arr = arr.slice();
    var stack = [[0, arr.length]];
    var workspace = [];
    for (var i = 0; i < arr.length; i++)
        workspace[i] = i;
    while (stack.length > 0) {
        var _a = stack.pop(), from = _a[0], to = _a[1], pivot = arr[to - 1], left = from, right = to - 2, tmp = void 0;
        if (from >= to - 1)
            continue;
        while (true) {
            while (arr[left] < pivot && left <= right)
                left++;
            while (arr[right] >= pivot && left <= right)
                right--;
            if (left >= right)
                break;
            tmp = arr[left];
            arr[left] = arr[right];
            arr[right] = tmp;
            tmp = workspace[left];
            workspace[left] = workspace[right];
            workspace[right] = tmp;
        }
        arr[to - 1] = arr[left];
        arr[left] = pivot;
        tmp = workspace[to - 1];
        workspace[to - 1] = workspace[left];
        workspace[left] = tmp;
        // If partial segment contains top-K elements, append it into stack
        stack.push([from, left]); // left (=larger) segment always contains top-K elements
        if (left + 1 < k)
            stack.push([left + 1, to]);
    }
    var result = [];
    for (var i = 0; i < k; i++)
        result.push(workspace[i]);
    return result;
}

/**
 * @module webdnn/math
 * @preferred
 *
 * Module `WebDNN.Math` provides basic mathematics operations for pre/post-processing.
 */
/** Don't Remove This comment block */



var math = Object.freeze({
	argmax: argmax,
	argmin: argmin
});

/**
 * DEBUG flag for developing WebDNN
 * @private
 */
var configurations = {};
/**
 * get configuration
 * @private
 */
function getConfiguration(key, defaultValue) {
    return key in configurations ? configurations[key] : defaultValue;
}
/**
 * set configuration
 * @private
 */
function setConfiguration(key, value) {
    configurations[key] = value;
}
/**
 * Backend constructor map
 * @private
 */
var descriptorRunners = {
    webgpu: DescriptorRunnerWebGPU,
    webgl: DescriptorRunnerWebGL,
    webassembly: DescriptorRunnerWebassembly,
    fallback: DescriptorRunnerFallback
};
/**
 * Check each computing backend is available or not in this browser.
 * The result will be returned as [[BackendAvailability|`BackendAvailability`]] structure.
 *
 * @returns backend availability
 */
function getBackendAvailability() {
    var status = {
        'webgpu': descriptorRunners['webgpu'].checkAvailability(),
        'webgl': descriptorRunners['webgl'].checkAvailability(),
        'webassembly': descriptorRunners['webassembly'].checkAvailability(),
        'fallback': descriptorRunners['fallback'].checkAvailability(),
    };
    var order = ['webgpu', 'webgl', 'webassembly', 'fallback'].filter(function (backend) { return status[backend]; });
    return {
        status: status,
        defaultOrder: order
    };
}
/**
 * Initialize specified backend
 * @private
 */
function initBackend(backendName, option) {
    return __awaiter(this, void 0, void 0, function () {
        var runner, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(backendName in descriptorRunners))
                        throw new Error("Unknown backend: \"" + backendName + "\"");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    runner = new descriptorRunners[backendName](option);
                    return [4 /*yield*/, runner.init()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    console.warn("Failed to initialize " + backendName + " backend: " + ex_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/, runner];
            }
        });
    });
}
/**
 * Initialize descriptor runner. This function performs follow things.
 *
 * 1. Try to initialize computing backend. WebDNN will try to initialize each backend in order of
 *    the result of [[getBackendAvailability|`getBackendAvailability`]].
 *    If you want to modify this order, specify [[InitOption.backendOrder|`initOption.backendOrder`]] option.
 *
 * 2. Load model data based on initialized backend. Generally, DNN binary data is very large and it takes long time to load.
 *    [[InitOption.progressCallback|`initOption.progressCallback`]] option provides the progress status of loading.
 *
 * ### Examples
 *
 * - Basic usage
 *
 *   ```js
 *   let runner = await WebDNN.load('./model');
 *   ```
 *
 * - With `initOption.progressCallback` option
 *
 *   ```js
 *   let runner = await WebDNN.load('./model', {
 *       progressCallback: (loaded, total) => console.log(`${ (loaded/total*100).toFixed(1) }% Loaded`);
 *   });
 *   ```
 *
 * @param directory URL of directory that contains graph descriptor files (e.g. graph_webgpu.json)
 * @param initOption Initialize option
 * @return DescriptorRunner instance, which is the interface to input/output data and run the model.
 */
function load(directory, initOption) {
    if (initOption === void 0) { initOption = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, backendOrder, _b, backendOptions, _c, cacheStrategy, _d, saveCache, progressCallback, weightDirectory, transformUrlDelegate, backendName, runner, descriptor, parameters, fetchedDescriptor, cachedDescriptor, _e, e_1, ex_2;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = initOption.backendOrder, backendOrder = _a === void 0 ? null : _a, _b = initOption.backendOptions, backendOptions = _b === void 0 ? {} : _b, _c = initOption.cacheStrategy, cacheStrategy = _c === void 0 ? 'latest' : _c, _d = initOption.saveCache, saveCache = _d === void 0 ? true : _d, progressCallback = initOption.progressCallback, weightDirectory = initOption.weightDirectory, transformUrlDelegate = initOption.transformUrlDelegate;
                    if (!backendOrder)
                        backendOrder = getBackendAvailability().defaultOrder;
                    if (typeof backendOrder === 'string')
                        backendOrder = [backendOrder];
                    backendOrder = backendOrder.slice();
                    if (backendOrder.indexOf('fallback') === -1)
                        backendOrder.concat(['fallback']);
                    registerTransformUrlDelegate(function (url) {
                        if (weightDirectory) {
                            if ((/\.bin/).test(url)) {
                                url = url.replace(directory, weightDirectory);
                            }
                        }
                        if (transformUrlDelegate)
                            url = transformUrlDelegate(url);
                        return url;
                    });
                    _f.label = 1;
                case 1:
                    if (!(backendOrder.length > 0)) return [3 /*break*/, 36];
                    backendName = backendOrder.shift();
                    return [4 /*yield*/, initBackend(backendName, backendOptions[backendName])];
                case 2:
                    runner = _f.sent();
                    if (!runner)
                        return [3 /*break*/, 1];
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 34, , 35]);
                    descriptor = void 0;
                    parameters = void 0;
                    fetchedDescriptor = void 0;
                    cachedDescriptor = void 0;
                    _e = cacheStrategy;
                    switch (_e) {
                        case 'latest': return [3 /*break*/, 4];
                        case 'networkOnly': return [3 /*break*/, 13];
                        case 'networkFirst': return [3 /*break*/, 13];
                        case 'cacheOnly': return [3 /*break*/, 20];
                        case 'cacheFirst': return [3 /*break*/, 20];
                    }
                    return [3 /*break*/, 27];
                case 4: return [4 /*yield*/, runner.fetchDescriptor(directory).catch(function () { return null; })];
                case 5:
                    fetchedDescriptor = _f.sent();
                    return [4 /*yield*/, runner.restoreCachedDescriptor(directory)];
                case 6:
                    cachedDescriptor = _f.sent();
                    if (!(cachedDescriptor && fetchedDescriptor && cachedDescriptor.converted_at === fetchedDescriptor.converted_at)) return [3 /*break*/, 8];
                    descriptor = cachedDescriptor;
                    return [4 /*yield*/, runner.restoreCachedParameters(directory, progressCallback)];
                case 7:
                    parameters = _f.sent();
                    if (parameters)
                        return [3 /*break*/, 28];
                    _f.label = 8;
                case 8:
                    if (!fetchedDescriptor) return [3 /*break*/, 10];
                    descriptor = fetchedDescriptor;
                    return [4 /*yield*/, runner.fetchParameters(directory, progressCallback)];
                case 9:
                    parameters = _f.sent();
                    if (parameters)
                        return [3 /*break*/, 28];
                    _f.label = 10;
                case 10:
                    if (!cachedDescriptor) return [3 /*break*/, 12];
                    descriptor = cachedDescriptor;
                    return [4 /*yield*/, runner.restoreCachedParameters(directory, progressCallback)];
                case 11:
                    parameters = _f.sent();
                    if (parameters)
                        return [3 /*break*/, 28];
                    _f.label = 12;
                case 12: throw Error('Network error is occurred and no cache is exist.');
                case 13: return [4 /*yield*/, runner.fetchDescriptor(directory).catch(function () { return null; })];
                case 14:
                    fetchedDescriptor = _f.sent();
                    if (!fetchedDescriptor) return [3 /*break*/, 16];
                    descriptor = fetchedDescriptor;
                    return [4 /*yield*/, runner.fetchParameters(directory, progressCallback)];
                case 15:
                    parameters = _f.sent();
                    if (parameters)
                        return [3 /*break*/, 28];
                    _f.label = 16;
                case 16:
                    if (cacheStrategy === 'networkOnly')
                        throw Error('Network error is occurred in "networkOnly" cache strategy');
                    return [4 /*yield*/, runner.restoreCachedDescriptor(directory)];
                case 17:
                    cachedDescriptor = _f.sent();
                    if (!cachedDescriptor) return [3 /*break*/, 19];
                    descriptor = cachedDescriptor;
                    return [4 /*yield*/, runner.restoreCachedParameters(directory, progressCallback)];
                case 18:
                    parameters = _f.sent();
                    if (parameters)
                        return [3 /*break*/, 28];
                    _f.label = 19;
                case 19: throw Error('Network error is occurred and no cache is exist.');
                case 20: return [4 /*yield*/, runner.restoreCachedDescriptor(directory)];
                case 21:
                    cachedDescriptor = _f.sent();
                    if (!cachedDescriptor) return [3 /*break*/, 23];
                    descriptor = cachedDescriptor;
                    return [4 /*yield*/, runner.restoreCachedParameters(directory, progressCallback)];
                case 22:
                    parameters = _f.sent();
                    if (parameters)
                        return [3 /*break*/, 28];
                    _f.label = 23;
                case 23:
                    if (cacheStrategy === 'cacheOnly')
                        throw Error('No cache is exist in "cacheOnly" cache strategy');
                    return [4 /*yield*/, runner.fetchDescriptor(directory).catch(function () { return null; })];
                case 24:
                    fetchedDescriptor = _f.sent();
                    if (!fetchedDescriptor) return [3 /*break*/, 26];
                    descriptor = fetchedDescriptor;
                    return [4 /*yield*/, runner.fetchParameters(directory, progressCallback)];
                case 25:
                    parameters = _f.sent();
                    if (parameters)
                        return [3 /*break*/, 28];
                    _f.label = 26;
                case 26: throw Error('Network error is occurred and no cache is exist.');
                case 27: throw Error("\"" + cacheStrategy + "\" is not valid cache strategy name: \"latest\", \"networkFirst\", \"networkOnly\", \"cacheFirst\", \"cacheOnly\" is available.");
                case 28: return [4 /*yield*/, runner.setDescriptorAndParameters(descriptor, parameters)];
                case 29:
                    _f.sent();
                    if (!saveCache) return [3 /*break*/, 33];
                    _f.label = 30;
                case 30:
                    _f.trys.push([30, 32, , 33]);
                    return [4 /*yield*/, runner.saveCache(directory, descriptor, parameters)];
                case 31:
                    _f.sent();
                    return [3 /*break*/, 33];
                case 32:
                    e_1 = _f.sent();
                    return [3 /*break*/, 33];
                case 33: return [3 /*break*/, 35];
                case 34:
                    ex_2 = _f.sent();
                    console.warn("Model loading failed for " + backendName + " backend. Trying next backend: " + ex_2.message);
                    return [3 /*break*/, 1];
                case 35: return [2 /*return*/, runner];
                case 36: throw new Error('No backend is available');
            }
        });
    });
}

exports.getConfiguration = getConfiguration;
exports.setConfiguration = setConfiguration;
exports.getBackendAvailability = getBackendAvailability;
exports.load = load;
exports.Math = math;
exports.Image = image;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=webdnn.es5.js.map
