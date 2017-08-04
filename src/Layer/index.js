/**
 * 图层类
 */
import Canvas from '../Canvas';
import Scale from '../Scale';
import CanvasDesign from '../CanvasDesign';
import { Size, Bounds, DefaultStyle, Position } from '../CanvasDesign';

export default class Layer {
  constructor (div) {
    const style = div.style;
    const size = new Size(parseInt(style.width), parseInt(style.height)); 
    this.size = size;
    this.div = div;
    this.maxBounds = new Bounds(-size.w / 2, -size.h / 2, size.w / 2, size.h / 2);
    this.bounds = new Bounds(-size.w / 2, -size.h / 2, size.w / 2, size.h / 2);
    this.center = this.bounds.getCenter();
    this.getRes();
    this.scale = new Scale(this);
    // 缩放比
    this.zoom = 100;
    this.vectors = {};
    this.vectorsCount = 0;
    this.renderer = new Canvas(this);
  }

  addVectors (vectors) {
    this.renderer.lock = true;
    for (let i = 0, len = vectors.length; i < len; i ++) {
      if (i === len - 1) this.renderer.lock = false;
      this.vectors[vectors[i].id] = vectors[i];
      this.drawVector(vectors[i]);
    }
    this.vectorsCount += vectors.length;
  }

  drawVector (vector) {
    let style = null;
    if (!vector.style) {
      style = new DefaultStyle();
    } else {
      style = vector.style
    }
    this.renderer.drawGeometry(vector.geometry, style);
  }

  getRes () {
    this.res = 1 / (this.zoom / 100);
    return this.res;
  }

  moveTo (zoom, center) {
    this.zoom = zoom;
    if (!center) {
      center = this.center;
    }
    const res = this.getRes();
    const width = this.size.w * res;
    const height = this.size.h * res;
    console.log(center);
    // 移动时获取新的视图范围
    const bounds = new Bounds(
      center.x - width / 2,
      center.y - height / 2,
      center.x + width / 2,
      center.y + height / 2
    );
    this.bounds = bounds;
    let index = 0;
    this.renderer.lock = true;
    for(let id in this.vectors) {
      index ++;
      if (index == this.vectorsCount) {
        this.renderer.lock = false;
      }
      this.drawVector(this.vectors[id]);
    }
  }

  getPositionFromPX (px) {
    return new Position((px.x + this.bounds.left / this.res) * this.res,
      (this.bounds / this.res - px.y) * this.res);
  }

  getResFromZoom (zoom) {
    return 1 / (zoom / 100);
  }
}
