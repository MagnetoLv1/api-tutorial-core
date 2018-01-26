import { Classes } from './Classes';
import { EventEmitter } from 'events';

export class Dragula {

  _mirror; // mirror image
  _source; // source container
  _item; // item being dragged
  _offsetX; // reference x
  _offsetY; // reference y
  _moveX; // reference move x                               
  _moveY; // reference move y                              
  _initialSibling; // reference sibling when grabbed        
  _currentSibling; // reference sibling now                 
  _copy; // item used for copying                           
  _renderTimer; // timer for setTimeout renderMirrorImage   
  _lastDropTarget = null; // last container item was over   
  _grabbed; // holds mousedown context until first mousemove
  doc = document;
  documentElement = document.documentElement;
  drake: EventEmitter;
  options: any = {};
  dragging: boolean = false;
  models:any;

  constructor(initialContainers, options?) {
    
    let len = arguments.length;
    if (len === 1 && Array.isArray(initialContainers) === false) {
      options = initialContainers;
      initialContainers = [];
    }

    this.options = options || {};
    if (this.options.moves === void 0) { this.options.moves = this.always; }
    if (this.options.accepts === void 0) { this.options.accepts = this.always; }
    if (this.options.invalid === void 0) { this.options.invalid = this.invalidTarget; }
    if (this.options.containers === void 0) { this.options.containers = initialContainers || []; }
    if (this.options.isContainer === void 0) { this.options.isContainer = this.never; }
    if (this.options.copy === void 0) { this.options.copy = false; }
    if (this.options.copySortSource === void 0) { this.options.copySortSource = false; }
    if (this.options.revertOnSpill === void 0) { this.options.revertOnSpill = false; }
    if (this.options.removeOnSpill === void 0) { this.options.removeOnSpill = false; }
    if (this.options.direction === void 0) { this.options.direction = 'vertical'; }
    if (this.options.ignoreInputTextSelection === void 0) { this.options.ignoreInputTextSelection = true; }
    if (this.options.mirrorContainer === void 0) { this.options.mirrorContainer = this.doc.body; }

    this.drake = new EventEmitter();
    this.drake.on('start', this.manualStart);
    this.drake.on('end', this.end);
    this.drake.on('cancel', this.cancel);
    this.drake.on('remove', this.remove);
    this.drake.on('destroy', this.destroy);
    this.drake.on('canMove', this.canMove);


    if (this.options.removeOnSpill === true) {
      this.drake.on('over', this.spillOver).on('out', this.spillOut);
    }

    this.events();
  }


  isContainer(el) {
    return this.options.isContainer(el);
  }

  events(remove?) {
    let op = remove ? 'remove' : 'add';
    this.touchy(this.documentElement, op, 'mousedown', this.grab);
    this.touchy(this.documentElement, op, 'mouseup', this.release);
  }

  eventualMovements(remove?) {
    let op = remove ? 'remove' : 'add';
    this.touchy(this.documentElement, op, 'mousemove', this.startBecauseMouseMoved);
  }

  movements(remove?) {
    let op = remove ? 'remove' : 'add';
    if (remove) {
      this.documentElement.removeEventListener('selectstart', this.preventGrabbed);
      this.documentElement.removeEventListener('click', this.preventGrabbed);
    } else {
      this.documentElement.addEventListener('selectstart', this.preventGrabbed);
      this.documentElement.addEventListener('click', this.preventGrabbed);

    }
  }

  destroy() {
    this.events(true);
    this.release({});
  }

   preventGrabbed (e) {
    if (this._grabbed) {
      e.preventDefault();
    }
  }

  grab(e) {
    this._moveX = e.clientX;
    this._moveY = e.clientY;

    let ignore = this.whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
    if (ignore) {
      return; // we only care about honest-to-god left clicks and touch events
    }
    let item = e.target;
    let context = this.canStart(item);
    if (!context) {
      return;
    }
    this._grabbed = context;
    this.eventualMovements();
    if (e.type === 'mousedown') {
      if (this.isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
        item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
      } else {
        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
      }
    }
  }

  startBecauseMouseMoved(e) {
    if (!this._grabbed) {
      return;
    }
    if (this.whichMouseButton(e) === 0) {
      this.release({});
      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }
    // truthy check fixes #239, equality fixes #207
    if (e.clientX !== void 0 && e.clientX === this._moveX && e.clientY !== void 0 && e.clientY === this._moveY) {
      return;
    }
    if (this.options.ignoreInputTextSelection) {
      let clientX = this.getCoord('clientX', e);
      let clientY = this.getCoord('clientY', e);
      let elementBehindCursor = this.doc.elementFromPoint(clientX, clientY);
      if (this.isInput(elementBehindCursor)) {
        return;
      }
    }

    let grabbed = this._grabbed; // call to end() unsets this._grabbed
    this.eventualMovements(true);
    this.movements();
    this.end();
    this.start(grabbed);

    let offset = this.getOffset(this._item);
    this._offsetX = this.getCoord('pageX', e) - offset.left;
    this._offsetY = this.getCoord('pageY', e) - offset.top;

    Classes.add(this._copy || this._item, 'gu-transit');
    this.renderMirrorImage();
    this.drag(e);
  }

  canStart(item) {
    if (this.dragging && this._mirror) {
      return;
    }
    if (this.isContainer(item)) {
      return; // don't drag container itself
    }
    let handle = item;
    while (this.getParent(item) && this.isContainer(this.getParent(item)) === false) {
      if (this.options.invalid(item, handle)) {
        return;
      }
      item = this.getParent(item); // drag target should be a top element
      if (!item) {
        return;
      }
    }
    let source = this.getParent(item);
    if (!source) {
      return;
    }
    if (this.options.invalid(item, handle)) {
      return;
    }

    let movable = this.options.moves(item, source, handle, this.nextEl(item));
    if (!movable) {
      return;
    }

    return {
      item: item,
      source: source
    };
  }

  canMove(item) {
    return !!this.canStart(item);
  }

  manualStart(item) {
    let context = this.canStart(item);
    if (context) {
      this.start(context);
    }
  }

  start(context) {
    if (this.isCopy(context.item, context.source)) {
      this._copy = context.item.cloneNode(true);
      this.drake.emit('cloned', this._copy, context.item, 'copy');
    }

    this._source = context.source;
    this._item = context.item;
    this._initialSibling = this._currentSibling = this.nextEl(context.item);

    this.dragging = true;
    this.drake.emit('drag', this._item, this._source);
  }

  invalidTarget() {
    return false;
  }

  end() {
    if (!this.dragging) {
      return;
    }
    let item = this._copy || this._item;
    this.drop(item, this.getParent(item));
  }

  ungrab() {
    this._grabbed = false;
    this.eventualMovements(true);
    this.movements(true);
  }

  release(e) {
    this.ungrab();

    if (!this.dragging) {
      return;
    }
    let item = this._copy || this._item;
    let clientX = this.getCoord('clientX', e);
    let clientY = this.getCoord('clientY', e);
    let elementBehindCursor = this.getElementBehindPoint(this._mirror, clientX, clientY);
    let dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);
    if (dropTarget && ((this._copy && this.options.copySortSource) || (!this._copy || dropTarget !== this._source))) {
      this.drop(item, dropTarget);
    } else if (this.options.removeOnSpill) {
      this.remove();
    } else {
      this.cancel();
    }
  }

  drop(item, target) {
    let parent = this.getParent(item);
    if (this._copy && this.options.copySortSource && target === this._source) {
      parent.removeChild(this._item);
    }
    if (this.isInitialPlacement(target)) {
      this.drake.emit('cancel', item, this._source, this._source);
    } else {
      this.drake.emit('drop', item, target, this._source, this._currentSibling);
    }
    this.cleanup();
  }

  remove() {
    if (!this.dragging) {
      return;
    }
    let item = this._copy || this._item;
    let parent = this.getParent(item);
    if (parent) {
      parent.removeChild(item);
    }
    this.drake.emit(this._copy ? 'cancel' : 'remove', item, parent, this._source);
    this.cleanup();
  }

  cancel(revert?) {
    if (!this.dragging) {
      return;
    }
    let reverts = arguments.length > 0 ? revert : this.options.revertOnSpill;
    let item = this._copy || this._item;
    let parent = this.getParent(item);
    let initial = this.isInitialPlacement(parent);
    if (initial === false && reverts) {
      if (this._copy) {
        if (parent) {
          parent.removeChild(this._copy);
        }
      } else {
        this._source.insertBefore(item, this._initialSibling);
      }
    }
    if (initial || reverts) {
      this.drake.emit('cancel', item, this._source, this._source);
    } else {
      this.drake.emit('drop', item, parent, this._source, this._currentSibling);
    }
    this.cleanup();
  }

  cleanup() {
    let item = this._copy || this._item;
    this.ungrab();
    this.removeMirrorImage();
    if (item) {
      Classes.rm(item, 'gu-transit');
    }
    if (this._renderTimer) {
      clearTimeout(this._renderTimer);
    }
    this.dragging = false;
    if (this._lastDropTarget) {
      this.drake.emit('out', item, this._lastDropTarget, this._source);
    }
    this.drake.emit('dragend', item);
    this._source = this._item = this._copy = this._initialSibling = this._currentSibling = this._renderTimer = this._lastDropTarget = null;
  }

  isInitialPlacement(target, s?) {
    let sibling;
    if (s !== void 0) {
      sibling = s;
    } else if (this._mirror) {
      sibling = this._currentSibling;
    } else {
      sibling = this.nextEl(this._copy || this._item);
    }
    return target === this._source && sibling === this._initialSibling;
  }

  findDropTarget(elementBehindCursor, clientX, clientY) {
    let target = elementBehindCursor;
    while (target && !this.accepted(target, elementBehindCursor, clientX, clientY)) {
      target = this.getParent(target);
    }
    return target;

  }

  accepted(target, elementBehindCursor, clientX, clientY) {
    let droppable = this.isContainer(target);
    if (droppable === false) {
      return false;
    }

    let immediate = this.getImmediateChild(target, elementBehindCursor);
    let reference = this.getReference(target, immediate, clientX, clientY);
    let initial = this.isInitialPlacement(target, reference);
    if (initial) {
      return true; // should this.always be able to drop it right back where it was
    }
    return this.options.accepts(this._item, target, this._source, reference);
  }

  drag(e) {
    if (!this._mirror) {
      return;
    }
    e.preventDefault();

    let clientX = this.getCoord('clientX', e);
    let clientY = this.getCoord('clientY', e);
    let x = clientX - this._offsetX;
    let y = clientY - this._offsetY;

    this._mirror.style.left = x + 'px';
    this._mirror.style.top = y + 'px';

    let item = this._copy || this._item;
    let elementBehindCursor = this.getElementBehindPoint(this._mirror, clientX, clientY);
    let dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);
    let changed = dropTarget !== null && dropTarget !== this._lastDropTarget;
    if (changed || dropTarget === null) {
      this.out(item);
      this._lastDropTarget = dropTarget;
      this.over(item, changed);
    }
    let parent = this.getParent(item);
    if (dropTarget === this._source && this._copy && !this.options.copySortSource) {
      if (parent) {
        parent.removeChild(item);
      }
      return;
    }
    let reference;
    let immediate = this.getImmediateChild(dropTarget, elementBehindCursor);
    if (immediate !== null) {
      reference = this.getReference(dropTarget, immediate, clientX, clientY);
    } else if (this.options.revertOnSpill === true && !this._copy) {
      reference = this._initialSibling;
      dropTarget = this._source;
    } else {
      if (this._copy && parent) {
        parent.removeChild(item);
      }
      return;
    }
    if (
      (reference === null && changed) ||
      reference !== item &&
      reference !== this.nextEl(item)
    ) {
      this._currentSibling = reference;
      dropTarget.insertBefore(item, reference);
      this.drake.emit('shadow', item, dropTarget, this._source);
    }
  }
  over(item, changed) {
    if (changed) {
      this.drake.emit('over', item, this._lastDropTarget, this._source);
    }
  }
  out(item) {
    if (this._lastDropTarget) {
      this.drake.emit('out', item, this._lastDropTarget, this._source);
    }
  }

  spillOver(el) {
    Classes.rm(el, 'gu-hide');
  }

  spillOut(el) {
    if (this.dragging) { Classes.add(el, 'gu-hide'); }
  }

  renderMirrorImage() {
    if (this._mirror) {
      return;
    }
    let rect = this._item.getBoundingClientRect();
    this._mirror = this._item.cloneNode(true);
    this._mirror.style.width = this.getRectWidth(rect) + 'px';
    this._mirror.style.height = this.getRectHeight(rect) + 'px';
    Classes.rm(this._mirror, 'gu-transit');
    Classes.add(this._mirror, 'gu-mirror');
    this.options.mirrorContainer.appendChild(this._mirror);
    this.touchy(this.documentElement, 'add', 'mousemove', this.drag);
    Classes.add(this.options.mirrorContainer, 'gu-unselectable');
    this.drake.emit('cloned', this._mirror, this._item, 'mirror');
  }

  removeMirrorImage() {
    if (this._mirror) {
      Classes.rm(this.options.mirrorContainer, 'gu-unselectable');
      this.touchy(this.documentElement, 'remove', 'mousemove', this.drag);
      this.getParent(this._mirror).removeChild(this._mirror);
      this._mirror = null;
    }
  }

  getImmediateChild(dropTarget, target) {
    let immediate = target;
    while (immediate !== dropTarget && this.getParent(immediate) !== dropTarget) {
      immediate = this.getParent(immediate);
    }
    if (immediate === this.documentElement) {
      return null;
    }
    return immediate;
  }

  getReference(dropTarget, target, x, y) {
    let horizontal = this.options.direction === 'horizontal';
    let reference = target !== dropTarget ? this.inside(horizontal, target, x, y) : this.outside(horizontal, dropTarget, x, y);
    return reference;


  }

  outside(horizontal, dropTarget, x, y) { // slower, but able to figure out any position
    let len = dropTarget.children.length;
    let i;
    let el;
    let rect;
    for (i = 0; i < len; i++) {
      el = dropTarget.children[i];
      rect = el.getBoundingClientRect();
      if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
      if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
    }
    return null;
  }

  inside(horizontal, target, x, y) { // faster, but only available if dropped inside a child element
    let rect = target.getBoundingClientRect();
    if (horizontal) {
      return this.resolve(target, x > rect.left + this.getRectWidth(rect) / 2);
    }
    return this.resolve(target, y > rect.top + this.getRectHeight(rect) / 2);
  }

  resolve(target, after) {
    return after ? this.nextEl(target) : target;
  }

  isCopy(item, container) {
    return typeof this.options.copy === 'boolean' ? this.options.copy : this.options.copy(item, container);
  }

  touchy(el, op, type, fn) {
    let touch = {
      mouseup: 'touchend',
      mousedown: 'touchstart',
      mousemove: 'touchmove'
    };
    let pointers = {
      mouseup: 'pointerup',
      mousedown: 'pointerdown',
      mousemove: 'pointermove'
    };
    let microsoft = {
      mouseup: 'MSPointerUp',
      mousedown: 'MSPointerDown',
      mousemove: 'MSPointerMove'
    };
    if (navigator.pointerEnabled) {
      if (op == 'add') {
        el.addEventListener(pointers[type], fn);
      } else {
        el.removeEventListener(pointers[type], fn);
      }
    } else if (navigator.msPointerEnabled) {
      if (op == 'add') {
        el.addEventListener(microsoft[type], fn);
      } else {
        el.removeEventListener(microsoft[type], fn);
      }
    } else {
      if (op == 'add') {
        el.addEventListener( touch[type], fn);
        el.addEventListener( type, fn);
      } else {
        el.removeEventListener(touch[type], fn);
        el.removeEventListener(type, fn);
      }
    }
  }

  whichMouseButton(e) {
    if (e.touches !== void 0) { return e.touches.length; }
    if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
    if (e.buttons !== void 0) { return e.buttons; }
    let button = e.button;
    if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
      return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
    }


  }

  getOffset(el) {
    let rect = el.getBoundingClientRect();
    return {
      left: rect.left + this.getScroll('scrollLeft', 'pageXOffset'),
      top: rect.top + this.getScroll('scrollTop', 'pageYOffset')
    };
  }

  getScroll(scrollProp, offsetProp) {
    if (typeof global[offsetProp] !== 'undefined') {
      return global[offsetProp];
    }
    if (this.documentElement.clientHeight) {
      return this.documentElement[scrollProp];
    }
    return this.doc.body[scrollProp];
  }

  getElementBehindPoint(point, x, y) {
    let p = point || {};
    let state = p.className;
    let el;
    p.className += ' gu-hide';
    el = this.doc.elementFromPoint(x, y);
    p.className = state;
    return el;
  }

  never() { return false; }
  always() { return true; }
  getRectWidth(rect) { return rect.width || (rect.right - rect.left); }
  getRectHeight(rect) { return rect.height || (rect.bottom - rect.top); }
  getParent(el) { return el.parentNode === this.doc ? null : el.parentNode; }
  isInput(el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || this.isEditable(el); }
  isEditable(el) {
    if (!el) { return false; } // no parents were editable
    if (el.contentEditable === 'false') { return false; } // stop the lookup
    if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
    return this.isEditable(this.getParent(el)); // contentEditable is set to 'inherit'
  }

  nextEl(el) {
    return el.nextElementSibling || function () {
      let sibling = el;
      do {
        sibling = sibling.nextSibling;
      } while (sibling && sibling.nodeType !== 1);
      return sibling;

    };
  }


  getEventHost(e) {
    // on touchend event, we have to use `e.changedTouches`
    // see http://stackoverflow.com/questions/7192563/touchend-event-properties
    // see https://github.com/bevacqua/dragula/issues/34
    if (e.targetTouches && e.targetTouches.length) {
      return e.targetTouches[0];
    }
    if (e.changedTouches && e.changedTouches.length) {
      return e.changedTouches[0];
    }
    return e;
  }

  getCoord(coord, e) {
    let host = this.getEventHost(e);
    let missMap = {
      pageX: 'clientX', // IE8
      pageY: 'clientY' // IE8
    };
    if (coord in missMap && !(coord in host) && missMap[coord] in host) {
      coord = missMap[coord];
    }
    return host[coord];
  }

}
