console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bit = {
  bitKeys: process.env.bit_Keys
};

exports.omdb = {
  omdbKeys: process.env.omdb_Keys
};




