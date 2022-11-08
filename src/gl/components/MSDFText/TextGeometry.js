import { BufferGeometry, Sphere, BufferAttribute, Box3 } from "three";
import createLayout from "layout-bmfont-text";
import createIndices from "quad-indices";
import vertices from "./lib/vertices";
import utils from "./lib/utils";

export const createTextGeometry = (opt) => {
  return new TextGeometry(opt);
};

export class TextGeometry extends BufferGeometry {
  constructor(opt) {
    super();

    if (typeof opt === "string") {
      opt = { text: opt };
    }

    // use these as default values for any subsequent
    // calls to update()
    this._opt = Object.assign({}, opt);

    // also do an initial setup...
    if (opt) this.update(opt);
  }

  update = (opt) => {
    if (typeof opt === "string") {
      opt = { text: opt };
    }

    // use constructor defaults
    opt = Object.assign({}, this._opt, opt);

    if (!opt.font) {
      throw new TypeError("must specify a { font } in options");
    }

    this.layout = createLayout(opt);

    const ptSize = opt.ptSize || 1;

    // get vec2 texcoords
    const flipY = opt.flipY !== false;

    // the desired BMFont data
    const font = opt.font;

    // determine texture size from font file
    const texWidth = font.common.scaleW;
    const texHeight = font.common.scaleH;

    // get visible glyphs
    const glyphs = this.layout.glyphs.filter(function (glyph) {
      const bitmap = glyph.data;
      return bitmap.width * bitmap.height > 0;
    });

    // provide visible glyphs for convenience
    this.visibleGlyphs = glyphs;

    // get common vertex data
    const positions = vertices.positions(glyphs);
    for (let i = 0; i < positions.length; i += 2) {
      positions[i] *= ptSize;
      positions[i + 1] *= -ptSize;
    }
    const uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY);
    const indices = createIndices([], {
      clockwise: true,
      type: "uint16",
      count: glyphs.length,
    });

    // update vertex data
    this.setIndex(indices);
    this.setAttribute("position", new BufferAttribute(positions, 2));
    this.setAttribute("uv", new BufferAttribute(uvs, 2));

    // update multipage data
    if (!opt.multipage && "page" in this.attributes) {
      // disable multipage rendering
      this.deleteAttribute("page");
    } else if (opt.multipage) {
      // enable multipage rendering
      var pages = vertices.pages(glyphs);
      this.setAttribute("page", new BufferAttribute(pages, 1));
    }
  };

  computeBoundingSphere = () => {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere();
    }

    const positions = this.attributes.position.array;
    const itemSize = this.attributes.position.itemSize;
    if (!positions || !itemSize || positions.length < 2) {
      this.boundingSphere.radius = 0;
      this.boundingSphere.center.set(0, 0, 0);
      return;
    }
    utils.computeSphere(positions, this.boundingSphere);
    if (isNaN(this.boundingSphere.radius)) {
      console.error(
        "THREE.BufferGeometry.computeBoundingSphere(): " +
          "Computed radius is NaN. The " +
          '"position" attribute is likely to have NaN values.'
      );
    }
  };

  computeBoundingBox = () => {
    if (this.boundingBox === null) {
      this.boundingBox = new Box3();
    }

    const positions = this.attributes.position.array;
    const itemSize = this.attributes.position.itemSize;
    if (!positions || !itemSize || positions.length < 2) {
      this.boundingBox.makeEmpty();
      return;
    }
    utils.computeBox(positions, this.boundingBox);
    return this.boundingBox;
  };
}
