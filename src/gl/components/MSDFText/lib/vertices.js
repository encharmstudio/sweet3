export function pages(glyphs) {
  var pages = new Float32Array(glyphs.length * 4 * 1);
  var i = 0;
  glyphs.forEach(function (glyph) {
    var id = glyph.data.page || 0;
    pages[i++] = id;
    pages[i++] = id;
    pages[i++] = id;
    pages[i++] = id;
  });
  return pages;
}

export function uvs(glyphs, texWidth, texHeight, flipY) {
  var uvs = new Float32Array(glyphs.length * 4 * 2);
  var i = 0;
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data;
    var bw = bitmap.x + bitmap.width;
    var bh = bitmap.y + bitmap.height;

    // top left position
    var u0 = bitmap.x / texWidth;
    var v1 = bitmap.y / texHeight;
    var u1 = bw / texWidth;
    var v0 = bh / texHeight;

    if (flipY) {
      v1 = (texHeight - bitmap.y) / texHeight;
      v0 = (texHeight - bh) / texHeight;
    }

    // BL
    uvs[i++] = u0;
    uvs[i++] = v1;
    // TL
    uvs[i++] = u0;
    uvs[i++] = v0;
    // TR
    uvs[i++] = u1;
    uvs[i++] = v0;
    // BR
    uvs[i++] = u1;
    uvs[i++] = v1;
  });
  return uvs;
}

export function positions(glyphs) {
  var positions = new Float32Array(glyphs.length * 4 * 2);
  var i = 0;
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data;

    // bottom left position
    var x = glyph.position[0] + bitmap.xoffset;
    var y = glyph.position[1] + bitmap.yoffset;

    // quad size
    var w = bitmap.width;
    var h = bitmap.height;

    // BL
    positions[i++] = x;
    positions[i++] = y;
    // TL
    positions[i++] = x;
    positions[i++] = y + h;
    // TR
    positions[i++] = x + w;
    positions[i++] = y + h;
    // BR
    positions[i++] = x + w;
    positions[i++] = y;
  });
  return positions;
}

export function layoutUvs(glyphs, texWidth, texHeight, flipY, layout) {
  const layoutUvs = new Float32Array(glyphs.length * 4 * 2);
  let l = 0;
  glyphs.forEach(function (glyph) {
    let bitmap = glyph.data;
    /// Layout UV: Text block UVS

    // BL
    layoutUvs[l++] = glyph.position[0] / layout.width;
    layoutUvs[l++] = (glyph.position[1] + layout.height) / layout.height;

    // TL
    layoutUvs[l++] = glyph.position[0] / layout.width;
    layoutUvs[l++] =
      (glyph.position[1] + layout.height + bitmap.height) / layout.height;
    // TR
    layoutUvs[l++] = (glyph.position[0] + bitmap.width) / layout.width;
    layoutUvs[l++] =
      (glyph.position[1] + layout.height + bitmap.height) / layout.height;
    // BR
    layoutUvs[l++] = (glyph.position[0] + bitmap.width) / layout.width;
    layoutUvs[l++] = (glyph.position[1] + layout.height) / layout.height;
  });
  return layoutUvs;
}

export default {
  positions,
  uvs,
  pages,
  layoutUvs,
};
