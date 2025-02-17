// Fetch all .svg-icons & pass them into the svg-sprite
function requireAll(r) {
  r.keys().forEach(r);
}
requireAll(require.context('@svg/icons/sprite/', true, /\.svg$/));
