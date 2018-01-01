var Config = require('./Config');
var md5 = require('js-md5');
const _sodium = require('libsodium-wrappers');
class Utils {
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static keyToString(key) {
        return key.split('_').map(Utils.capitalize).join('');
    }

    static arrayToObject(arr, key, value) {
        var res = {};
        for (var i = 0; i < arr.length; i++) {
            res[key(arr[i])] = value ? value(arr[i]) : arr[i];
        }
        return res;
    }

    static randomNormal(ref) {
        var u = 1 - Math.random();
        var v = 1 - Math.random();
        if (typeof ref === 'function') {
            ref(u, v);
        }
        return Utils.uniformToNormal(u, v);
    }

    static uniformToNormal(u, v) {
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static usingCellularData() {
        var con = window.navigator.connection;
        if (con) {
            return con.type === 'cellular';
        }

        var ua = window.navigator.userAgent;
        if (/MicroMessenger/.test(ua)) {
            if (/NetType/.test(ua)) {
                var type = ua.match(/NetType\/(\S*)/);
                return type.indexOf('2G') !== -1 || type.indexOf('3G') !== -1 || type.indexOf('4G') !== -1;
            }
        }

        return false;
    }

    static sum(arr) {
        return arr.reduce((a, b) => a + b, 0);
    }

    static flatMap(arr, lambda) {
        return Array.prototype.concat.apply([], arr.map(lambda));
    };

    static promiseTimeout(timeout, isResolve = false) {
        return new Promise(function (resolve, reject) {
            setTimeout(isResolve ? resolve : reject, timeout);
        });
    }

    static getCountry() {
        return Promise.race([
            window.$.get(Config.geoip.url),
            Utils.promiseTimeout(Config.geoip.timeout)
        ]).then(data => {
            if (data) {
                return data.country;
            }
            else {
                return null;
            }
        }).catch(err => {
            return null;
        });
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    };
    /**
     * 可以考虑用 sodium 来做
     * @param text 任意的字符串
     * @return 需要长度为267(=128+128+11)的Uint8Array,
     *         这里返回的是长度为272(=128+128+16)的Uint8Array
     */
    static async getUint8ArrayFromText(text) {
        // (async() => {
        //     await _sodium.ready;
        //     const sodium = _sodium;

        //     let key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
        //     let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
        //     let [state_out, header] = [res.state, res.header];
            
        //     let c1 = sodium.crypto_secretstream_xchacha20poly1305_push(
        //         state_out,
        //         sodium.from_string(text), null,
        //         sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE
        //     );
            
        //     let state_in = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);
        //     let r1 = sodium.crypto_secretstream_xchacha20poly1305_pull(state_in, c1);
        //     let [m1, tag1] = [sodium.to_string(r1.message), r1.tag];

        //     console.log(m1);

        // })();
        var ary = md5.array(text);
        return new Uint8Array(ary.concat(
            ary, ary, ary, ary,
            ary, ary, ary, ary,
            ary, ary, ary, ary,
            ary, ary, ary, ary
        ));
    }
}

module.exports = Utils