'use strict';

export class Classes {
  static cache = {};
  
  static lookupClass(className) {
    let start = '(?:^|\\s)';
    let end = '(?:\\s|$)';
    var cached = this.cache[className];
    if (cached) {
      cached.lastIndex = 0;
    } else {
      this.cache[className] = cached = new RegExp(start + className + end, 'g');
    }
    return cached;
  }

  static add(el, className) {
    var current = el.className;
    if (!current.length) {
      el.className = className;
    } else if (!this.lookupClass(className).test(current)) {
      el.className += ' ' + className;
    }
  }

  static rm(el, className) {
    el.className = el.className.replace(this.lookupClass(className), ' ').trim();
  }
}
