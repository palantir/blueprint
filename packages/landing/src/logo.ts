/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

/*-----------------------------------------------

    GEOMETRIC PRIMITIVES

-------------------------------------------------*/

export type IMatrixTuple = number[];

export class Matrix {
    private static POOL: IMatrixTuple = new Array<number>(16);
    private static IDENTITY: IMatrixTuple = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];

    private saved: IMatrixTuple;

    public constructor(public m?: IMatrixTuple) {
        if (this.m == null) {
            this.m = Matrix.IDENTITY.slice();
        }
        this.saved = Matrix.IDENTITY;
    }

    public copy() {
        return new Matrix(this.m.slice());
    }

    public restore() {
        this.m = this.saved.slice();
        return this;
    }

    public save() {
        this.saved = this.m.slice();
        return this;
    }

    public multiply(m: Matrix) {
        return this.matrix(m.m);
    }

    public matrix(m: IMatrixTuple) {
        const c = Matrix.POOL;
        for (const j of [0, 1, 2, 3]) {
            for (const i of [0, 4, 8, 12]) {
                c[i + j] =
                    m[i    ] * this.m[     j] +
                    m[i + 1] * this.m[ 4 + j] +
                    m[i + 2] * this.m[ 8 + j] +
                    m[i + 3] * this.m[12 + j];
            }
        }
        Matrix.POOL = this.m;
        this.m = c;
        return this;
    }

    public translate(x = 0, y = 0, z = 0) {
        return this.matrix([ 1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1 ]);
    }

    public scale(sx?, sy?, sz?) {
        if (sx == null) {
            sx = 1;
        }
        if (sy == null) {
            sy = sx;
        }
        if (sz == null) {
            sz = sy;
        }
        return this.matrix([ sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1 ]);
    }

    public rotx(theta: number) {
        const ct = Math.cos(theta);
        const st = Math.sin(theta);
        return this.matrix([ 1, 0, 0, 0, 0, ct, -st, 0, 0, st, ct, 0, 0, 0, 0, 1 ]);
    }

    public roty(theta: number) {
        const ct = Math.cos(theta);
        const st = Math.sin(theta);
        return this.matrix([ ct, 0, st, 0, 0, 1, 0, 0, -st, 0, ct, 0, 0, 0, 0, 1 ]);
    }

    public rotz(theta: number) {
        const ct = Math.cos(theta);
        const st = Math.sin(theta);
        return this.matrix([ ct, -st, 0, 0, st, ct, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]);
    }
}

const M = (m?: IMatrixTuple) => new Matrix(m);

export abstract class Transformable<T extends Transformable<any>>{
    public abstract transform(matrix: Matrix): T;

    public scale(sx?: number, sy?: number, sz?: number) {
        return this.transform(M().scale(sx, sy, sz));
    }

    public translate(x: number, y: number, z: number) {
        return this.transform(M().translate(x, y, z));
    }

    public rotx(theta: number) {
        return this.transform(M().rotx(theta));
    }

    public roty(theta: number) {
        return this.transform(M().roty(theta));
    }

    public rotz(theta: number) {
        return this.transform(M().rotz(theta));
    }
}

export class Quaternion {
    private static PIXELS_PER_RADIAN = 2000;
    private static POOL = new Quaternion();

    public static xy(x: number, y: number) {
        const quatX = Quaternion.pointAngle(P(0, 1, 0), x / Quaternion.PIXELS_PER_RADIAN);
        const quatY = Quaternion.pointAngle(P(1, 0, 0), y / Quaternion.PIXELS_PER_RADIAN);
        return quatX.multiply(quatY);
    }

    public static xyAlt(x: number, y: number) {
        const quatX = Quaternion.pointAngle(P(0, 1, 0), x / Quaternion.PIXELS_PER_RADIAN);
        const quatY = Quaternion.pointAngle(P(1, 0, -1), y / Quaternion.PIXELS_PER_RADIAN);
        return quatY.multiply(quatX);
    }

    public static pointAngle(p: Point, theta: number) {
        const scale = Math.sin(theta / 2.0);
        const w     = Math.cos(theta / 2.0);
        return new Quaternion(scale * p.x, scale * p.y, scale * p.z, w);
    }

    public constructor(
      public x = 0,
      public y = 0,
      public z = 0,
      public w = 0) {
    }

    public copy() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    public multiply(q) {
        const pool = Quaternion.POOL;
        pool.x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
        pool.y = this.w * q.y + this.y * q.w + this.z * q.x - this.x * q.z;
        pool.z = this.w * q.z + this.z * q.w + this.x * q.y - this.y * q.x;
        pool.w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
        this.x = pool.x;
        this.y = pool.y;
        this.z = pool.z;
        this.w = pool.w;
        return this;
    }

    public toMatrix() {
        const t = this;
        return M([
            1 - 2 * (t.y * t.y + t.z * t.z), 2 * (t.x * t.y - t.w * t.z), 2 * (t.x * t.z + t.w * t.y), 0,
            2 * (t.x * t.y + t.w * t.z), 1 - 2 * (t.x * t.x + t.z * t.z), 2 * (t.y * t.z - t.w * t.x), 0,
            2 * (t.x * t.z - t.w * t.y), 2 * (t.y * t.z + t.w * t.x), 1 - 2 * (t.x * t.x + t.y * t.y), 0,
            0, 0, 0, 1
        ]);
    }
}

export class Point extends Transformable<Point> {
    private static POOL = new Point();

    public constructor(
      public x = 0,
      public y = 0,
      public z = 0) {
        super();
    }

    public copy() {
        return new Point(this.x, this.y, this.z);
    }

    public add(p: Point) {
        this.x += p.x;
        this.y += p.y;
        this.z += p.z;
        return this;
    }

    public subtract(p: Point) {
        this.x -= p.x;
        this.y -= p.y;
        this.z -= p.z;
        return this;
    }

    public divide(s: number) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }

    public round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }

    public normalize() {
        this.divide(this.magnitude());
        return this;
    }

    public magnitude() {
        return Math.sqrt(this.dot(this));
    }

    public dot(p: Point) {
        return this.x * p.x + this.y * p.y + this.z * p.z;
    }

    public cross(p: Point) {
        const pool = Point.POOL;
        pool.x = this.y * p.z - this.z * p.y;
        pool.y = this.z * p.x - this.x * p.z;
        pool.z = this.x * p.y - this.y * p.x;
        this.x = pool.x;
        this.y = pool.y;
        this.z = pool.z;
        return this;
    }

    public transform(m: Matrix): Point {
        const pool = Point.POOL;
        pool.x = this.x * m.m[0] + this.y * m.m[1] + this.z * m.m[2]  + m.m[3];
        pool.y = this.x * m.m[4] + this.y * m.m[5] + this.z * m.m[6]  + m.m[7];
        pool.z = this.x * m.m[8] + this.y * m.m[9] + this.z * m.m[10] + m.m[11];
        this.x = pool.x;
        this.y = pool.y;
        this.z = pool.z;
        return this;
    }
}

export const P = (x?: number, y?: number, z?: number) => new Point(x, y, z);

/*-----------------------------------------------

    3D MODELS

-------------------------------------------------*/

export type IBounds = [number, number, number, number];

export interface ICompositeOverlays {
    [composite: string]: string;
}

export class Face extends Transformable<Face> {
    public static PATH(ctx: CanvasRenderingContext2D, points: Point[]) {
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (i == 0) {
                ctx.moveTo(p.x, p.y);
            } else {
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.closePath();
    }

    public static BOUNDS(points: Point[]): IBounds {
        const minX = -1 + Math.floor(points.reduce(((r, p) => (p.x < r.x) ? p : r), points[0]).x);
        const maxX = 1 + Math.ceil(points.reduce(((r, p) => (p.x > r.x) ? p : r), points[0]).x);
        const minY = -1 + Math.floor(points.reduce(((r, p) => (p.y < r.y) ? p : r), points[0]).y);
        const maxY = 1 + Math.ceil(points.reduce(((r, p) => (p.y > r.y) ? p : r), points[0]).y);
        return [minX, minY, maxX - minX, maxY - minY];
    }

    public fill: string;
    public stroke: string;
    public overlays: ICompositeOverlays;
    public projected: Point[];
    public projectedCenter: Point;
    public dropShadowOf: Face;
    public bounds: IBounds;
    public lineDash: number[];
    public lineDashOffset: number;
    public order: number;

    public constructor(public points: Point[]) {
        super();
    }

    public transform(m: Matrix): Face {
        for (const p of this.points) {
            p.transform(m);
        }
        return this;
    }
}

export const F = (points: Point[]) => new Face(points);

export class Shape extends Transformable<Shape> {
    public static JOIN(...shapes: Shape[]) {
        const xorfaces: {[serialized: string]: Face} = {};
        for (const shape of shapes) {
            for (const face of shape.faces) {
                const consistent = face.points.slice();
                consistent.sort((a, b) => a.x - b.x);
                consistent.sort((a, b) => a.y - b.y);
                consistent.sort((a, b) => a.z - b.z);
                const key = JSON.stringify(consistent);
                if (xorfaces[key] != null) {
                    delete xorfaces[key];
                } else {
                    xorfaces[key] = face;
                }
            }
        }

        const faces = [] as Face[];
        for (const key in xorfaces) {
            faces.push(xorfaces[key]);
        }
        return new Shape(faces);
    }

    public static RECT(xx = -1, yy = -1, zz = -1) {
        const faces = [] as Face[];
        for (const x of [0, xx]) {
            faces.push(F([ P(x,yy,0), P(x,yy,zz), P(x,0,zz),  P(x,0,0) ]));
        }
        for (const y of [0, yy]) {
            faces.push(F([ P(0,y,0), P(0,y,zz), P(xx,y,zz), P(xx,y,0) ]));
        }
        for (const z of [0, zz]) {
            faces.push(F([ P(0,yy,z), P(0,0,z), P(xx,0,z), P(xx,yy,z) ]));
        }

        // fix winding
        faces[1].points.reverse();
        faces[3].points.reverse();
        faces[5].points.reverse();
        return new Shape(faces);
    }

    public constructor(public faces: Face[]) {
        super();
    }

    public fill(color: string) {
        for (const f of this.faces) {
            f.fill = color;
        }
        return this;
    }

    public stroke(color: string) {
        for (const f of this.faces) {
            f.stroke = color;
        }
        return this;
    }

    public order(orders: number[]) {
        for (let i = 0; i < orders.length; i++) {
            this.faces[i].order = orders[i];
        }
    }

    public transform(m: Matrix): Shape {
        for (const f of this.faces) {
            f.transform(m);
        }
        return this;
    }
}

export type ISegment = [Point, Point];

export class Corner extends Transformable<Corner> {
    public static CORNER() {
        return new Corner([
            [P(), P().translate(-1, 0, 0)],
            [P(), P().translate(0, 1, 0)],
            [P(), P().translate(0, 0, -1)]
        ], P());
    }

    public static PATH(ctx: CanvasRenderingContext2D, segments: ISegment[]) {
        ctx.beginPath();
        for (const seg of segments) {
            ctx.moveTo(seg[0].x, seg[0].y);
            ctx.lineTo(seg[1].x, seg[1].y);
        }
    }

    public projected: ISegment[];
    public projectedCenter: Point;

    public constructor(public segments: ISegment[], public center: Point) {
        super();
    }

    public transform(m: Matrix): Corner {
        for (const seg of this.segments) {
            seg[0].transform(m);
            seg[1].transform(m);
        }
        this.center.transform(m);
        return this;
    }
}

export interface IRenderableVisitor {
    (object: any, transform: Matrix): void;
}

export class SceneModel extends Transformable<SceneModel> {
    public static ISOMETRIC = (() => {
        // This is a modification of a standard isometric projection that maintains
        // a z-coordinate aligned with the view plane.
        const shear = [ 1, 0, 0, 0, 0, Math.sqrt(2 / 3), 1 / Math.sqrt(3), 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
        return M().roty(-Math.PI / 4).matrix(shear);
    })();

    public children = [];
    public xform = M();

    public constructor() {
        super();
    }

    public transform(m: Matrix): SceneModel {
        this.xform.multiply(m);
        return this;
    }

    public save() {
        this.xform.save();
        return this;
    }

    public restore() {
        this.xform.restore()
        return this;
    }

    public add(child: any) {
        this.children.push(child);
        return this;
    }

    public group() {
        const model = new SceneModel();
        this.add(model);
        return model;
    }

    public eachRenderable(transform: Matrix, callback: IRenderableVisitor) {
        transform = this.xform.copy().multiply(transform);
        for (const child of this.children) {
            if (child instanceof SceneModel) {
                child.eachRenderable(transform, callback);
            } else {
                callback.call(this, child, transform);
            }
        }
    }
}

/*-----------------------------------------------

    ANIMATION

-------------------------------------------------*/

// Transitioners
// # https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
export const T = {
    EASE_IN : (callback: IAnimatedCallback) => {
        return (t) => callback(t*t*t*t*t);
    },
    EASE_OUT : (callback: IAnimatedCallback) => {
        return (t) => callback((t=t-1)*t*t*t*t + 1);
    },
    EASE_IN_OUT : (callback: IAnimatedCallback) => {
        return (t) => callback(((t*=2) < 1) ? 1/2*t*t*t*t : -1/2 * ((t-=2)*t*t*t - 2));
    },
    EASE_IN_EXP : (e: number, callback: IAnimatedCallback) => {
        return (t) => callback((t == 0) ? 0 : Math.pow(e, 10 * (t - 1)))
    },
    EASE_OUT_EXP : (e: number, callback: IAnimatedCallback) => {
        return (t) => callback((t == 1) ? 1 : 1 - Math.pow(e, -10 * t))
    },
    EASE_IN_OUT_EXP : (e, callback: IAnimatedCallback) => {
        return (t) => {
            if (t == 0) {
                callback(0);
            } else if (t == 1) {
                callback(1);
            }  else if ((t*=2) < 1) {
                callback(1/2 * Math.pow(e, 10 * (t - 1)));
            } else {
                callback(1/2 * (-Math.pow(e, -10 * --t) + 2));
            }
        };
    },
    INTERPOLATE : (from: number, to: number, callback: IAnimatedCallback) => {
        return (t: number) => callback((to - from) * t + from);
    }
};

export interface ITickable {
    tick: (t: number) => boolean;
}

export interface IAnimatedCallback {
    (t: number): void;
}

export interface IKeyFrame {
    duration: number;
    callback?: IAnimatedCallback;
    starttime?: number;
}

export interface IRenderCallback {
    (): void;
}

export class Accumulator implements ITickable {
    private static ALPHA = 0.08;
    public value: number;

    public constructor(public target: number, public callback: IAnimatedCallback) {
        this.value = this.target;
    }

    public tick(elapsed: number) {
        this.value = (Accumulator.ALPHA * this.target) + (1.0 - Accumulator.ALPHA) * this.value
        this.callback(this.value);
        return true;
    }
}

class Timeline implements ITickable {
    private queue = [] as IKeyFrame[];

    public constructor() {
    }

    public tween(duration: number, callback?: IAnimatedCallback) {
        this.queue.push({duration, callback} as IKeyFrame);
        return this;
    }

    public tick(elapsed: number) {
        if (this.queue.length == 0) {
            return false;
        }

        const anim = this.queue[0];
        let { duration, callback, starttime } = anim;

        if (starttime == null) {
            anim.starttime = starttime = elapsed;
        }

        if ((elapsed - starttime) >= duration) {
            if (callback != null) {
                callback(1.0);
            }
            this.queue.shift();
            return this.queue.length > 0;
        } else {
            if (callback != null) {
                callback((elapsed - starttime) / duration);
            }
            return true;
        }
    }
}

export class Animator {
    private tickables: ITickable[] = [];
    private starttime: number = 0;

    public constructor(private render: IRenderCallback){
    }

    public timeline() {
        const timeline = new Timeline();
        this.tickables.push(timeline);
        return timeline;
    }

    public accumulator(target: number, callback: IAnimatedCallback) {
        const accumulator = new Accumulator(target, callback);
        this.tickables.push(accumulator);
        return accumulator;
    }

    public start() {
        this.starttime = new Date().valueOf();
        requestAnimationFrame(this.tick);
    }

    private tick = (t: number) => {
        const elapsed = new Date().valueOf() - this.starttime;
        let again = false;
        for (const tickable of this.tickables) {
            again = tickable.tick(elapsed) || again;
        }
        this.render();
        if (again) {
            requestAnimationFrame(this.tick);
        }
    }
}

/*-----------------------------------------------

    CANVAS RENDERERS

-------------------------------------------------*/

export class CanvasBuffer {
    public static create() {
        return new CanvasBuffer(document.createElement('canvas'));
    }

    public ctx: CanvasRenderingContext2D;

    public constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
    }

    public clear(color: string, bounds: IBounds) {
        if (bounds == null) {
            bounds = [0, 0, this.ctx.canvas.width, this.ctx.canvas.height];
        }
        if (color == null) {
            this.ctx.clearRect.apply(this.ctx, bounds);
        } else {
            this.ctx.fillStyle = color;
            this.ctx.fillRect.apply(this.ctx, bounds);
        }
    }

    public matchSize(ctx: CanvasRenderingContext2D) {
        this.ctx.canvas.width = ctx.canvas.width;
        this.ctx.canvas.height = ctx.canvas.height;
    }

    public copyTo(ctx: CanvasRenderingContext2D, bounds: IBounds) {
        if (bounds == null) {
            bounds = [0, 0, this.ctx.canvas.width, this.ctx.canvas.height];
        }
        const args = [].concat([this.ctx.canvas]).concat(bounds).concat(bounds);
        ctx.drawImage.apply(ctx, args);
    }
}

export abstract class CanvasRenderer {
    public static IS_RETINA = () => {
        return (window.matchMedia
          && (
              window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches
              || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches
          )
          || (window.devicePixelRatio && window.devicePixelRatio >= 2)
        );
    };

    public retinaScale: number;
    protected width: number;
    protected height: number;

    public constructor(protected ctx: CanvasRenderingContext2D) {
        this.width  = this.ctx.canvas.clientWidth;
        this.height = this.ctx.canvas.clientHeight;
        this.retinaScale = SceneRenderer.IS_RETINA() ? 2 : 1;
    }

    public abstract render();

    protected resize() {
        this.retinaScale = SceneRenderer.IS_RETINA() ? 2 : 1;
        const { canvas } = this.ctx;
        this.width = canvas.parentElement.clientWidth;
        this.height = canvas.parentElement.clientHeight;
        canvas.width = this.width * this.retinaScale;
        canvas.height = this.height * this.retinaScale;
        canvas.style.width = this.width + "px";
        canvas.style.height = this.height + "px";
    }
}

class BackgroundRenderer extends CanvasRenderer {

    private static GRID_SIZE = 10;

    public render(){
        this.resize();
        this.ctx.clearRect(0,0, this.width * this.retinaScale, this.height * this.retinaScale);
        this.renderBackground();
        this.renderGrid();
        this.renderBackgroundOverlays();
    }

    private renderBackground() {
        this.ctx.save();
        this.ctx.scale(this.retinaScale, this.retinaScale);

        let grd = this.ctx.createRadialGradient(
          this.width/2, this.height/2, 0,
          this.width/2, this.height/2, this.width/2);
        grd.addColorStop(0,"#2B95D6");
        grd.addColorStop(1,"#137CBD");
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore()
    }

    private renderBackgroundOverlays() {
        this.ctx.save();
        this.ctx.scale(this.retinaScale, this.retinaScale);

        let grd = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grd.addColorStop(0,"rgba(0,0,0,0.6)");
        grd.addColorStop(1,"rgba(0,0,0,0)");
        this.ctx.fillStyle = grd;
        this.ctx.globalCompositeOperation = "overlay";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore()
    }

    private renderGrid() {
        this.ctx.save();
        this.ctx.scale(this.retinaScale, this.retinaScale);

        this.ctx.globalCompositeOperation = "overlay";
        this.ctx.lineWidth = 1;
        const light = "rgba(255, 255, 255, 0.05)";
        const dark = "rgba(255, 255, 255, 0.1)";

        // perfectly center gridline
        const major = BackgroundRenderer.GRID_SIZE * 5;
        const xstart = Math.floor((this.width / 2) % major) - major;

        for (let x = xstart; x < this.width; x += BackgroundRenderer.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x,0);
            this.ctx.lineTo(x,this.height);
            this.ctx.strokeStyle = ((x - xstart) % major === 0) ? dark : light;
            this.ctx.stroke();
        }

        for (let y = 0; y < this.height; y += BackgroundRenderer.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0,y);
            this.ctx.lineTo(this.width,y);
            this.ctx.strokeStyle = (y % major === 0) ? dark : light;
            this.ctx.stroke();
        }

        this.ctx.restore();
        return this;
    }
}

export class SceneRenderer extends CanvasRenderer {

    // private buffer: CanvasBuffer;

    public constructor(
      ctx: CanvasRenderingContext2D,
      private scene: SceneModel
    ) {
        super(ctx);
    }

    public render() {
        this.resize();
        // this.buffer.matchSize(this.ctx);

        this.ctx.clearRect(0,0, this.width * this.retinaScale, this.height * this.retinaScale);
        this.renderLogo();
    }

    public renderLogo() {
        const projection = M()
            .multiply(SceneModel.ISOMETRIC)
            .scale(50, 50)
            .translate(this.width / 2, 280)
            .scale(this.retinaScale, this.retinaScale);

        const faces = [];
        const corners = [];
        this.scene.eachRenderable(projection, (object: any, transform: Matrix) => {
            if (object instanceof Shape) {
                const shape = (object as Shape);
                for (const face of shape.faces) {
                    face.projected = face.points.map((p) => p.copy().transform(transform).round());

                    face.projectedCenter = P();
                    for (const p of face.projected) {
                        face.projectedCenter.add(p);
                    }
                    face.projectedCenter.divide(face.projected.length);

                    faces.push(face);
                }
            } else if (object instanceof Corner) {
                const corner = (object as Corner);
                corner.projected = corner.segments.map((segment) => segment.map((p) => p.copy().transform(transform)) as ISegment);
                corner.projectedCenter = corner.center.copy().transform(transform);
                corners.push(corner);
            }
        });

        faces.sort((a, b) => a.order - b.order);
        this.renderFaces(faces);
        this.renderCorners(corners);
    }

    private renderFaces(faces: Face[]) {
        this.renderFaceDropShadow(faces);
        for (const face of faces) {
            this.renderFace(face);
        }
    }

    private renderFaceDropShadow(faces: Face[]) {
        this.ctx.globalCompositeOperation = "color-burn";
        this.ctx.save();
        // trick to render shadow only
        this.ctx.translate(0, -10000);
        this.ctx.shadowOffsetY = 10000;

        const shadows = faces.filter((f) => f.dropShadowOf != null);
        for (const face of shadows) {
            // blur proportionally to distance between shadow and face
            const dy = 2.5 * Math.abs(face.projected[0].y - face.dropShadowOf.projected[0].y);
            const blur = Math.max(20, Math.min(200, dy));

            Face.PATH(this.ctx, face.projected);
            this.ctx.shadowBlur = blur;
            this.ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
            this.ctx.fillStyle = "black";
            this.ctx.fill();
        }

        this.ctx.shadowColor = null;
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.restore();
    }

    private renderFace(face: Face) {
        Face.PATH(this.ctx, face.projected);

        // fill
        if (face.fill != null) {
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.fillStyle = face.fill;
            this.ctx.fill();
            // this.debugFaceRenderOrder(face);
        }

        // composite overlays
        if (face.overlays != null) {
            for (const operation in face.overlays) {
                this.ctx.globalCompositeOperation = operation;
                this.ctx.fillStyle = face.overlays[operation];
                this.ctx.fill();
            }
            this.ctx.globalCompositeOperation = "source-over";
        }

        // sheen outline
        if (face.stroke != null && face.lineDash != null) {
            this.ctx.globalCompositeOperation = "overlay";
            this.ctx.lineJoin = "round";
            this.ctx.lineWidth = 1 * this.retinaScale;
            this.ctx.strokeStyle = face.stroke;
            this.ctx.setLineDash(face.lineDash);
            this.ctx.lineDashOffset = face.lineDashOffset == null ? 0 : face.lineDashOffset;
            this.ctx.stroke();
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.lineDashOffset = 0;
            this.ctx.setLineDash([]);
            // this.debugFaceRenderOrder(face);
        }
    }

    private debugFaceRenderOrder(face: Face) {
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.fillStyle = "lime";
        this.ctx.font = "normal 10pt Calibri";
        this.ctx.fillText("" + face.order, face.projectedCenter.x, face.projectedCenter.y);
    }

    private renderCorners(corners: Corner[]) {
        this.ctx.lineWidth = 1.5 * this.retinaScale;
        this.ctx.setLineDash([]);
        this.ctx.globalCompositeOperation = "soft-light";

        for (const corner of corners) {
            Corner.PATH(this.ctx, corner.projected);

            // gradient centered at corner's center, hardcoded outer radius
            const grd = this.ctx.createRadialGradient(
                corner.projectedCenter.x, corner.projectedCenter.y, 0,
                corner.projectedCenter.x, corner.projectedCenter.y, 40 * this.retinaScale
            );
            grd.addColorStop(0, "white");
            grd.addColorStop(1, "rgba(255, 255, 255, 0)");
            this.ctx.strokeStyle = grd;
            this.ctx.stroke();
        }

        this.ctx.globalCompositeOperation = "source-over";
    }
}

export const init = (canvas: HTMLCanvasElement, canvasBackground: HTMLCanvasElement) => {
    // scene geometry
    const overlays = (rect: Shape) => {
        const shadow    = {"hard-light": "rgba(0,0,0,0.1)", "soft-light": "black"} as ICompositeOverlays;
        const shadow2   = {"soft-light": "rgba(0,0,0,0.3)"} as ICompositeOverlays;
        const highlight = {"soft-light": "rgba(255, 255, 255, 0.5)"} as ICompositeOverlays;
        rect.faces[0].overlays = shadow;
        rect.faces[2].overlays = shadow;
        rect.faces[3].overlays = highlight;
        rect.faces[5].overlays = shadow2;
        return rect;
    }

    const blocks = {
        blockA : {
            corner : Corner.CORNER().translate(0, -1, 0),
            block  : Shape.JOIN(
                overlays(Shape.RECT()).translate(0, 0, 0),
                overlays(Shape.RECT()).translate(0, 0, -1)
            ),
            outline : Shape.RECT(-1, -1, -2)
        },
        blockB : {
            corner : Corner.CORNER().translate(-1, -2, 0),
            block  : Shape.JOIN(
                overlays(Shape.RECT()).translate(-1, 0, 0),
                overlays(Shape.RECT()).translate(-1, -1, 0)
            ),
            outline : Shape.RECT(-1, -2, -1).translate(-1, 0, 0)
        },
        blockC : {
            corner : Corner.CORNER().translate(0, -2, -1),
            block  : Shape.JOIN(
                overlays(Shape.RECT()).translate(0, -1, -1),
                overlays(Shape.RECT()).translate(-1, -1, -1)
            ),
            outline : Shape.RECT(-2, -1, -1).translate(0, -1, -1)
        }
    };

    // explicitly define render order to prevent overlap artifacts
    blocks.blockA.block.order([30, 25, 9, 26, 28, 30, 6, 10, 14, 5])
    blocks.blockB.block.order([21, 9, 17, 22, 8, 24, 7, 30, 23, 11])
    blocks.blockC.block.order([18, 15, 16, 20, 4, 2, 3, 4, 10, 1])
    blocks.blockA.outline.order([31, 4, 4, 17, 31, 4])
    blocks.blockB.outline.order([25, 6, 6, 31, 25, 6])
    blocks.blockC.outline.order([21, 0, 0, 21, 21, 0])

    // // swap overlays of blockA to match mocks
    // let shadows = blocks.blockA.block.faces[2].overlays;
    // blocks.blockA.block.faces[2].overlays = null;
    // blocks.blockA.block.faces[7].overlays = null;
    // blocks.blockA.block.faces[9].overlays = shadows;

    // shadows = blocks.blockC.block.faces[0].overlays;
    // blocks.blockC.block.faces[0].overlays = null;
    // blocks.blockC.block.faces[1].overlays = shadows;

    // add dropshadow for bottom faces of blocks
    const dropShadowFrom = (face: Face) => {
        const shadow = F(face.points.map((p) => {
            const c = p.copy();
            c.y = 0;
            return c;
        }));
        shadow.dropShadowOf = face;
        return new Shape([shadow]);
    }

    // scene model
    const scene = new SceneModel();
    scene.translate(1, 0, 1).save();

    const slideInGroups = [0, 1, 2].map(() => scene.group());
    const shadowGroups  = [0, 1, 2].map(() => scene.group());
    const explodeGroups = slideInGroups.map((g) => g.group());
    const blockGroups   = explodeGroups.map((g) => g.group());

    blockGroups[0]
        .add(blocks.blockA.corner)
        .add(blocks.blockA.block.fill("rgba(0, 180, 111, 0.9)"))
        .add(blocks.blockA.outline.stroke("rgba(255, 255, 255, 0.7)"))

    blockGroups[1]
        .add(blocks.blockB.corner)
        .add(blocks.blockB.block.fill("rgba(245, 86, 86, 0.9)"))
        .add(blocks.blockB.outline.stroke("rgba(255, 255, 255, 0.7)"))

    blockGroups[2]
        .add(blocks.blockC.corner)
        .add(blocks.blockC.block.fill("rgba(34, 148, 217, 0.9)"))
        .add(blocks.blockC.outline.stroke("rgba(255, 255, 255, 0.7)"))

    shadowGroups[0].add(dropShadowFrom(blocks.blockA.outline.faces[2]))
    shadowGroups[1].add(dropShadowFrom(blocks.blockB.outline.faces[2]))
    shadowGroups[2].add(dropShadowFrom(blocks.blockC.outline.faces[2]))

    // renderer
    const renderer = new SceneRenderer(canvas.getContext("2d"), scene);
    const backgroundRenderer = new BackgroundRenderer(canvasBackground.getContext("2d"));
    const render = () => requestAnimationFrame(() => {
        backgroundRenderer.render()
        renderer.render()
    });
    const animator = new Animator(render);

    // entrance animation
    const slideDownAnimation = (offset: number, model: SceneModel) => {
        animator.timeline()
            .tween(0, (t: number) => model.restore().translate(0, -8, 0))
            .tween(offset + 100)
            .tween(1000, T.EASE_OUT_EXP(2, T.INTERPOLATE(-8, 0, (t: number) => model.restore().translate(0, t, 0))));
    };

    slideDownAnimation(0,   slideInGroups[0])
    slideDownAnimation(300, slideInGroups[1])
    slideDownAnimation(700, slideInGroups[2])

    // sheen animation
    const sheenAnimation = (offset: number, model: SceneModel) => {
        const sheen = model.children[2];

        animator.timeline()
            .tween(offset)
            .tween(500, T.EASE_IN(T.INTERPOLATE(0, 100 * renderer.retinaScale, (t) => {
                for (const f of sheen.faces) {
                    f.lineDash = [t, t/3, t/5, 1000 * renderer.retinaScale];
                }
            })))
            .tween(2000, T.EASE_OUT(T.INTERPOLATE(100 * renderer.retinaScale, 0, (t) => {
                for (const f of sheen.faces) {
                    f.lineDash = [t, t/3, t/5, 1000 * renderer.retinaScale];
                }
            })))
            .tween(0, (t) => {
                for (const f of sheen.faces) {
                    f.lineDash = null;
                }
            })

        animator.timeline()
            .tween(offset)
            .tween(500)
            .tween(2000, T.EASE_OUT(T.INTERPOLATE(0, -350 * renderer.retinaScale, (t) => {
                for (const f of sheen.faces) {
                    f.lineDashOffset = t;
                }
            })))
            .tween(0,  (t) => {
                for (const f of sheen.faces) {
                    f.lineDashOffset = null;
                }
            })
    }

    const throttle = (wait: number, func: () => void) => {
        let timeout = null;
        const reset = () => timeout = null;
        return () => {
            if (timeout == null) {
                func();
                timeout = setTimeout(reset, wait);
            }
        };
    }

    const sheens = throttle(4000, () => {
        sheenAnimation(0, blockGroups[0]);
        sheenAnimation(300, blockGroups[1]);
        sheenAnimation(500, blockGroups[2]);
    })
    setTimeout(sheens, 1200);

    // const randomSheens = () => {
    //     setTimeout((() => {
    //         sheens();
    //         randomSheens();
    //     }), 5000 + 5000 * Math.random());
    // };
    // randomSheens();

    // mouse interaction
    const interact = () => {
        let rotate = Quaternion.xyAlt(accumX.value, -accumY.value).toMatrix();
        rotate = M().translate(1, 1, 1).multiply(rotate).multiply(M().translate(-1, -1, -1));
        const value = Math.abs(accumX.value / 2000);
        explodeGroups[0].restore().translate(value*1.2, 0, 0).transform(rotate);
        explodeGroups[1].restore().translate(0, 0, value).transform(rotate);
        explodeGroups[2].restore().translate(value, -value, -value).transform(rotate);

        const shadowDepth = 0.3;
        shadowGroups[0].restore().translate(value*1.2, shadowDepth, 0).transform(rotate);
        shadowGroups[1].restore().translate(0, shadowDepth, value).transform(rotate);
        shadowGroups[2].restore().translate(value, shadowDepth, -value).transform(rotate);
    }

    const accumX = animator.accumulator(0, interact)
    const accumY = animator.accumulator(0, interact)

    canvas.addEventListener("mousemove", (e) => {
        const dcen = P(e.offsetX, e.offsetY).subtract(P(canvas.clientWidth / 2, 210));
        if (dcen.magnitude() < 100) {
            sheens();
        }
        accumX.target = dcen.x;
        accumY.target = dcen.y;
    });

    canvas.addEventListener("mouseleave", (e) => {
        accumX.target = 0;
        accumY.target = 0;
    });

    animator.start();
};
