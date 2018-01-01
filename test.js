const _sodium = require('libsodium-wrappers');
(async() => {
  await _sodium.ready;
  const sodium = _sodium;
 
  let key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
 
  let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
  let [state_out, header] = [res.state, res.header];
  let c1 = sodium.crypto_secretstream_xchacha20poly1305_push(state_out,
    sodium.from_string('message 1'), null,
    sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE);
  let c2 = sodium.crypto_secretstream_xchacha20poly1305_push(state_out,
    sodium.from_string('message 2'), null,
    sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL);
 
  let state_in = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);
  let r1 = sodium.crypto_secretstream_xchacha20poly1305_pull(state_in, c1);
  let [m1, tag1] = [sodium.to_string(r1.message), r1.tag];
  let r2 = sodium.crypto_secretstream_xchacha20poly1305_pull(state_in, c2);
  let [m2, tag2] = [sodium.to_string(r2.message), r2.tag];
 
  console.log(m1);
  console.log(m2);

  let key2 = sodium.from_hex('724b092810ec86d7e35c9d067702b31ef90bc43a7b598626749914d6a3e033ed');

  function encrypt_and_prepend_nonce(message) {
      let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
      return nonce.concat(sodium.crypto_secretbox_easy(message, nonce, key2));
  }
  function decrypt_after_extracting_nonce(nonce_and_ciphertext) {
    if (nonce_and_ciphertext.length < sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES) {
        throw "Short message";
    }
    let nonce = nonce_and_ciphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES),
        ciphertext = nonce_and_ciphertext.slice(sodium.crypto_secretbox_NONCEBYTES);
    return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
}
  console.log(encrypt_and_prepend_nonce("dcvdsa"))
})();
// console.log((new Uint8Array([0,1])) .concat( new Uint8Array([1,0])))
console.log((new Uint8Array([0,1].concat([1,0]))).values())
