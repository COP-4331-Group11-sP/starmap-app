/**
 * A custom TypeScript port of OrbitControls with exposed touch methods for native overrides.
 *
 * @author EvanBacon / https://github.com/evanbacon
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 * @author ScieCode / http://github.com/sciecode
 */
import { EventDispatcher, MOUSE, Quaternion, Spherical, TOUCH, Vector2, Vector3, } from 'three';
import { Platform } from 'react-native';
import { getNode } from 'react-native-web-hooks';
// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move
const STATE = {
    NONE: -1,
    ROTATE: 0,
    DOLLY: 1,
    TOUCH_ROTATE: 3,
    TOUCH_DOLLY_PAN: 5,
    TOUCH_DOLLY_ROTATE: 6,
};
const EPS = 0.000001;
const useDOM = false;
export class StarControls extends EventDispatcher {
    constructor(object, ref) {
        super();
        this.object = object;
        // Set to false to disable this control
        this.enabled = true;
        // "target" sets the vector of focus, which the camera rotates to
        this.target = new Vector3(0, 0, -500);
        // How far you can dolly in and out
        this.minZoom = 0.5;
        this.maxZoom = Infinity;
        // How far you can rotate vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        this.constrainVertical = false;
        this.verticalMin = 0; // radians
        this.verticalMax = Math.PI; // radians

        // How far you can rotate horizontally, upper and lower limits.
        // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
        this.minAzimuthAngle = -Infinity; // radians
        this.maxAzimuthAngle = Infinity; // radians
        // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
        // Set to false to disable zooming
        this.enableZoom = true;
        this.zoomSpeed = 1.0;
        // Set to false to disable rotating
        this.enableRotate = true;
        this.rotateSpeed = 1.0;
        // Mouse buttons
        this.mouseButtons = {
            LEFT: MOUSE.ROTATE,
            MIDDLE: MOUSE.DOLLY
        };
        // Touch fingers
        this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
        // PRIVATE
        //
        // internals
        //
        this.changeEvent = { type: 'change' };
        this.startEvent = { type: 'start' };
        this.endEvent = { type: 'end' };
        this.state = STATE.NONE;
        // current position in spherical coordinates
        this.spherical = new Spherical();
        this.sphericalDelta = new Spherical();



        this.scale = 1;
        this.rotateStart = new Vector2();
        this.rotateEnd = new Vector2();
        this.rotateDelta = new Vector2();
        this.dollyStart = new Vector2();
        this.dollyEnd = new Vector2();
        this.dollyDelta = new Vector2();
        this.getPolarAngle = () => this.spherical.phi;
        this.getAzimuthalAngle = () => this.spherical.theta;
        this.saveState = () => {
            this.target0.copy(this.target);
            this.position0.copy(this.object.position);
            this.zoom0 = this.object.zoom;
        };
        this.reset = () => {
            this.target.copy(this.target0);
            this.object.position.copy(this.position0);
            this.object.zoom = this.zoom0;
            this.object.updateProjectionMatrix();
            this.dispatchEvent(this.changeEvent);
            this.update();
            this.state = STATE.NONE;
        };
        this.dispose = () => {
            if (this.domElement) {
                this.domElement.removeEventListener('contextmenu', this.onContextMenu, false);
                this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
                this.domElement.removeEventListener('wheel', this.onMouseWheel, false);
                if (useDOM) {
                    this.domElement.removeEventListener('touchstart', this.onTouchStart, false);
                    this.domElement.removeEventListener('touchend', this.onTouchEnd, false);
                    this.domElement.removeEventListener('touchmove', this.onTouchMove, false);
                    // Skip Node.js envs
                    if (typeof window !== 'undefined') {
                        window.document.removeEventListener('mousemove', this.onMouseMove, false);
                        window.document.removeEventListener('mouseup', this.onMouseUp, false);
                    }
                }
            }
            //this.dispatchEvent( { type: 'dispose' } ); // should this be added here?
        };
        // Private methods
        this.getZoomScale = () => {
            return 0.95 ** this.zoomSpeed;
        };
        this.rotateLeft = (angle) => {
            this.sphericalDelta.theta += angle / this.object.zoom;
        };
        this.rotateUp = (angle) => {
            this.sphericalDelta.phi -= angle / this.object.zoom;
        };
        this.dollyIn = (dollyScale) => {
            this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * dollyScale));
            this.object.updateProjectionMatrix();
            this.zoomChanged = true;
        };
        this.dollyOut = (dollyScale) => {
            this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / dollyScale));
            this.object.updateProjectionMatrix();
            this.zoomChanged = true;
        };
        //
        // event callbacks - update the object state
        //
        this.width = 0;
        this.getElementWidth = () => {
            return this.width;
        };
        this.height = 0;
        this.getElementHeight = () => {
            return this.height;
        };
        this.handleMouseDownRotate = ({ clientX, clientY }) => {
            this.rotateStart.set(clientX, clientY);
        };
        this.handleMouseDownDolly = ({ clientX, clientY }) => {
            this.dollyStart.set(clientX, clientY);
        };
        this.handleMouseMoveRotate = ({ clientX, clientY }) => {
            this.rotateEnd.set(clientX, clientY);
            this.rotateDelta
                .subVectors(this.rotateEnd, this.rotateStart)
                .multiplyScalar(this.rotateSpeed);
            // const element =
            //   this.domElement === document ? this.domElement.body : this.domElement;
            this.rotateLeft((2 * Math.PI * this.rotateDelta.x) / this.getElementHeight()); // yes, height
            this.rotateUp((2 * Math.PI * this.rotateDelta.y) / this.getElementHeight());
            this.rotateStart.copy(this.rotateEnd);
            this.update();
        };
        this.handleMouseMoveDolly = ({ clientX, clientY }) => {
            this.dollyEnd.set(clientX, clientY);
            this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
            if (this.dollyDelta.y > 0) {
                this.dollyIn(this.getZoomScale());
            }
            else if (this.dollyDelta.y < 0) {
                this.dollyOut(this.getZoomScale());
            }
            this.dollyStart.copy(this.dollyEnd);
            this.update();
        };
        this.handleMouseWheel = ({ deltaY }) => {
            if (deltaY < 0) {
                this.dollyOut(this.getZoomScale());
            }
            else if (deltaY > 0) {
                this.dollyIn(this.getZoomScale());
            }
            this.update();
        };
        this.handleTouchStartRotate = ({ touches }) => {
            if (touches.length == 1) {
                this.rotateStart.set(touches[0].pageX, touches[0].pageY);
            }
            else {
                const x = 0.5 * (touches[0].pageX + touches[1].pageX);
                const y = 0.5 * (touches[0].pageY + touches[1].pageY);
                this.rotateStart.set(x, y);
            }
        };
        this.handleTouchStartDolly = ({ touches }) => {
            const dx = touches[0].pageX - touches[1].pageX;
            const dy = touches[0].pageY - touches[1].pageY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.dollyStart.set(0, distance);
        };
        this.handleTouchStartDollyPan = event => {
            if (this.enableZoom)
                this.handleTouchStartDolly(event);
        };
        this.handleTouchStartDollyRotate = event => {
            if (this.enableZoom)
                this.handleTouchStartDolly(event);
            if (this.enableRotate)
                this.handleTouchStartRotate(event);
        };
        this.handleTouchMoveRotate = ({ touches }) => {
            if (touches.length === 1) {
                this.rotateEnd.set(touches[0].pageX, touches[0].pageY);
            }
            else {
                const x = 0.5 * (touches[0].pageX + touches[1].pageX);
                const y = 0.5 * (touches[0].pageY + touches[1].pageY);
                this.rotateEnd.set(x, y);
            }
            this.rotateDelta
                .subVectors(this.rotateEnd, this.rotateStart)
                .multiplyScalar(this.rotateSpeed);
            this.rotateLeft((2 * Math.PI * this.rotateDelta.x) / this.getElementHeight()); // yes, height
            this.rotateUp((2 * Math.PI * this.rotateDelta.y) / this.getElementHeight());
            this.rotateStart.copy(this.rotateEnd);
        };
        this.handleTouchMoveDolly = ({ touches }) => {
            if (!Array.isArray(touches))
                touches = [];
            if (!touches[0])
                touches[0] = { pageX: 0, pageY: 0 };
            if (!touches[1])
                touches[1] = {
                    pageX: touches[0].pageX || 0,
                    pageY: touches[0].pageY || 0,
                };
            const dx = touches[0].pageX - touches[1].pageX;
            const dy = touches[0].pageY - touches[1].pageY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.dollyEnd.set(0, distance);
            this.dollyDelta.set(0, this.dollyEnd.y / this.dollyStart.y ** this.zoomSpeed);
            this.dollyIn(this.dollyDelta.y);
            this.dollyStart.copy(this.dollyEnd);
        };
        this.handleTouchMoveDollyPan = event => {
            if (this.enableZoom)
                this.handleTouchMoveDolly(event);
        };
        this.handleTouchMoveDollyRotate = event => {
            if (this.enableZoom)
                this.handleTouchMoveDolly(event);
            if (this.enableRotate)
                this.handleTouchMoveRotate(event);
        };
        //
        // event handlers - FSM: listen for events and reset state
        //
        this.onMouseDown = event => {
            var _a, _b;
            if (this.enabled === false)
                return;
            // Prevent the browser from scrolling.
            (_b = (_a = event).preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
            // Manually set the focus since calling preventDefault above
            // prevents the browser from setting it automatically.
            this.domElement.focus ? this.domElement.focus() : window.focus();
            switch (event.button) {
                case 0:
                    switch (this.mouseButtons.LEFT) {
                        case MOUSE.ROTATE:
                            if (this.enableRotate === false)
                                return;
                            this.handleMouseDownRotate(event);
                            this.state = STATE.ROTATE;
                            break;
                        default:
                            this.state = STATE.NONE;
                    }
                    break;
                case 1:
                    switch (this.mouseButtons.MIDDLE) {
                        case MOUSE.DOLLY:
                            if (this.enableZoom === false)
                                return;
                            this.handleMouseDownDolly(event);
                            this.state = STATE.DOLLY;
                            break;
                        default:
                            this.state = STATE.NONE;
                    }
                    break;
                case 2:
                    this.state = STATE.NONE;
                    break;
            }
            if (this.state !== STATE.NONE) {
                if (useDOM) {
                    window.document.addEventListener('mousemove', this.onMouseMove, false);
                    window.document.addEventListener('mouseup', this.onMouseUp, false);
                }
                this.dispatchEvent(this.startEvent);
            }
        };
        this.onMouseMove = event => {
            var _a, _b;
            if (this.enabled === false)
                return;
            (_b = (_a = event).preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
            switch (this.state) {
                case STATE.ROTATE:
                    if (this.enableRotate === false)
                        return;
                    this.handleMouseMoveRotate(event);
                    break;
                case STATE.DOLLY:
                    if (this.enableZoom === false)
                        return;
                    this.handleMouseMoveDolly(event);
                    break;
            }
        };
        this.onMouseUp = event => {
            if (this.enabled === false)
                return;
            this.handleMouseUp( /* event */);
            if (useDOM) {
                window.document.removeEventListener('mousemove', this.onMouseMove, false);
                window.document.removeEventListener('mouseup', this.onMouseUp, false);
            }
            this.dispatchEvent(this.endEvent);
            this.state = STATE.NONE;
        };
        this.onMouseWheel = event => {
            var _a, _b, _c, _d;
            if (this.enabled === false ||
                this.enableZoom === false ||
                (this.state !== STATE.NONE && this.state !== STATE.ROTATE))
                return;
            (_b = (_a = event).preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = event).stopPropagation) === null || _d === void 0 ? void 0 : _d.call(_c);
            this.dispatchEvent(this.startEvent);
            this.handleMouseWheel(event);
            this.dispatchEvent(this.endEvent);
        };
        this.onTouchStart = event => {
            var _a, _b;
            if (this.enabled === false)
                return;
            (_b = (_a = event).preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
            switch (event.touches.length) {
                case 1:
                    switch (this.touches.ONE) {
                        case TOUCH.ROTATE:
                            if (this.enableRotate === false)
                                return;
                            this.handleTouchStartRotate(event);
                            this.state = STATE.TOUCH_ROTATE;
                            break;
                        default:
                            this.state = STATE.NONE;
                    }
                    break;
                case 2:
                    switch (this.touches.TWO) {
                        case TOUCH.DOLLY_PAN:
                            if (this.enableZoom === false)
                                return;
                            this.handleTouchStartDollyPan(event);
                            this.state = STATE.TOUCH_DOLLY_PAN;
                            break;
                        case TOUCH.DOLLY_ROTATE:
                            if (this.enableZoom === false && this.enableRotate === false)
                                return;
                            this.handleTouchStartDollyRotate(event);
                            this.state = STATE.TOUCH_DOLLY_ROTATE;
                            break;
                        default:
                            this.state = STATE.NONE;
                    }
                    break;
                default:
                    this.state = STATE.NONE;
            }
            if (this.state !== STATE.NONE) {
                this.dispatchEvent(this.startEvent);
            }
        };
        this.onTouchMove = event => {
            var _a, _b, _c, _d;
            if (this.enabled === false)
                return;
            (_b = (_a = event).preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = event).stopPropagation) === null || _d === void 0 ? void 0 : _d.call(_c);
            switch (this.state) {
                case STATE.TOUCH_ROTATE:
                    if (this.enableRotate === false)
                        return;
                    this.handleTouchMoveRotate(event);
                    this.update();
                    break;
                case STATE.TOUCH_DOLLY_PAN:
                    if (this.enableZoom === false)
                        return;
                    this.handleTouchMoveDollyPan(event);
                    this.update();
                    break;
                case STATE.TOUCH_DOLLY_ROTATE:
                    if (this.enableZoom === false && this.enableRotate === false)
                        return;
                    this.handleTouchMoveDollyRotate(event);
                    this.update();
                    break;
                default:
                    this.state = STATE.NONE;
            }
        };
        this.onTouchEnd = event => {
            if (this.enabled === false)
                return;
            this.handleTouchEnd( /* event */);
            this.dispatchEvent(this.endEvent);
            this.state = STATE.NONE;
        };
        this.onContextMenu = event => {
            var _a, _b;
            if (this.enabled === false)
                return;
            (_b = (_a = event).preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
        };
        if (ref && Platform.OS === 'web' && typeof window !== 'undefined') {
            this.domElement = getNode(ref) || window.document;
        }
        // for reset
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.zoom0 = this.object.zoom;
        //
        if (this.domElement) {
            this.domElement.addEventListener('contextmenu', this.onContextMenu, false);
            this.domElement.addEventListener('mousedown', this.onMouseDown, false);
            this.domElement.addEventListener('wheel', this.onMouseWheel, false);
            if (useDOM) {
                this.domElement.addEventListener('touchstart', this.onTouchStart, false);
                this.domElement.addEventListener('touchend', this.onTouchEnd, false);
                this.domElement.addEventListener('touchmove', this.onTouchMove, false);
            }
        }
        // force an update at start
        this.update = (() => {
            const offset = new Vector3();
            // so camera.up is the orbit axis
            const quat = new Quaternion().setFromUnitVectors(this.object.up, new Vector3(0, 1, 0));
            const quatInverse = quat.clone().invert();
            const lastPosition = new Vector3();
            const lastQuaternion = new Quaternion();
            
            return () => {
                const position = this.object.position;
                const target = this.target;
                //offset.copy(position).sub(this.target);
                offset.copy(target);
                // rotate offset to "y-axis-is-up" space
                offset.applyQuaternion(quat);
                // angle from z-axis around y-axis
                this.spherical.setFromVector3(offset);

                this.spherical.theta += this.sphericalDelta.theta;
                this.spherical.phi += this.sphericalDelta.phi;
                
                // restrict theta to be between desired limits
                this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
                // restrict phi to be between desired limits
                this.spherical.phi = Math.max(this.verticalMin, Math.min(this.verticalMax, this.spherical.phi));
                this.spherical.makeSafe();
                this.spherical.radius *= this.scale;
                // restrict radius to be between desired limits
                this.spherical.radius = Math.max(this.minZoom, Math.min(this.maxZoom, this.spherical.radius));
                
                offset.setFromSpherical(this.spherical);
                // rotate offset back to "camera-up-vector-is-up" space
                offset.applyQuaternion(quatInverse);
                //position.copy(this.target).add(offset);
                target.copy(position).add(offset);
                this.object.lookAt(this.target);

                this.sphericalDelta.set(0, 0, 0);

                this.scale = 1;
                // update condition is:
                // min(camera displacement, camera rotation in radians)^2 > this.EPS
                // using small-angle approximation cos(x/2) = 1 - x^2 / 8
                if (this.zoomChanged ||
                    lastPosition.distanceToSquared(this.target) > EPS ||
                    8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS) {
                    this.dispatchEvent(this.changeEvent);
                    lastPosition.copy(this.target);
                    lastQuaternion.copy(this.object.quaternion);
                    this.zoomChanged = false;
                    return true;
                }
                return false;
            };
        })();
        this.update();
    }
    handleMouseUp( /*event*/) {
        // no-op
    }
    handleTouchEnd( /*event*/) {
        // no-op
    }
}
//# sourceMappingURL=StarControls.js.map