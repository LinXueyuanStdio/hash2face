var pako = require('pako')
   , input = pako.deflate([1, 2, 3, 4, 5, 6, 7, 8, 9])
   , output;

 try {
   output = pako.inflate(input);
 } catch (err){
   console.log(err);
 }