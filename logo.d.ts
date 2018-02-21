export declare type IMatrixTuple = number[];
export declare class Matrix {
    m: IMatrixTuple;
    private static POOL;
    private static IDENTITY;
    private saved;
    constructor(m?: IMatrixTuple);
    copy(): Matrix;
    restore(): this;
    save(): this;
    multiply(m: Matrix): this;
    matrix(m: IMatrixTuple): this;
    translate(x?: number, y?: number, z?: number): this;
    scale(sx?: any, sy?: any, sz?: any): this;
    rotx(theta: number): this;
    roty(theta: number): this;
    rotz(theta: number): this;
}
export declare abstract class Transformable<T extends Transformable<any>> {
    abstract transform(matrix: Matrix): T;
    scale(sx?: number, sy?: number, sz?: number): T;
    translate(x: number, y: number, z: number): T;
    rotx(theta: number): T;
    roty(theta: number): T;
    rotz(theta: number): T;
}
export declare class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    private static PIXELS_PER_RADIAN;
    private static POOL;
    static xy(x: number, y: number): Quaternion;
    static xyAlt(x: number, y: number): Quaternion;
    static pointAngle(p: Point, theta: number): Quaternion;
    constructor(x?: number, y?: number, z?: number, w?: number);
    copy(): Quaternion;
    multiply(q: any): this;
    toMatrix(): Matrix;
}
export declare class Point extends Transformable<Point> {
    x: number;
    y: number;
    z: number;
    private static POOL;
    constructor(x?: number, y?: number, z?: number);
    copy(): Point;
    add(p: Point): this;
    subtract(p: Point): this;
    divide(s: number): this;
    round(): this;
    normalize(): this;
    magnitude(): number;
    dot(p: Point): number;
    cross(p: Point): this;
    transform(m: Matrix): Point;
}
export declare const P: (x?: number, y?: number, z?: number) => Point;
export declare type IBounds = [number, number, number, number];
export interface ICompositeOverlays {
    [composite: string]: string;
}
export declare class Face extends Transformable<Face> {
    points: Point[];
    static PATH(ctx: CanvasRenderingContext2D, points: Point[]): void;
    static BOUNDS(points: Point[]): IBounds;
    fill: string;
    stroke: string;
    overlays: ICompositeOverlays;
    projected: Point[];
    projectedCenter: Point;
    dropShadowOf: Face;
    bounds: IBounds;
    lineDash: number[];
    lineDashOffset: number;
    order: number;
    constructor(points: Point[]);
    transform(m: Matrix): Face;
}
export declare const F: (points: Point[]) => Face;
export declare class Shape extends Transformable<Shape> {
    faces: Face[];
    static JOIN(...shapes: Shape[]): Shape;
    static RECT(xx?: number, yy?: number, zz?: number): Shape;
    constructor(faces: Face[]);
    fill(color: string): this;
    stroke(color: string): this;
    order(orders: number[]): void;
    transform(m: Matrix): Shape;
}
export declare type ISegment = [Point, Point];
export declare class Corner extends Transformable<Corner> {
    segments: ISegment[];
    center: Point;
    static CORNER(): Corner;
    static PATH(ctx: CanvasRenderingContext2D, segments: ISegment[]): void;
    projected: ISegment[];
    projectedCenter: Point;
    constructor(segments: ISegment[], center: Point);
    transform(m: Matrix): Corner;
}
export interface IRenderableVisitor {
    (object: any, transform: Matrix): void;
}
export declare class SceneModel extends Transformable<SceneModel> {
    static ISOMETRIC: Matrix;
    children: any[];
    xform: Matrix;
    constructor();
    transform(m: Matrix): SceneModel;
    save(): this;
    restore(): this;
    add(child: any): this;
    group(): SceneModel;
    eachRenderable(transform: Matrix, callback: IRenderableVisitor): void;
}
export declare const T: {
    EASE_IN: (callback: IAnimatedCallback) => (t: any) => void;
    EASE_OUT: (callback: IAnimatedCallback) => (t: any) => void;
    EASE_IN_OUT: (callback: IAnimatedCallback) => (t: any) => void;
    EASE_IN_EXP: (e: number, callback: IAnimatedCallback) => (t: any) => void;
    EASE_OUT_EXP: (e: number, callback: IAnimatedCallback) => (t: any) => void;
    EASE_IN_OUT_EXP: (e: any, callback: IAnimatedCallback) => (t: any) => void;
    INTERPOLATE: (from: number, to: number, callback: IAnimatedCallback) => (t: number) => void;
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
export declare class Accumulator implements ITickable {
    target: number;
    callback: IAnimatedCallback;
    alpha: number;
    value: number;
    constructor(target: number, callback?: IAnimatedCallback);
    tick(elapsed: number): boolean;
}
export declare class Timeline implements ITickable {
    private queue;
    constructor();
    reset(): this;
    after(duration: number, callback?: IRenderCallback): this;
    tween(duration: number, callback?: IAnimatedCallback): this;
    tick(elapsed: number): boolean;
}
export declare class Ticker implements ITickable {
    private callback;
    constructor(callback: IRenderCallback);
    tick(_elapsed: number): boolean;
}
export declare class Animator {
    private render;
    private tickables;
    private starttime;
    constructor(render: IRenderCallback);
    ticker(callback: IRenderCallback): Ticker;
    timeline(): Timeline;
    accumulator(target: number, callback?: IAnimatedCallback): Accumulator;
    start(): void;
    private tick;
}
export declare class CanvasBuffer {
    static create(): CanvasBuffer;
    ctx: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement);
    clear(color: string, bounds: IBounds): void;
    matchSize(ctx: CanvasRenderingContext2D): void;
    copyTo(ctx: CanvasRenderingContext2D, bounds: IBounds): void;
}
export declare abstract class CanvasRenderer {
    protected ctx: CanvasRenderingContext2D;
    static IS_RETINA: () => boolean;
    retinaScale: number;
    protected width: number;
    protected height: number;
    constructor(ctx: CanvasRenderingContext2D);
    abstract render(): any;
    protected resize(): void;
}
export declare class SceneRenderer extends CanvasRenderer {
    private scene;
    constructor(ctx: CanvasRenderingContext2D, scene: SceneModel);
    render(): void;
    renderLogo(): void;
    private renderFaces(faces);
    private renderFaceDropShadow(faces);
    private renderFace(face);
    private debugFaceRenderOrder(face);
    private renderCorners(corners);
}
export declare const init: (canvas: HTMLCanvasElement, canvasBackground: HTMLCanvasElement) => void;
