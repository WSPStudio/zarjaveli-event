(() => {
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // src/assets/libs/js/dynamic.js
  var _TransferElements_instances, assembleBreakpoints_fn, getChildElementsOfTargetElement_fn, getBreakpointTrigger_fn, getScrollbarWidth_fn, getObjectType_fn, isTargetElementDescendantOfSourceElement_fn, isTagOfTargetElementSelfClosing_fn, sortBreakpointObjects_fn, removeSourceElements_fn, insertSourceElements_fn, throwExceptionIfMaximumTargetPositionIsExceeded_fn, generateBreakpointObject_fn;
  var TransferElements = class {
    constructor(...objectsWithParameters) {
      __privateAdd(this, _TransferElements_instances);
      if (objectsWithParameters.length === 0) {
        throw TypeError("at least one object with parameters must be specified for the constructor");
      }
      const sourceElementsData = [];
      const validatedObjectsWithParameters = objectsWithParameters.map(
        (objectWithParameters) => {
          if (__privateMethod(this, _TransferElements_instances, getObjectType_fn).call(this, objectWithParameters) !== "[object Object]") {
            throw TypeError(`the arguments specified for the constructor must be objects of type 'Object'`);
          }
          ["sourceElement", "breakpoints"].forEach((parameterKey) => {
            if (!Object.hasOwn(objectWithParameters, parameterKey)) {
              throw TypeError(`the '${parameterKey}' parameter is not specified for the main object`);
            }
          });
          const { sourceElement, breakpoints: breakpoints2 } = objectWithParameters;
          if (!(sourceElement instanceof Element)) {
            throw TypeError(`the value specified for the 'sourceElement' parameter must be an object of type 'Element'`);
          }
          if (sourceElementsData.some((data) => data.sourceElement === sourceElement)) {
            throw TypeError(`there can only be one object in the constructor with such a 'sourceElement': '${sourceElement.cloneNode().outerHTML}'`);
          }
          const initialParent = sourceElement.parentElement;
          const initialNextSibling = sourceElement.nextElementSibling;
          sourceElementsData.push({
            sourceElement,
            initialParent,
            initialNextSibling
          });
          objectWithParameters.breakpoints = __privateMethod(this, _TransferElements_instances, assembleBreakpoints_fn).call(this, breakpoints2, sourceElement);
          return objectWithParameters;
        }
      );
      const sortedBreakpointTriggers = [...validatedObjectsWithParameters.reduce(
        (collection, { breakpoints: breakpoints2 }) => {
          Object.keys(breakpoints2).forEach((breakpointTrigger) => {
            if (Number(breakpointTrigger)) {
              collection.add(breakpointTrigger);
            }
          });
          return collection;
        },
        /* @__PURE__ */ new Set()
      ).add("default")].sort((a, b) => a - b);
      const storageOfBreakpoints = sortedBreakpointTriggers.reduce(
        (storage, breakpointTrigger) => {
          storage.set(breakpointTrigger, []);
          return storage;
        },
        /* @__PURE__ */ new Map()
      );
      validatedObjectsWithParameters.forEach(
        ({ sourceElement, breakpoints: breakpoints2 }) => {
          Object.entries(breakpoints2).forEach(
            ([breakpointTrigger, { targetElement, targetPosition }]) => {
              storageOfBreakpoints.get(breakpointTrigger).push({
                sourceElement,
                targetElement,
                targetPosition
              });
            }
          );
        }
      );
      storageOfBreakpoints.forEach((breakpointObjects) => {
        __privateMethod(this, _TransferElements_instances, sortBreakpointObjects_fn).call(this, breakpointObjects);
        __privateMethod(this, _TransferElements_instances, removeSourceElements_fn).call(this, breakpointObjects);
        __privateMethod(this, _TransferElements_instances, insertSourceElements_fn).call(this, breakpointObjects, true);
        breakpointObjects.length = 0;
        sourceElementsData.forEach(({ sourceElement }) => {
          breakpointObjects.push(__privateMethod(this, _TransferElements_instances, generateBreakpointObject_fn).call(this, sourceElement, true));
        });
        __privateMethod(this, _TransferElements_instances, sortBreakpointObjects_fn).call(this, breakpointObjects);
      });
      let previousBreakpointTrigger = "default";
      const resizeObserver = new ResizeObserver(
        ([{ borderBoxSize: [{ inlineSize }], target }]) => {
          const currentWidth = inlineSize + __privateMethod(this, _TransferElements_instances, getScrollbarWidth_fn).call(this, target);
          const currentBreakpointTrigger = __privateMethod(this, _TransferElements_instances, getBreakpointTrigger_fn).call(this, sortedBreakpointTriggers, currentWidth);
          if (previousBreakpointTrigger !== currentBreakpointTrigger) {
            const breakpointObjects = storageOfBreakpoints.get(
              currentBreakpointTrigger
            );
            __privateMethod(this, _TransferElements_instances, removeSourceElements_fn).call(this, breakpointObjects);
            if (currentBreakpointTrigger === "default") {
              sourceElementsData.forEach(({ sourceElement, initialParent, initialNextSibling }) => {
                if (initialParent) {
                  try {
                    if (initialNextSibling && initialNextSibling.parentNode === initialParent) {
                      initialParent.insertBefore(sourceElement, initialNextSibling);
                    } else {
                      initialParent.appendChild(sourceElement);
                    }
                  } catch (e) {
                    console.error("TransferElements: insertBefore failed", {
                      sourceElement,
                      initialParent,
                      initialNextSibling,
                      error: e
                    });
                    initialParent.appendChild(sourceElement);
                  }
                }
              });
            } else {
              __privateMethod(this, _TransferElements_instances, insertSourceElements_fn).call(this, breakpointObjects, false);
            }
            previousBreakpointTrigger = currentBreakpointTrigger;
          }
        }
      );
      resizeObserver.observe(document.documentElement);
    }
  };
  _TransferElements_instances = new WeakSet();
  assembleBreakpoints_fn = function(breakpoints2, sourceElement) {
    if (__privateMethod(this, _TransferElements_instances, getObjectType_fn).call(this, breakpoints2) !== "[object Object]") {
      throw TypeError(`the value specified for the 'breakpoints' parameter must be an object of type 'Object'`);
    }
    const breakpointEntries = Object.entries(breakpoints2);
    if (breakpointEntries.length === 0) {
      throw TypeError(`at least one breakpoint must be specified for the 'breakpoints' object`);
    }
    const validatedBreakpoints = Object.fromEntries(
      breakpointEntries.map(
        ([breakpointTrigger, breakpointObject]) => {
          const breakpointTriggerAsNumber = Number(breakpointTrigger);
          if (!breakpointTriggerAsNumber || breakpointTriggerAsNumber <= 0 || breakpointTriggerAsNumber > Number.MAX_SAFE_INTEGER) {
            throw RangeError(`the breakpoint trigger must be a safe (integer or fractional) number greater than zero`);
          }
          if (__privateMethod(this, _TransferElements_instances, getObjectType_fn).call(this, breakpointObject) !== "[object Object]") {
            throw TypeError(`the breakpoint object must be of type 'Object'`);
          }
          if (!Object.hasOwn(breakpointObject, "targetElement")) {
            throw TypeError(`the 'targetElement' parameter is not specified for the breakpoint object`);
          }
          const { targetElement, targetPosition } = breakpointObject;
          if (!(targetElement instanceof Element)) {
            throw TypeError(`the value specified for the 'targetElement' parameter must be an object of type 'Element'`);
          }
          if (sourceElement === targetElement) {
            throw TypeError(`the value specified for the 'targetElement' parameter must be different from the value specified for the 'sourceElement' parameter`);
          }
          if (__privateMethod(this, _TransferElements_instances, isTargetElementDescendantOfSourceElement_fn).call(this, targetElement, sourceElement)) {
            throw TypeError(`the element that is specified as the value for the 'targetElement' parameter must not be a descendant of the element specified as the value for the 'sourceElement' parameter`);
          }
          if (__privateMethod(this, _TransferElements_instances, isTagOfTargetElementSelfClosing_fn).call(this, targetElement)) {
            throw TypeError(`the element specified as the value for the 'targetElement' parameter must be a paired tag`);
          }
          let targetPos = typeof breakpointTrigger == "number" ? breakpointTrigger : 0;
          if (typeof breakpointTrigger != "number") {
            if (breakpointTrigger == "first") {
              targetPos = 0;
            } else if (breakpointTrigger == "last") {
              targetPos = targetElement.children.length;
            } else {
              targetPos = 0;
            }
          }
          return [
            breakpointTriggerAsNumber,
            {
              targetPosition: targetPos,
              ...breakpointObject
            }
          ];
        }
      )
    );
    validatedBreakpoints.default = __privateMethod(this, _TransferElements_instances, generateBreakpointObject_fn).call(this, sourceElement, false);
    return validatedBreakpoints;
  };
  getChildElementsOfTargetElement_fn = function(targetElement) {
    return targetElement.children;
  };
  getBreakpointTrigger_fn = function(breakpointTriggers, currentWidth) {
    let startIndex = 0;
    let endIndex = breakpointTriggers.length - 2;
    let savedBreakpointTrigger;
    while (startIndex <= endIndex) {
      const middleIndex = Math.floor((startIndex + endIndex) / 2);
      const guessedBreakpointTrigger = breakpointTriggers[middleIndex];
      if (guessedBreakpointTrigger == currentWidth) {
        return guessedBreakpointTrigger;
      } else if (guessedBreakpointTrigger > currentWidth) {
        endIndex = middleIndex - 1;
      } else {
        startIndex = middleIndex + 1;
      }
      if (guessedBreakpointTrigger - currentWidth > 0) {
        savedBreakpointTrigger = guessedBreakpointTrigger;
      }
    }
    return savedBreakpointTrigger != null ? savedBreakpointTrigger : "default";
  };
  getScrollbarWidth_fn = function(observableElement) {
    const viewportWidth = window.innerWidth;
    const widthOfObservableElement = Math.min(
      observableElement.clientWidth,
      observableElement.offsetWidth
    );
    let scrollbarWidth = 0;
    if (widthOfObservableElement !== viewportWidth) {
      scrollbarWidth += viewportWidth - widthOfObservableElement;
    }
    return scrollbarWidth;
  };
  getObjectType_fn = function(object) {
    return Object.prototype.toString.call(object);
  };
  isTargetElementDescendantOfSourceElement_fn = function(targetElement, sourceElement) {
    while (targetElement = targetElement.parentElement) {
      if (targetElement === sourceElement) {
        return true;
      }
    }
    return false;
  };
  isTagOfTargetElementSelfClosing_fn = function(targetElement) {
    return !new RegExp(/<\/[a-zA-Z]+>$/).test(targetElement.outerHTML);
  };
  sortBreakpointObjects_fn = function(breakpointObjects) {
    if (breakpointObjects.length > 1) {
      breakpointObjects.sort((a, b) => a.targetPosition - b.targetPosition);
    }
  };
  removeSourceElements_fn = function(breakpointObjects) {
    breakpointObjects.forEach(({ sourceElement }) => {
      sourceElement.remove();
    });
  };
  insertSourceElements_fn = function(breakpointObjects, hasCheckOfMaximumTargetPosition) {
    breakpointObjects.forEach(
      ({ sourceElement, targetElement, targetPosition }) => {
        const childElementsOfTargetElement = __privateMethod(this, _TransferElements_instances, getChildElementsOfTargetElement_fn).call(this, targetElement);
        if (hasCheckOfMaximumTargetPosition) {
          __privateMethod(this, _TransferElements_instances, throwExceptionIfMaximumTargetPositionIsExceeded_fn).call(this, childElementsOfTargetElement, targetPosition);
        }
        const childElementOfTargetElement = childElementsOfTargetElement[targetPosition];
        if (childElementOfTargetElement && childElementOfTargetElement.parentNode === targetElement) {
          targetElement.insertBefore(sourceElement, childElementOfTargetElement);
        } else {
          targetElement.append(sourceElement);
        }
      }
    );
  };
  throwExceptionIfMaximumTargetPositionIsExceeded_fn = function(childElementsOfTargetElement, targetPosition) {
    const maximumTargetPosition = childElementsOfTargetElement.length;
  };
  generateBreakpointObject_fn = function(sourceElement, isComplete) {
    const parentElementOfSourceElement = sourceElement.parentElement;
    const currentIndex = parentElementOfSourceElement ? Array.from(parentElementOfSourceElement.children).indexOf(sourceElement) : -1;
    const breakpointObject = {
      targetElement: parentElementOfSourceElement,
      targetPosition: currentIndex
    };
    if (isComplete) {
      breakpointObject.sourceElement = sourceElement;
    }
    return breakpointObject;
  };
  document.addEventListener("DOMContentLoaded", () => {
    let dataDa = document.querySelectorAll("[data-da]");
    dataDa.forEach((item) => {
      let daMedia = item.getAttribute("data-da").split("|");
      let breakpoints2 = {};
      daMedia.forEach((media) => {
        let [daTarget, daBreakpoint, daPos] = media.split(",");
        if (daPos === "first") daPos = 0;
        function getTargetElement(selector, context = document) {
          let parts = selector.trim().split(" ");
          let currentContext = context;
          for (let part of parts) {
            let match = part.match(/(.+?)\[(\d+)\]/);
            if (match) {
              let baseSelector = match[1];
              let index = parseInt(match[2]);
              let elements = currentContext.querySelectorAll(baseSelector);
              currentContext = elements[index] || null;
            } else {
              currentContext = currentContext.querySelector(part);
            }
            if (!currentContext) break;
          }
          return currentContext;
        }
        let daTargetElement = getTargetElement(daTarget);
        if (daTargetElement) {
          breakpoints2[daBreakpoint] = {
            targetElement: daTargetElement,
            targetPosition: daPos
          };
        }
      });
      new TransferElements({
        sourceElement: item,
        breakpoints: breakpoints2
      });
    });
  });

  // src/assets/libs/js/mask.js
  window.maskPhone = maskPhone;
  window.addEventListener("DOMContentLoaded", () => {
    maskPhone();
  });
  function maskPhone() {
    const phoneInputs = document.querySelectorAll('[type="tel"]');
    phoneInputs.forEach((input) => {
      input.setAttribute("data-original-placeholder", input.placeholder);
      input.addEventListener("focus", function() {
        setTimeout(() => {
          input.setSelectionRange(input.value.length, input.value.length);
        }, 0);
      });
      input.addEventListener("blur", function() {
        if (input.value == "+7 (") {
          input.value = "";
          input.placeholder = input.getAttribute("data-original-placeholder");
        }
      });
      input.addEventListener("input", function(event2) {
        input.setCustomValidity("");
        const isDelete = event2.inputType === "deleteContentBackward";
        const raw = input.value;
        const digits = raw.replace(/\D/g, "");
        if (isDelete) {
          return;
        }
        const formatted = formatWithMask(digits);
        input.value = formatted;
        setTimeout(() => {
          const pos = input.value.indexOf("_");
          setCursorPosition(input, pos === -1 ? input.value.length : pos);
        }, 0);
      });
      input.addEventListener("change", function() {
        const digits = input.value.replace(/\D/g, "");
        if (digits.length === 0) {
          input.setCustomValidity("");
          input.classList.remove("error");
          return;
        }
        if (digits.length !== 11) {
          if (input.hasAttribute("required")) {
            input.setCustomValidity("\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C 11 \u0446\u0438\u0444\u0440");
          } else {
            input.setCustomValidity("");
          }
          input.classList.add("error");
        } else {
          input.setCustomValidity("");
          input.classList.remove("error");
        }
      });
      input.addEventListener("paste", function(e) {
        e.preventDefault();
        let pasted = (e.clipboardData || window.clipboardData).getData("text");
        pasted = pasted.replace(/\D/g, "");
        input.value = formatWithMask(pasted);
      });
    });
  }
  function formatWithMask(digits) {
    if (!digits) return "";
    if (digits[0] !== "7" && digits[0] !== "8") {
      digits = "7" + digits;
    }
    const mask = digits[0] === "8" ? "8 (___) ___ __ __" : "+7 (___) ___ __ __";
    let i = 0;
    let formatted = "";
    for (const char of mask) {
      if (i >= digits.length) break;
      if (char === "_" || /\d/.test(char)) {
        formatted += digits[i++];
      } else {
        formatted += char;
      }
    }
    return formatted;
  }
  function setCursorPosition(el, pos) {
    el.setSelectionRange(pos, pos);
  }

  // src/assets/libs/js/splide.js
  function r(n2, t2) {
    for (var i = 0; i < t2.length; i++) {
      var r2 = t2[i];
      r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(n2, r2.key, r2);
    }
  }
  function Jt(n2, t2, i) {
    t2 && r(n2.prototype, t2), i && r(n2, i), Object.defineProperty(n2, "prototype", { writable: false });
  }
  var n;
  var t;
  n = void 0, t = function() {
    "use strict";
    var v = "(prefers-reduced-motion: reduce)", G = 4, rn = 5, r2 = { CREATED: 1, MOUNTED: 2, IDLE: 3, MOVING: G, SCROLLING: rn, DRAGGING: 6, DESTROYED: 7 };
    function D(n3) {
      n3.length = 0;
    }
    function o(n3, t3, i2) {
      return Array.prototype.slice.call(n3, t3, i2);
    }
    function R(n3) {
      return n3.bind.apply(n3, [null].concat(o(arguments, 1)));
    }
    function on() {
    }
    var p = setTimeout;
    function h(n3) {
      return requestAnimationFrame(n3);
    }
    function u(n3, t3) {
      return typeof t3 === n3;
    }
    function un(n3) {
      return !c(n3) && u("object", n3);
    }
    var e = Array.isArray, x = R(u, "function"), C = R(u, "string"), en = R(u, "undefined");
    function c(n3) {
      return null === n3;
    }
    function m(n3) {
      try {
        return n3 instanceof (n3.ownerDocument.defaultView || window).HTMLElement;
      } catch (n4) {
        return false;
      }
    }
    function y(n3) {
      return e(n3) ? n3 : [n3];
    }
    function g(n3, t3) {
      y(n3).forEach(t3);
    }
    function b(n3, t3) {
      return -1 < n3.indexOf(t3);
    }
    function k(n3, t3) {
      return n3.push.apply(n3, y(t3)), n3;
    }
    function A(t3, n3, i2) {
      t3 && g(n3, function(n4) {
        n4 && t3.classList[i2 ? "add" : "remove"](n4);
      });
    }
    function M(n3, t3) {
      A(n3, C(t3) ? t3.split(" ") : t3, true);
    }
    function L(n3, t3) {
      g(t3, n3.appendChild.bind(n3));
    }
    function O(n3, i2) {
      g(n3, function(n4) {
        var t3 = (i2 || n4).parentNode;
        t3 && t3.insertBefore(n4, i2);
      });
    }
    function cn(n3, t3) {
      return m(n3) && (n3.msMatchesSelector || n3.matches).call(n3, t3);
    }
    function S(n3, t3) {
      n3 = n3 ? o(n3.children) : [];
      return t3 ? n3.filter(function(n4) {
        return cn(n4, t3);
      }) : n3;
    }
    function fn(n3, t3) {
      return t3 ? S(n3, t3)[0] : n3.firstElementChild;
    }
    var E = Object.keys;
    function w(t3, i2, n3) {
      t3 && (n3 ? E(t3).reverse() : E(t3)).forEach(function(n4) {
        "__proto__" !== n4 && i2(t3[n4], n4);
      });
    }
    function an(r3) {
      return o(arguments, 1).forEach(function(i2) {
        w(i2, function(n3, t3) {
          r3[t3] = i2[t3];
        });
      }), r3;
    }
    function d(i2) {
      return o(arguments, 1).forEach(function(n3) {
        w(n3, function(n4, t3) {
          e(n4) ? i2[t3] = n4.slice() : un(n4) ? i2[t3] = d({}, un(i2[t3]) ? i2[t3] : {}, n4) : i2[t3] = n4;
        });
      }), i2;
    }
    function sn(t3, n3) {
      g(n3 || E(t3), function(n4) {
        delete t3[n4];
      });
    }
    function P(n3, i2) {
      g(n3, function(t3) {
        g(i2, function(n4) {
          t3 && t3.removeAttribute(n4);
        });
      });
    }
    function I(i2, t3, r3) {
      un(t3) ? w(t3, function(n3, t4) {
        I(i2, t4, n3);
      }) : g(i2, function(n3) {
        c(r3) || "" === r3 ? P(n3, t3) : n3.setAttribute(t3, String(r3));
      });
    }
    function j(n3, t3, i2) {
      n3 = document.createElement(n3);
      return t3 && (C(t3) ? M : I)(n3, t3), i2 && L(i2, n3), n3;
    }
    function _(n3, t3, i2) {
      if (en(i2)) return getComputedStyle(n3)[t3];
      c(i2) || (n3.style[t3] = "" + i2);
    }
    function ln(n3, t3) {
      _(n3, "display", t3);
    }
    function dn(n3) {
      n3.setActive && n3.setActive() || n3.focus({ preventScroll: true });
    }
    function z(n3, t3) {
      return n3.getAttribute(t3);
    }
    function vn(n3, t3) {
      return n3 && n3.classList.contains(t3);
    }
    function N(n3) {
      return n3.getBoundingClientRect();
    }
    function T(n3) {
      g(n3, function(n4) {
        n4 && n4.parentNode && n4.parentNode.removeChild(n4);
      });
    }
    function hn(n3) {
      return fn(new DOMParser().parseFromString(n3, "text/html").body);
    }
    function F(n3, t3) {
      n3.preventDefault(), t3 && (n3.stopPropagation(), n3.stopImmediatePropagation());
    }
    function pn(n3, t3) {
      return n3 && n3.querySelector(t3);
    }
    function gn(n3, t3) {
      return t3 ? o(n3.querySelectorAll(t3)) : [];
    }
    function X(n3, t3) {
      A(n3, t3, false);
    }
    function mn(n3) {
      return n3.timeStamp;
    }
    function W(n3) {
      return C(n3) ? n3 : n3 ? n3 + "px" : "";
    }
    var yn = "splide", f = "data-" + yn;
    function bn(n3, t3) {
      if (!n3) throw new Error("[" + yn + "] " + (t3 || ""));
    }
    var Y = Math.min, wn = Math.max, xn = Math.floor, kn = Math.ceil, U = Math.abs;
    function Sn(n3, t3, i2) {
      return U(n3 - t3) < i2;
    }
    function En(n3, t3, i2, r3) {
      var o2 = Y(t3, i2), t3 = wn(t3, i2);
      return r3 ? o2 < n3 && n3 < t3 : o2 <= n3 && n3 <= t3;
    }
    function q(n3, t3, i2) {
      var r3 = Y(t3, i2), t3 = wn(t3, i2);
      return Y(wn(r3, n3), t3);
    }
    function Ln(n3) {
      return (0 < n3) - (n3 < 0);
    }
    function On(t3, n3) {
      return g(n3, function(n4) {
        t3 = t3.replace("%s", "" + n4);
      }), t3;
    }
    function An(n3) {
      return n3 < 10 ? "0" + n3 : "" + n3;
    }
    var _n = {};
    function zn() {
      var c2 = [];
      function i2(n3, i3, r3) {
        g(n3, function(t3) {
          t3 && g(i3, function(n4) {
            n4.split(" ").forEach(function(n5) {
              n5 = n5.split(".");
              r3(t3, n5[0], n5[1]);
            });
          });
        });
      }
      return {
        bind: function(n3, t3, u2, e2) {
          i2(n3, t3, function(n4, t4, i3) {
            var r3 = "addEventListener" in n4, o2 = r3 ? n4.removeEventListener.bind(n4, t4, u2, e2) : n4.removeListener.bind(n4, u2);
            r3 ? n4.addEventListener(t4, u2, e2) : n4.addListener(u2), c2.push([n4, t4, i3, u2, o2]);
          });
        },
        unbind: function(n3, t3, o2) {
          i2(n3, t3, function(t4, i3, r3) {
            c2 = c2.filter(function(n4) {
              return !!(n4[0] !== t4 || n4[1] !== i3 || n4[2] !== r3 || o2 && n4[3] !== o2) || (n4[4](), false);
            });
          });
        },
        dispatch: function(n3, t3, i3) {
          var r3;
          return "function" == typeof CustomEvent ? r3 = new CustomEvent(t3, { bubbles: true, detail: i3 }) : (r3 = document.createEvent("CustomEvent")).initCustomEvent(t3, true, false, i3), n3.dispatchEvent(r3), r3;
        },
        destroy: function() {
          c2.forEach(function(n3) {
            n3[4]();
          }), D(c2);
        }
      };
    }
    var B = "mounted", H = "move", Dn = "moved", Mn = "click", Pn = "active", In = "inactive", Rn = "visible", Cn = "hidden", J = "refresh", K = "updated", jn = "resize", Nn = "resized", Tn = "scroll", V = "scrolled", a = "destroy", Gn = "navigation:mounted", Fn = "autoplay:play", Xn = "autoplay:pause", Wn = "lazyload:loaded", Yn = "sk", Un = "sh";
    function Q(n3) {
      var i2 = n3 ? n3.event.bus : document.createDocumentFragment(), r3 = zn();
      return n3 && n3.event.on(a, r3.destroy), an(r3, {
        bus: i2,
        on: function(n4, t3) {
          r3.bind(i2, y(n4).join(" "), function(n5) {
            t3.apply(t3, e(n5.detail) ? n5.detail : []);
          });
        },
        off: R(r3.unbind, i2),
        emit: function(n4) {
          r3.dispatch(i2, n4, o(arguments, 1));
        }
      });
    }
    function qn(t3, n3, i2, r3) {
      var o2, u2, e2 = Date.now, c2 = 0, f2 = true, a2 = 0;
      function s2() {
        if (!f2) {
          if (c2 = t3 ? Y((e2() - o2) / t3, 1) : 1, i2 && i2(c2), 1 <= c2 && (n3(), o2 = e2(), r3 && ++a2 >= r3)) return l2();
          u2 = h(s2);
        }
      }
      function l2() {
        f2 = true;
      }
      function d2() {
        u2 && cancelAnimationFrame(u2), f2 = !(u2 = c2 = 0);
      }
      return {
        start: function(n4) {
          n4 || d2(), o2 = e2() - (n4 ? c2 * t3 : 0), f2 = false, u2 = h(s2);
        },
        rewind: function() {
          o2 = e2(), c2 = 0, i2 && i2(c2);
        },
        pause: l2,
        cancel: d2,
        set: function(n4) {
          t3 = n4;
        },
        isPaused: function() {
          return f2;
        }
      };
    }
    function s(n3) {
      var t3 = n3;
      return {
        set: function(n4) {
          t3 = n4;
        },
        is: function(n4) {
          return b(y(n4), t3);
        }
      };
    }
    var n2 = "Arrow", Bn = n2 + "Left", Hn = n2 + "Right", t2 = n2 + "Up", n2 = n2 + "Down", Jn = "ttb", l = { width: ["height"], left: ["top", "right"], right: ["bottom", "left"], x: ["y"], X: ["Y"], Y: ["X"], ArrowLeft: [t2, Hn], ArrowRight: [n2, Bn] };
    var Z = "role", $ = "tabindex", i = "aria-", Kn = i + "controls", Vn = i + "current", Qn = i + "selected", nn = i + "label", Zn = i + "labelledby", $n = i + "hidden", nt = i + "orientation", tt = i + "roledescription", it = i + "live", rt = i + "busy", ot = i + "atomic", ut = [Z, $, "disabled", Kn, Vn, nn, Zn, $n, nt, tt], i = yn + "__", et = yn, ct = i + "track", ft = i + "list", at = i + "slide", st = at + "--clone", lt = at + "__container", dt = i + "arrows", vt = i + "arrow", ht = vt + "--prev", pt = vt + "--next", gt = i + "pagination", mt = gt + "__page", yt = i + "progress__bar", bt = i + "toggle", wt = i + "sr", tn = "is-active", xt = "is-prev", kt = "is-next", St = "is-visible", Et = "is-loading", Lt = "is-focus-in", Ot = "is-overflow", At = [tn, St, xt, kt, Et, Lt, Ot];
    var _t = "touchstart mousedown", zt = "touchmove mousemove", Dt = "touchend touchcancel mouseup click";
    var Mt = "slide", Pt = "loop", It = "fade";
    function Rt(o2, r3, t3, u2) {
      var e2, n3 = Q(o2), i2 = n3.on, c2 = n3.emit, f2 = n3.bind, a2 = o2.Components, s2 = o2.root, l2 = o2.options, d2 = l2.isNavigation, v2 = l2.updateOnMove, h2 = l2.i18n, p2 = l2.pagination, g2 = l2.slideFocus, m2 = a2.Direction.resolve, y2 = z(u2, "style"), b2 = z(u2, nn), w2 = -1 < t3, x2 = fn(u2, "." + lt);
      function k2() {
        var n4 = o2.splides.map(function(n5) {
          n5 = n5.splide.Components.Slides.getAt(r3);
          return n5 ? n5.slide.id : "";
        }).join(" ");
        I(u2, nn, On(h2.slideX, (w2 ? t3 : r3) + 1)), I(u2, Kn, n4), I(u2, Z, g2 ? "button" : ""), g2 && P(u2, tt);
      }
      function S2() {
        e2 || E2();
      }
      function E2() {
        var n4, t4, i3;
        e2 || (n4 = o2.index, (i3 = L2()) !== vn(u2, tn) && (A(u2, tn, i3), I(u2, Vn, d2 && i3 || ""), c2(i3 ? Pn : In, O2)), i3 = (function() {
          if (o2.is(It)) return L2();
          var n5 = N(a2.Elements.track), t5 = N(u2), i4 = m2("left", true), r4 = m2("right", true);
          return xn(n5[i4]) <= kn(t5[i4]) && xn(t5[r4]) <= kn(n5[r4]);
        })(), t4 = !i3 && (!L2() || w2), o2.state.is([G, rn]) || I(u2, $n, t4 || ""), I(gn(u2, l2.focusableNodes || ""), $, t4 ? -1 : ""), g2 && I(u2, $, t4 ? -1 : 0), i3 !== vn(u2, St) && (A(u2, St, i3), c2(i3 ? Rn : Cn, O2)), i3 || document.activeElement !== u2 || (t4 = a2.Slides.getAt(o2.index)) && dn(t4.slide), A(u2, xt, r3 === n4 - 1), A(u2, kt, r3 === n4 + 1));
      }
      function L2() {
        var n4 = o2.index;
        return n4 === r3 || l2.cloneStatus && n4 === t3;
      }
      var O2 = {
        index: r3,
        slideIndex: t3,
        slide: u2,
        container: x2,
        isClone: w2,
        mount: function() {
          w2 || (u2.id = s2.id + "-slide" + An(r3 + 1), I(u2, Z, p2 ? "tabpanel" : "group"), I(u2, tt, h2.slide), I(u2, nn, b2 || On(h2.slideLabel, [r3 + 1, o2.length]))), f2(u2, "click", R(c2, Mn, O2)), f2(u2, "keydown", R(c2, Yn, O2)), i2([Dn, Un, V], E2), i2(Gn, k2), v2 && i2(H, S2);
        },
        destroy: function() {
          e2 = true, n3.destroy(), X(u2, At), P(u2, ut), I(u2, "style", y2), I(u2, nn, b2 || "");
        },
        update: E2,
        style: function(n4, t4, i3) {
          _(i3 && x2 || u2, n4, t4);
        },
        isWithin: function(n4, t4) {
          return n4 = U(n4 - r3), (n4 = w2 || !l2.rewind && !o2.is(Pt) ? n4 : Y(n4, o2.length - n4)) <= t4;
        }
      };
      return O2;
    }
    var Ct = f + "-interval";
    var jt = { passive: false, capture: true };
    var Nt = { Spacebar: " ", Right: Hn, Left: Bn, Up: t2, Down: n2 };
    function Tt(n3) {
      return n3 = C(n3) ? n3 : n3.key, Nt[n3] || n3;
    }
    var Gt = "keydown";
    var Ft = f + "-lazy", Xt = Ft + "-srcset", Wt = "[" + Ft + "], [" + Xt + "]";
    var Yt = [" ", "Enter"];
    var Ut = Object.freeze({
      __proto__: null,
      Media: function(r3, n3, o2) {
        var u2 = r3.state, t3 = o2.breakpoints || {}, e2 = o2.reducedMotion || {}, i2 = zn(), c2 = [];
        function f2(n4) {
          n4 && i2.destroy();
        }
        function a2(n4, t4) {
          t4 = matchMedia(t4);
          i2.bind(t4, "change", s2), c2.push([n4, t4]);
        }
        function s2() {
          var n4 = u2.is(7), t4 = o2.direction, i3 = c2.reduce(function(n5, t5) {
            return d(n5, t5[1].matches ? t5[0] : {});
          }, {});
          sn(o2), l2(i3), o2.destroy ? r3.destroy("completely" === o2.destroy) : n4 ? (f2(true), r3.mount()) : t4 !== o2.direction && r3.refresh();
        }
        function l2(n4, t4, i3) {
          d(o2, n4), t4 && d(Object.getPrototypeOf(o2), n4), !i3 && u2.is(1) || r3.emit(K, o2);
        }
        return {
          setup: function() {
            var i3 = "min" === o2.mediaQuery;
            E(t3).sort(function(n4, t4) {
              return i3 ? +n4 - +t4 : +t4 - +n4;
            }).forEach(function(n4) {
              a2(t3[n4], "(" + (i3 ? "min" : "max") + "-width:" + n4 + "px)");
            }), a2(e2, v), s2();
          },
          destroy: f2,
          reduce: function(n4) {
            matchMedia(v).matches && (n4 ? d(o2, e2) : sn(o2, E(e2)));
          },
          set: l2
        };
      },
      Direction: function(n3, t3, o2) {
        return {
          resolve: function(n4, t4, i2) {
            var r3 = "rtl" !== (i2 = i2 || o2.direction) || t4 ? i2 === Jn ? 0 : -1 : 1;
            return l[n4] && l[n4][r3] || n4.replace(/width|left|right/i, function(n5, t5) {
              n5 = l[n5.toLowerCase()][r3] || n5;
              return 0 < t5 ? n5.charAt(0).toUpperCase() + n5.slice(1) : n5;
            });
          },
          orient: function(n4) {
            return n4 * ("rtl" === o2.direction ? 1 : -1);
          }
        };
      },
      Elements: function(n3, t3, i2) {
        var r3, o2, u2, e2 = Q(n3), c2 = e2.on, f2 = e2.bind, a2 = n3.root, s2 = i2.i18n, l2 = {}, d2 = [], v2 = [], h2 = [];
        function p2() {
          r3 = y2("." + ct), o2 = fn(r3, "." + ft), bn(r3 && o2, "A track/list element is missing."), k(d2, S(o2, "." + at + ":not(." + st + ")")), w({ arrows: dt, pagination: gt, prev: ht, next: pt, bar: yt, toggle: bt }, function(n5, t5) {
            l2[t5] = y2("." + n5);
          }), an(l2, { root: a2, track: r3, list: o2, slides: d2 });
          var n4 = a2.id || (function(n5) {
            return "" + n5 + An(_n[n5] = (_n[n5] || 0) + 1);
          })(yn), t4 = i2.role;
          a2.id = n4, r3.id = r3.id || n4 + "-track", o2.id = o2.id || n4 + "-list", !z(a2, Z) && "SECTION" !== a2.tagName && t4 && I(a2, Z, t4), I(a2, tt, s2.carousel), I(o2, Z, "presentation"), m2();
        }
        function g2(n4) {
          var t4 = ut.concat("style");
          D(d2), X(a2, v2), X(r3, h2), P([r3, o2], t4), P(a2, n4 ? t4 : ["style", tt]);
        }
        function m2() {
          X(a2, v2), X(r3, h2), v2 = b2(et), h2 = b2(ct), M(a2, v2), M(r3, h2), I(a2, nn, i2.label), I(a2, Zn, i2.labelledby);
        }
        function y2(n4) {
          n4 = pn(a2, n4);
          return n4 && (function(n5, t4) {
            if (x(n5.closest)) return n5.closest(t4);
            for (var i3 = n5; i3 && 1 === i3.nodeType && !cn(i3, t4); ) i3 = i3.parentElement;
            return i3;
          })(n4, "." + et) === a2 ? n4 : void 0;
        }
        function b2(n4) {
          return [n4 + "--" + i2.type, n4 + "--" + i2.direction, i2.drag && n4 + "--draggable", i2.isNavigation && n4 + "--nav", n4 === et && tn];
        }
        return an(l2, {
          setup: p2,
          mount: function() {
            c2(J, g2), c2(J, p2), c2(K, m2), f2(
              document,
              _t + " keydown",
              function(n4) {
                u2 = "keydown" === n4.type;
              },
              { capture: true }
            ), f2(a2, "focusin", function() {
              A(a2, Lt, !!u2);
            });
          },
          destroy: g2
        });
      },
      Slides: function(r3, o2, u2) {
        var n3 = Q(r3), t3 = n3.on, e2 = n3.emit, c2 = n3.bind, f2 = (n3 = o2.Elements).slides, a2 = n3.list, s2 = [];
        function i2() {
          f2.forEach(function(n4, t4) {
            d2(n4, t4, -1);
          });
        }
        function l2() {
          h2(function(n4) {
            n4.destroy();
          }), D(s2);
        }
        function d2(n4, t4, i3) {
          t4 = Rt(r3, t4, i3, n4);
          t4.mount(), s2.push(t4), s2.sort(function(n5, t5) {
            return n5.index - t5.index;
          });
        }
        function v2(n4) {
          return n4 ? p2(function(n5) {
            return !n5.isClone;
          }) : s2;
        }
        function h2(n4, t4) {
          v2(t4).forEach(n4);
        }
        function p2(t4) {
          return s2.filter(
            x(t4) ? t4 : function(n4) {
              return C(t4) ? cn(n4.slide, t4) : b(y(t4), n4.index);
            }
          );
        }
        return {
          mount: function() {
            i2(), t3(J, l2), t3(J, i2);
          },
          destroy: l2,
          update: function() {
            h2(function(n4) {
              n4.update();
            });
          },
          register: d2,
          get: v2,
          getIn: function(n4) {
            var t4 = o2.Controller, i3 = t4.toIndex(n4), r4 = t4.hasFocus() ? 1 : u2.perPage;
            return p2(function(n5) {
              return En(n5.index, i3, i3 + r4 - 1);
            });
          },
          getAt: function(n4) {
            return p2(n4)[0];
          },
          add: function(n4, o3) {
            g(n4, function(n5) {
              var t4, i3, r4;
              m(n5 = C(n5) ? hn(n5) : n5) && ((t4 = f2[o3]) ? O(n5, t4) : L(a2, n5), M(n5, u2.classes.slide), t4 = n5, i3 = R(e2, jn), t4 = gn(t4, "img"), (r4 = t4.length) ? t4.forEach(function(n6) {
                c2(n6, "load error", function() {
                  --r4 || i3();
                });
              }) : i3());
            }), e2(J);
          },
          remove: function(n4) {
            T(
              p2(n4).map(function(n5) {
                return n5.slide;
              })
            ), e2(J);
          },
          forEach: h2,
          filter: p2,
          style: function(t4, i3, r4) {
            h2(function(n4) {
              n4.style(t4, i3, r4);
            });
          },
          getLength: function(n4) {
            return (n4 ? f2 : s2).length;
          },
          isEnough: function() {
            return s2.length > u2.perPage;
          }
        };
      },
      Layout: function(t3, n3, i2) {
        var r3, o2, u2, e2 = (a2 = Q(t3)).on, c2 = a2.bind, f2 = a2.emit, a2 = n3.Slides, s2 = n3.Direction.resolve, l2 = (n3 = n3.Elements).root, d2 = n3.track, v2 = n3.list, h2 = a2.getAt, p2 = a2.style;
        function g2() {
          r3 = i2.direction === Jn, _(l2, "maxWidth", W(i2.width)), _(d2, s2("paddingLeft"), y2(false)), _(d2, s2("paddingRight"), y2(true)), m2(true);
        }
        function m2(n4) {
          var t4 = N(l2);
          !n4 && o2.width === t4.width && o2.height === t4.height || (_(
            d2,
            "height",
            (function() {
              var n5 = "";
              r3 && (bn(n5 = b2(), "height or heightRatio is missing."), n5 = "calc(" + n5 + " - " + y2(false) + " - " + y2(true) + ")");
              return n5;
            })()
          ), p2(s2("marginRight"), W(i2.gap)), p2("width", i2.autoWidth ? null : W(i2.fixedWidth) || (r3 ? "" : w2())), p2("height", W(i2.fixedHeight) || (r3 ? i2.autoHeight ? null : w2() : b2()), true), o2 = t4, f2(Nn), u2 !== (u2 = O2()) && (A(l2, Ot, u2), f2("overflow", u2)));
        }
        function y2(n4) {
          var t4 = i2.padding, n4 = s2(n4 ? "right" : "left");
          return t4 && W(t4[n4] || (un(t4) ? 0 : t4)) || "0px";
        }
        function b2() {
          return W(i2.height || N(v2).width * i2.heightRatio);
        }
        function w2() {
          var n4 = W(i2.gap);
          return "calc((100%" + (n4 && " + " + n4) + ")/" + (i2.perPage || 1) + (n4 && " - " + n4) + ")";
        }
        function x2() {
          return N(v2)[s2("width")];
        }
        function k2(n4, t4) {
          n4 = h2(n4 || 0);
          return n4 ? N(n4.slide)[s2("width")] + (t4 ? 0 : L2()) : 0;
        }
        function S2(n4, t4) {
          var i3, n4 = h2(n4);
          return n4 ? (n4 = N(n4.slide)[s2("right")], i3 = N(v2)[s2("left")], U(n4 - i3) + (t4 ? 0 : L2())) : 0;
        }
        function E2(n4) {
          return S2(t3.length - 1) - S2(0) + k2(0, n4);
        }
        function L2() {
          var n4 = h2(0);
          return n4 && parseFloat(_(n4.slide, s2("marginRight"))) || 0;
        }
        function O2() {
          return t3.is(It) || E2(true) > x2();
        }
        return {
          mount: function() {
            var n4, t4, i3;
            g2(), c2(
              window,
              "resize load",
              (n4 = R(f2, jn), i3 = qn(t4 || 0, n4, null, 1), function() {
                i3.isPaused() && i3.start();
              })
            ), e2([K, J], g2), e2(jn, m2);
          },
          resize: m2,
          listSize: x2,
          slideSize: k2,
          sliderSize: E2,
          totalSize: S2,
          getPadding: function(n4) {
            return parseFloat(_(d2, s2("padding" + (n4 ? "Right" : "Left")))) || 0;
          },
          isOverflow: O2
        };
      },
      Clones: function(c2, i2, f2) {
        var t3, r3 = Q(c2), n3 = r3.on, a2 = i2.Elements, s2 = i2.Slides, o2 = i2.Direction.resolve, l2 = [];
        function u2() {
          if (n3(J, d2), n3([K, jn], v2), t3 = h2()) {
            var o3 = t3, u3 = s2.get().slice(), e3 = u3.length;
            if (e3) {
              for (; u3.length < o3; ) k(u3, u3);
              k(u3.slice(-o3), u3.slice(0, o3)).forEach(function(n4, t4) {
                var i3 = t4 < o3, r4 = (function(n5, t5) {
                  n5 = n5.cloneNode(true);
                  return M(n5, f2.classes.clone), n5.id = c2.root.id + "-clone" + An(t5 + 1), n5;
                })(n4.slide, t4);
                i3 ? O(r4, u3[0].slide) : L(a2.list, r4), k(l2, r4), s2.register(r4, t4 - o3 + (i3 ? 0 : e3), n4.index);
              });
            }
            i2.Layout.resize(true);
          }
        }
        function d2() {
          e2(), u2();
        }
        function e2() {
          T(l2), D(l2), r3.destroy();
        }
        function v2() {
          var n4 = h2();
          t3 !== n4 && (t3 < n4 || !n4) && r3.emit(J);
        }
        function h2() {
          var n4, t4 = f2.clones;
          return c2.is(Pt) ? en(t4) && (t4 = (n4 = f2[o2("fixedWidth")] && i2.Layout.slideSize(0)) && kn(N(a2.track)[o2("width")] / n4) || f2[o2("autoWidth")] && c2.length || 2 * f2.perPage) : t4 = 0, t4;
        }
        return { mount: u2, destroy: e2 };
      },
      Move: function(r3, c2, o2) {
        var e2, n3 = Q(r3), t3 = n3.on, f2 = n3.emit, a2 = r3.state.set, u2 = (n3 = c2.Layout).slideSize, i2 = n3.getPadding, s2 = n3.totalSize, l2 = n3.listSize, d2 = n3.sliderSize, v2 = (n3 = c2.Direction).resolve, h2 = n3.orient, p2 = (n3 = c2.Elements).list, g2 = n3.track;
        function m2() {
          c2.Controller.isBusy() || (c2.Scroll.cancel(), y2(r3.index), c2.Slides.update());
        }
        function y2(n4) {
          b2(S2(n4, true));
        }
        function b2(n4, t4) {
          r3.is(It) || (t4 = t4 ? n4 : (function(n5) {
            {
              var t5, i3;
              r3.is(Pt) && (t5 = k2(n5), i3 = t5 > c2.Controller.getEnd(), (t5 < 0 || i3) && (n5 = w2(n5, i3)));
            }
            return n5;
          })(n4), _(p2, "transform", "translate" + v2("X") + "(" + t4 + "px)"), n4 !== t4 && f2(Un));
        }
        function w2(n4, t4) {
          var i3 = n4 - L2(t4), r4 = d2();
          return n4 -= h2(r4 * (kn(U(i3) / r4) || 1)) * (t4 ? 1 : -1);
        }
        function x2() {
          b2(E2(), true), e2.cancel();
        }
        function k2(n4) {
          for (var t4 = c2.Slides.get(), i3 = 0, r4 = 1 / 0, o3 = 0; o3 < t4.length; o3++) {
            var u3 = t4[o3].index, e3 = U(S2(u3, true) - n4);
            if (!(e3 <= r4)) break;
            r4 = e3, i3 = u3;
          }
          return i3;
        }
        function S2(n4, t4) {
          var i3 = h2(s2(n4 - 1) - (n4 = n4, "center" === (i3 = o2.focus) ? (l2() - u2(n4, true)) / 2 : +i3 * u2(n4) || 0));
          return t4 ? (n4 = i3, n4 = o2.trimSpace && r3.is(Mt) ? q(n4, 0, h2(d2(true) - l2())) : n4) : i3;
        }
        function E2() {
          var n4 = v2("left");
          return N(p2)[n4] - N(g2)[n4] + h2(i2(false));
        }
        function L2(n4) {
          return S2(n4 ? c2.Controller.getEnd() : 0, !!o2.trimSpace);
        }
        return {
          mount: function() {
            e2 = c2.Transition, t3([B, Nn, K, J], m2);
          },
          move: function(n4, t4, i3, r4) {
            var o3, u3;
            n4 !== t4 && (o3 = i3 < n4, u3 = h2(w2(E2(), o3)), o3 ? 0 <= u3 : u3 <= p2[v2("scrollWidth")] - N(g2)[v2("width")]) && (x2(), b2(w2(E2(), i3 < n4), true)), a2(G), f2(H, t4, i3, n4), e2.start(t4, function() {
              a2(3), f2(Dn, t4, i3, n4), r4 && r4();
            });
          },
          jump: y2,
          translate: b2,
          shift: w2,
          cancel: x2,
          toIndex: k2,
          toPosition: S2,
          getPosition: E2,
          getLimit: L2,
          exceededLimit: function(n4, t4) {
            t4 = en(t4) ? E2() : t4;
            var i3 = true !== n4 && h2(t4) < h2(L2(false)), n4 = false !== n4 && h2(t4) > h2(L2(true));
            return i3 || n4;
          },
          reposition: m2
        };
      },
      Controller: function(o2, u2, e2) {
        var c2, f2, a2, s2, n3 = Q(o2), t3 = n3.on, i2 = n3.emit, l2 = u2.Move, d2 = l2.getPosition, r3 = l2.getLimit, v2 = l2.toPosition, h2 = (n3 = u2.Slides).isEnough, p2 = n3.getLength, g2 = e2.omitEnd, m2 = o2.is(Pt), y2 = o2.is(Mt), b2 = R(L2, false), w2 = R(L2, true), x2 = e2.start || 0, k2 = x2;
        function S2() {
          f2 = p2(true), a2 = e2.perMove, s2 = e2.perPage, c2 = _2();
          var n4 = q(x2, 0, g2 ? c2 : f2 - 1);
          n4 !== x2 && (x2 = n4, l2.reposition());
        }
        function E2() {
          c2 !== _2() && i2("ei");
        }
        function L2(n4, t4) {
          var i3 = a2 || (P2() ? 1 : s2), i3 = O2(x2 + i3 * (n4 ? -1 : 1), x2, !(a2 || P2()));
          return -1 === i3 && y2 && !Sn(d2(), r3(!n4), 1) ? n4 ? 0 : c2 : t4 ? i3 : A2(i3);
        }
        function O2(n4, t4, i3) {
          var r4;
          return h2() || P2() ? ((r4 = (function(n5) {
            if (y2 && "move" === e2.trimSpace && n5 !== x2) for (var t5 = d2(); t5 === v2(n5, true) && En(n5, 0, o2.length - 1, !e2.rewind); ) n5 < x2 ? --n5 : ++n5;
            return n5;
          })(n4)) !== n4 && (t4 = n4, n4 = r4, i3 = false), n4 < 0 || c2 < n4 ? n4 = a2 || !En(0, n4, t4, true) && !En(c2, t4, n4, true) ? m2 ? i3 ? n4 < 0 ? -(f2 % s2 || s2) : f2 : n4 : e2.rewind ? n4 < 0 ? c2 : 0 : -1 : z2(D2(n4)) : i3 && n4 !== t4 && (n4 = z2(D2(t4) + (n4 < t4 ? -1 : 1)))) : n4 = -1, n4;
        }
        function A2(n4) {
          return m2 ? (n4 + f2) % f2 || 0 : n4;
        }
        function _2() {
          for (var n4 = f2 - (P2() || m2 && a2 ? 1 : s2); g2 && 0 < n4--; )
            if (v2(f2 - 1, true) !== v2(n4, true)) {
              n4++;
              break;
            }
          return q(n4, 0, f2 - 1);
        }
        function z2(n4) {
          return q(P2() ? n4 : s2 * n4, 0, c2);
        }
        function D2(n4) {
          return P2() ? Y(n4, c2) : xn((c2 <= n4 ? f2 - 1 : n4) / s2);
        }
        function M2(n4) {
          n4 !== x2 && (k2 = x2, x2 = n4);
        }
        function P2() {
          return !en(e2.focus) || e2.isNavigation;
        }
        function I2() {
          return o2.state.is([G, rn]) && !!e2.waitForTransition;
        }
        return {
          mount: function() {
            S2(), t3([K, J, "ei"], S2), t3(Nn, E2);
          },
          go: function(n4, t4, i3) {
            var r4;
            I2() || -1 < (r4 = A2(
              n4 = (function(n5) {
                var t5 = x2;
                {
                  var i4, r5;
                  C(n5) ? (r5 = n5.match(/([+\-<>])(\d+)?/) || [], i4 = r5[1], r5 = r5[2], "+" === i4 || "-" === i4 ? t5 = O2(x2 + +("" + i4 + (+r5 || 1)), x2) : ">" === i4 ? t5 = r5 ? z2(+r5) : b2(true) : "<" === i4 && (t5 = w2(true))) : t5 = m2 ? n5 : q(n5, 0, c2);
                }
                return t5;
              })(n4)
            )) && (t4 || r4 !== x2) && (M2(r4), l2.move(n4, r4, k2, i3));
          },
          scroll: function(n4, t4, i3, r4) {
            u2.Scroll.scroll(n4, t4, i3, function() {
              var n5 = A2(l2.toIndex(d2()));
              M2(g2 ? Y(n5, c2) : n5), r4 && r4();
            });
          },
          getNext: b2,
          getPrev: w2,
          getAdjacent: L2,
          getEnd: _2,
          setIndex: M2,
          getIndex: function(n4) {
            return n4 ? k2 : x2;
          },
          toIndex: z2,
          toPage: D2,
          toDest: function(n4) {
            return n4 = l2.toIndex(n4), y2 ? q(n4, 0, c2) : n4;
          },
          hasFocus: P2,
          isBusy: I2
        };
      },
      Arrows: function(o2, n3, t3) {
        var i2, r3, u2 = Q(o2), e2 = u2.on, c2 = u2.bind, f2 = u2.emit, a2 = t3.classes, s2 = t3.i18n, l2 = n3.Elements, d2 = n3.Controller, v2 = l2.arrows, h2 = l2.track, p2 = v2, g2 = l2.prev, m2 = l2.next, y2 = {};
        function b2() {
          var n4 = t3.arrows;
          !n4 || g2 && m2 || (p2 = v2 || j("div", a2.arrows), g2 = S2(true), m2 = S2(false), i2 = true, L(p2, [g2, m2]), v2 || O(p2, h2)), g2 && m2 && (an(y2, { prev: g2, next: m2 }), ln(p2, n4 ? "" : "none"), M(p2, r3 = dt + "--" + t3.direction), n4 && (e2([B, Dn, J, V, "ei"], E2), c2(m2, "click", R(k2, ">")), c2(g2, "click", R(k2, "<")), E2(), I([g2, m2], Kn, h2.id), f2("arrows:mounted", g2, m2))), e2(K, w2);
        }
        function w2() {
          x2(), b2();
        }
        function x2() {
          u2.destroy(), X(p2, r3), i2 ? (T(v2 ? [g2, m2] : p2), g2 = m2 = null) : P([g2, m2], ut);
        }
        function k2(n4) {
          d2.go(n4, true);
        }
        function S2(n4) {
          return hn('<button class="' + a2.arrow + " " + (n4 ? a2.prev : a2.next) + '" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="' + (t3.arrowPath || "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z") + '" />');
        }
        function E2() {
          var n4, t4, i3, r4;
          g2 && m2 && (r4 = o2.index, n4 = d2.getPrev(), t4 = d2.getNext(), i3 = -1 < n4 && r4 < n4 ? s2.last : s2.prev, r4 = -1 < t4 && t4 < r4 ? s2.first : s2.next, g2.disabled = n4 < 0, m2.disabled = t4 < 0, I(g2, nn, i3), I(m2, nn, r4), f2("arrows:updated", g2, m2, n4, t4));
        }
        return { arrows: y2, mount: b2, destroy: x2, update: E2 };
      },
      Autoplay: function(n3, t3, i2) {
        var r3, o2, u2 = Q(n3), e2 = u2.on, c2 = u2.bind, f2 = u2.emit, a2 = qn(i2.interval, n3.go.bind(n3, ">"), function(n4) {
          var t4 = l2.bar;
          t4 && _(t4, "width", 100 * n4 + "%"), f2("autoplay:playing", n4);
        }), s2 = a2.isPaused, l2 = t3.Elements, d2 = (u2 = t3.Elements).root, v2 = u2.toggle, h2 = i2.autoplay, p2 = "pause" === h2;
        function g2() {
          s2() && t3.Slides.isEnough() && (a2.start(!i2.resetProgress), o2 = r3 = p2 = false, b2(), f2(Fn));
        }
        function m2(n4) {
          p2 = !!(n4 = void 0 === n4 ? true : n4), b2(), s2() || (a2.pause(), f2(Xn));
        }
        function y2() {
          p2 || (r3 || o2 ? m2(false) : g2());
        }
        function b2() {
          v2 && (A(v2, tn, !p2), I(v2, nn, i2.i18n[p2 ? "play" : "pause"]));
        }
        function w2(n4) {
          n4 = t3.Slides.getAt(n4);
          a2.set(n4 && +z(n4.slide, Ct) || i2.interval);
        }
        return {
          mount: function() {
            h2 && (i2.pauseOnHover && c2(d2, "mouseenter mouseleave", function(n4) {
              r3 = "mouseenter" === n4.type, y2();
            }), i2.pauseOnFocus && c2(d2, "focusin focusout", function(n4) {
              o2 = "focusin" === n4.type, y2();
            }), v2 && c2(v2, "click", function() {
              p2 ? g2() : m2(true);
            }), e2([H, Tn, J], a2.rewind), e2(H, w2), v2 && I(v2, Kn, l2.track.id), p2 || g2(), b2());
          },
          destroy: a2.cancel,
          play: g2,
          pause: m2,
          isPaused: s2
        };
      },
      Cover: function(n3, t3, i2) {
        var r3 = Q(n3).on;
        function o2(i3) {
          t3.Slides.forEach(function(n4) {
            var t4 = fn(n4.container || n4.slide, "img");
            t4 && t4.src && u2(i3, t4, n4);
          });
        }
        function u2(n4, t4, i3) {
          i3.style("background", n4 ? 'center/cover no-repeat url("' + t4.src + '")' : "", true), ln(t4, n4 ? "none" : "");
        }
        return {
          mount: function() {
            i2.cover && (r3(Wn, R(u2, true)), r3([B, K, J], R(o2, true)));
          },
          destroy: R(o2, false)
        };
      },
      Scroll: function(n3, c2, u2) {
        var f2, a2, t3 = Q(n3), i2 = t3.on, s2 = t3.emit, l2 = n3.state.set, d2 = c2.Move, v2 = d2.getPosition, e2 = d2.getLimit, h2 = d2.exceededLimit, p2 = d2.translate, g2 = n3.is(Mt), m2 = 1;
        function y2(n4, t4, i3, r4, o2) {
          var u3, e3 = v2(), i3 = (x2(), !i3 || g2 && h2() || (i3 = c2.Layout.sliderSize(), u3 = Ln(n4) * i3 * xn(U(n4) / i3) || 0, n4 = d2.toPosition(c2.Controller.toDest(n4 % i3)) + u3), Sn(e3, n4, 1));
          m2 = 1, t4 = i3 ? 0 : t4 || wn(U(n4 - e3) / 1.5, 800), a2 = r4, f2 = qn(t4, b2, R(w2, e3, n4, o2), 1), l2(rn), s2(Tn), f2.start();
        }
        function b2() {
          l2(3), a2 && a2(), s2(V);
        }
        function w2(n4, t4, i3, r4) {
          var o2 = v2(), r4 = (n4 + (t4 - n4) * (t4 = r4, (n4 = u2.easingFunc) ? n4(t4) : 1 - Math.pow(1 - t4, 4)) - o2) * m2;
          p2(o2 + r4), g2 && !i3 && h2() && (m2 *= 0.6, U(r4) < 10 && y2(e2(h2(true)), 600, false, a2, true));
        }
        function x2() {
          f2 && f2.cancel();
        }
        function r3() {
          f2 && !f2.isPaused() && (x2(), b2());
        }
        return {
          mount: function() {
            i2(H, x2), i2([K, J], r3);
          },
          destroy: x2,
          scroll: y2,
          cancel: r3
        };
      },
      Drag: function(e2, o2, c2) {
        var f2, t3, u2, a2, s2, l2, d2, v2, n3 = Q(e2), i2 = n3.on, h2 = n3.emit, p2 = n3.bind, g2 = n3.unbind, m2 = e2.state, y2 = o2.Move, b2 = o2.Scroll, w2 = o2.Controller, x2 = o2.Elements.track, k2 = o2.Media.reduce, r3 = (n3 = o2.Direction).resolve, S2 = n3.orient, E2 = y2.getPosition, L2 = y2.exceededLimit, O2 = false;
        function j2() {
          var n4 = c2.drag;
          C2(!n4), a2 = "free" === n4;
        }
        function N2(n4) {
          var t4, i3, r4;
          l2 = false, d2 || (t4 = R2(n4), i3 = n4.target, r4 = c2.noDrag, cn(i3, "." + mt + ", ." + vt) || r4 && cn(i3, r4) || !t4 && n4.button || (w2.isBusy() ? F(n4, true) : (v2 = t4 ? x2 : window, s2 = m2.is([G, rn]), u2 = null, p2(v2, zt, A2, jt), p2(v2, Dt, _2, jt), y2.cancel(), b2.cancel(), z2(n4))));
        }
        function A2(n4) {
          var t4, i3, r4, o3, u3;
          m2.is(6) || (m2.set(6), h2("drag")), n4.cancelable && (s2 ? (y2.translate(f2 + D2(n4) / (O2 && e2.is(Mt) ? 5 : 1)), u3 = 200 < M2(n4), t4 = O2 !== (O2 = L2()), (u3 || t4) && z2(n4), l2 = true, h2("dragging"), F(n4)) : U(D2(u3 = n4)) > U(D2(u3, true)) && (t4 = n4, i3 = c2.dragMinThreshold, r4 = un(i3), o3 = r4 && i3.mouse || 0, r4 = (r4 ? i3.touch : +i3) || 10, s2 = U(D2(t4)) > (R2(t4) ? r4 : o3), F(n4)));
        }
        function _2(n4) {
          var t4, i3, r4;
          m2.is(6) && (m2.set(3), h2("dragged")), s2 && (i3 = (function(n5) {
            return E2() + Ln(n5) * Y(U(n5) * (c2.flickPower || 600), a2 ? 1 / 0 : o2.Layout.listSize() * (c2.flickMaxPages || 1));
          })(
            t4 = (function(n5) {
              if (e2.is(Pt) || !O2) {
                var t5 = M2(n5);
                if (t5 && t5 < 200) return D2(n5) / t5;
              }
              return 0;
            })(t4 = n4)
          ), r4 = c2.rewind && c2.rewindByDrag, k2(false), a2 ? w2.scroll(i3, 0, c2.snap) : e2.is(It) ? w2.go(S2(Ln(t4)) < 0 ? r4 ? "<" : "-" : r4 ? ">" : "+") : e2.is(Mt) && O2 && r4 ? w2.go(L2(true) ? ">" : "<") : w2.go(w2.toDest(i3), true), k2(true), F(n4)), g2(v2, zt, A2), g2(v2, Dt, _2), s2 = false;
        }
        function T2(n4) {
          !d2 && l2 && F(n4, true);
        }
        function z2(n4) {
          u2 = t3, t3 = n4, f2 = E2();
        }
        function D2(n4, t4) {
          return I2(n4, t4) - I2(P2(n4), t4);
        }
        function M2(n4) {
          return mn(n4) - mn(P2(n4));
        }
        function P2(n4) {
          return t3 === n4 && u2 || t3;
        }
        function I2(n4, t4) {
          return (R2(n4) ? n4.changedTouches[0] : n4)["page" + r3(t4 ? "Y" : "X")];
        }
        function R2(n4) {
          return "undefined" != typeof TouchEvent && n4 instanceof TouchEvent;
        }
        function C2(n4) {
          d2 = n4;
        }
        return {
          mount: function() {
            p2(x2, zt, on, jt), p2(x2, Dt, on, jt), p2(x2, _t, N2, jt), p2(x2, "click", T2, { capture: true }), p2(x2, "dragstart", F), i2([B, K], j2);
          },
          disable: C2,
          isDragging: function() {
            return s2;
          }
        };
      },
      Keyboard: function(t3, n3, i2) {
        var r3, o2, u2 = Q(t3), e2 = u2.on, c2 = u2.bind, f2 = u2.unbind, a2 = t3.root, s2 = n3.Direction.resolve;
        function l2() {
          var n4 = i2.keyboard;
          n4 && (r3 = "global" === n4 ? window : a2, c2(r3, Gt, h2));
        }
        function d2() {
          f2(r3, Gt);
        }
        function v2() {
          var n4 = o2;
          o2 = true, p(function() {
            o2 = n4;
          });
        }
        function h2(n4) {
          o2 || ((n4 = Tt(n4)) === s2(Bn) ? t3.go("<") : n4 === s2(Hn) && t3.go(">"));
        }
        return {
          mount: function() {
            l2(), e2(K, d2), e2(K, l2), e2(H, v2);
          },
          destroy: d2,
          disable: function(n4) {
            o2 = n4;
          }
        };
      },
      LazyLoad: function(i2, n3, o2) {
        var t3 = Q(i2), r3 = t3.on, u2 = t3.off, e2 = t3.bind, c2 = t3.emit, f2 = "sequential" === o2.lazyLoad, a2 = [Dn, V], s2 = [];
        function l2() {
          D(s2), n3.Slides.forEach(function(r4) {
            gn(r4.slide, Wt).forEach(function(n4) {
              var t4 = z(n4, Ft), i3 = z(n4, Xt);
              t4 === n4.src && i3 === n4.srcset || (t4 = o2.classes.spinner, t4 = fn(i3 = n4.parentElement, "." + t4) || j("span", t4, i3), s2.push([n4, r4, t4]), n4.src || ln(n4, "none"));
            });
          }), (f2 ? p2 : (u2(a2), r3(a2, d2), d2))();
        }
        function d2() {
          (s2 = s2.filter(function(n4) {
            var t4 = o2.perPage * ((o2.preloadPages || 1) + 1) - 1;
            return !n4[1].isWithin(i2.index, t4) || v2(n4);
          })).length || u2(a2);
        }
        function v2(n4) {
          var t4 = n4[0];
          M(n4[1].slide, Et), e2(t4, "load error", R(h2, n4)), I(t4, "src", z(t4, Ft)), I(t4, "srcset", z(t4, Xt)), P(t4, Ft), P(t4, Xt);
        }
        function h2(n4, t4) {
          var i3 = n4[0], r4 = n4[1];
          X(r4.slide, Et), "error" !== t4.type && (T(n4[2]), ln(i3, ""), c2(Wn, i3, r4), c2(jn)), f2 && p2();
        }
        function p2() {
          s2.length && v2(s2.shift());
        }
        return {
          mount: function() {
            o2.lazyLoad && (l2(), r3(J, l2));
          },
          destroy: R(D, s2),
          check: d2
        };
      },
      Pagination: function(l2, n3, d2) {
        var v2, h2, t3 = Q(l2), p2 = t3.on, g2 = t3.emit, m2 = t3.bind, y2 = n3.Slides, b2 = n3.Elements, w2 = n3.Controller, x2 = w2.hasFocus, r3 = w2.getIndex, e2 = w2.go, c2 = n3.Direction.resolve, k2 = b2.pagination, S2 = [];
        function E2() {
          v2 && (T(k2 ? o(v2.children) : v2), X(v2, h2), D(S2), v2 = null), t3.destroy();
        }
        function L2(n4) {
          e2(">" + n4, true);
        }
        function O2(n4, t4) {
          var i2 = S2.length, r4 = Tt(t4), o2 = A2(), u2 = -1, o2 = (r4 === c2(Hn, false, o2) ? u2 = ++n4 % i2 : r4 === c2(Bn, false, o2) ? u2 = (--n4 + i2) % i2 : "Home" === r4 ? u2 = 0 : "End" === r4 && (u2 = i2 - 1), S2[u2]);
          o2 && (dn(o2.button), e2(">" + u2), F(t4, true));
        }
        function A2() {
          return d2.paginationDirection || d2.direction;
        }
        function _2(n4) {
          return S2[w2.toPage(n4)];
        }
        function z2() {
          var n4, t4 = _2(r3(true)), i2 = _2(r3());
          t4 && (X(n4 = t4.button, tn), P(n4, Qn), I(n4, $, -1)), i2 && (M(n4 = i2.button, tn), I(n4, Qn, true), I(n4, $, "")), g2("pagination:updated", { list: v2, items: S2 }, t4, i2);
        }
        return {
          items: S2,
          mount: function n4() {
            E2(), p2([K, J, "ei"], n4);
            var t4 = d2.pagination;
            if (k2 && ln(k2, t4 ? "" : "none"), t4) {
              p2([H, Tn, V], z2);
              var t4 = l2.length, i2 = d2.classes, r4 = d2.i18n, o2 = d2.perPage, u2 = x2() ? w2.getEnd() + 1 : kn(t4 / o2);
              M(v2 = k2 || j("ul", i2.pagination, b2.track.parentElement), h2 = gt + "--" + A2()), I(v2, Z, "tablist"), I(v2, nn, r4.select), I(v2, nt, A2() === Jn ? "vertical" : "");
              for (var e3 = 0; e3 < u2; e3++) {
                var c3 = j("li", null, v2), f2 = j("button", { class: i2.page, type: "button" }, c3), a2 = y2.getIn(e3).map(function(n5) {
                  return n5.slide.id;
                }), s2 = !x2() && 1 < o2 ? r4.pageX : r4.slideX;
                m2(f2, "click", R(L2, e3)), d2.paginationKeyboard && m2(f2, "keydown", R(O2, e3)), I(c3, Z, "presentation"), I(f2, Z, "tab"), I(f2, Kn, a2.join(" ")), I(f2, nn, On(s2, e3 + 1)), I(f2, $, -1), S2.push({ li: c3, button: f2, page: e3 });
              }
              z2(), g2("pagination:mounted", { list: v2, items: S2 }, _2(l2.index));
            }
          },
          destroy: E2,
          getAt: _2,
          update: z2
        };
      },
      Sync: function(i2, n3, t3) {
        var r3 = t3.isNavigation, o2 = t3.slideFocus, u2 = [];
        function e2() {
          var n4, t4;
          i2.splides.forEach(function(n5) {
            n5.isParent || (f2(i2, n5.splide), f2(n5.splide, i2));
          }), r3 && (n4 = Q(i2), (t4 = n4.on)(Mn, s2), t4(Yn, l2), t4([B, K], a2), u2.push(n4), n4.emit(Gn, i2.splides));
        }
        function c2() {
          u2.forEach(function(n4) {
            n4.destroy();
          }), D(u2);
        }
        function f2(n4, r4) {
          n4 = Q(n4);
          n4.on(H, function(n5, t4, i3) {
            r4.go(r4.is(Pt) ? i3 : n5);
          }), u2.push(n4);
        }
        function a2() {
          I(n3.Elements.list, nt, t3.direction === Jn ? "vertical" : "");
        }
        function s2(n4) {
          i2.go(n4.index);
        }
        function l2(n4, t4) {
          b(Yt, Tt(t4)) && (s2(n4), F(t4));
        }
        return {
          setup: R(n3.Media.set, { slideFocus: en(o2) ? r3 : o2 }, true),
          mount: e2,
          destroy: c2,
          remount: function() {
            c2(), e2();
          }
        };
      },
      Wheel: function(e2, c2, f2) {
        var n3 = Q(e2).bind, a2 = 0;
        function t3(n4) {
          var t4, i2, r3, o2, u2;
          n4.cancelable && (t4 = (u2 = n4.deltaY) < 0, i2 = mn(n4), r3 = f2.wheelMinThreshold || 0, o2 = f2.wheelSleep || 0, U(u2) > r3 && o2 < i2 - a2 && (e2.go(t4 ? "<" : ">"), a2 = i2), u2 = t4, f2.releaseWheel && !e2.state.is(G) && -1 === c2.Controller.getAdjacent(u2) || F(n4));
        }
        return {
          mount: function() {
            f2.wheel && n3(c2.Elements.track, "wheel", t3, jt);
          }
        };
      },
      Live: function(n3, t3, i2) {
        var r3 = Q(n3).on, o2 = t3.Elements.track, u2 = i2.live && !i2.isNavigation, e2 = j("span", wt), c2 = qn(90, R(f2, false));
        function f2(n4) {
          I(o2, rt, n4), n4 ? (L(o2, e2), c2.start()) : (T(e2), c2.cancel());
        }
        function a2(n4) {
          u2 && I(o2, it, n4 ? "off" : "polite");
        }
        return {
          mount: function() {
            u2 && (a2(!t3.Autoplay.isPaused()), I(o2, ot, true), e2.textContent = "\u2026", r3(Fn, R(a2, true)), r3(Xn, R(a2, false)), r3([Dn, V], R(f2, true)));
          },
          disable: a2,
          destroy: function() {
            P(o2, [it, ot, rt]), T(e2);
          }
        };
      }
    }), qt = { type: "slide", role: "region", speed: 400, perPage: 1, cloneStatus: true, arrows: true, pagination: true, paginationKeyboard: true, interval: 5e3, pauseOnHover: true, pauseOnFocus: true, resetProgress: true, easing: "cubic-bezier(0.25, 1, 0.5, 1)", drag: true, direction: "ltr", trimSpace: true, focusableNodes: "a, button, textarea, input, select, iframe", live: true, classes: { slide: at, clone: st, arrows: dt, arrow: vt, prev: ht, next: pt, pagination: gt, page: mt, spinner: i + "spinner" }, i18n: { prev: "Previous slide", next: "Next slide", first: "Go to first slide", last: "Go to last slide", slideX: "Go to slide %s", pageX: "Go to page %s", play: "Start autoplay", pause: "Pause autoplay", carousel: "carousel", slide: "slide", select: "Select a slide to show", slideLabel: "%s of %s" }, reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" } };
    function Bt(n3, t3, i2) {
      var r3 = t3.Slides;
      function o2() {
        r3.forEach(function(n4) {
          n4.style("transform", "translateX(-" + 100 * n4.index + "%)");
        });
      }
      return {
        mount: function() {
          Q(n3).on([B, J], o2);
        },
        start: function(n4, t4) {
          r3.style("transition", "opacity " + i2.speed + "ms " + i2.easing), p(t4);
        },
        cancel: on
      };
    }
    function Ht(u2, n3, e2) {
      var c2, f2 = n3.Move, a2 = n3.Controller, s2 = n3.Scroll, t3 = n3.Elements.list, l2 = R(_, t3, "transition");
      function i2() {
        l2(""), s2.cancel();
      }
      return {
        mount: function() {
          Q(u2).bind(t3, "transitionend", function(n4) {
            n4.target === t3 && c2 && (i2(), c2());
          });
        },
        start: function(n4, t4) {
          var i3 = f2.toPosition(n4, true), r3 = f2.getPosition(), o2 = (function(n5) {
            var t5 = e2.rewindSpeed;
            if (u2.is(Mt) && t5) {
              var i4 = a2.getIndex(true), r4 = a2.getEnd();
              if (0 === i4 && r4 <= n5 || r4 <= i4 && 0 === n5) return t5;
            }
            return e2.speed;
          })(n4);
          1 <= U(i3 - r3) && 1 <= o2 ? e2.useScroll ? s2.scroll(i3, o2, false, t4) : (l2("transform " + o2 + "ms " + e2.easing), f2.translate(i3, true), c2 = t4) : (f2.jump(n4), t4());
        },
        cancel: i2
      };
    }
    t2 = (function() {
      function i2(n4, t3) {
        this.event = Q(), this.Components = {}, this.state = s(1), this.splides = [], this.n = {}, this.t = {};
        n4 = C(n4) ? pn(document, n4) : n4;
        bn(n4, n4 + " is invalid."), t3 = d({ label: z(this.root = n4, nn) || "", labelledby: z(n4, Zn) || "" }, qt, i2.defaults, t3 || {});
        try {
          d(t3, JSON.parse(z(n4, f)));
        } catch (n5) {
          bn(false, "Invalid JSON");
        }
        this.n = Object.create(d({}, t3));
      }
      var n3 = i2.prototype;
      return n3.mount = function(n4, t3) {
        var i3 = this, r3 = this.state, o2 = this.Components;
        return bn(r3.is([1, 7]), "Already mounted!"), r3.set(1), this.i = o2, this.r = t3 || this.r || (this.is(It) ? Bt : Ht), this.t = n4 || this.t, w(an({}, Ut, this.t, { Transition: this.r }), function(n5, t4) {
          n5 = n5(i3, o2, i3.n);
          (o2[t4] = n5).setup && n5.setup();
        }), w(o2, function(n5) {
          n5.mount && n5.mount();
        }), this.emit(B), M(this.root, "is-initialized"), r3.set(3), this.emit("ready"), this;
      }, n3.sync = function(n4) {
        return this.splides.push({ splide: n4 }), n4.splides.push({ splide: this, isParent: true }), this.state.is(3) && (this.i.Sync.remount(), n4.Components.Sync.remount()), this;
      }, n3.go = function(n4) {
        return this.i.Controller.go(n4), this;
      }, n3.on = function(n4, t3) {
        return this.event.on(n4, t3), this;
      }, n3.off = function(n4) {
        return this.event.off(n4), this;
      }, n3.emit = function(n4) {
        var t3;
        return (t3 = this.event).emit.apply(t3, [n4].concat(o(arguments, 1))), this;
      }, n3.add = function(n4, t3) {
        return this.i.Slides.add(n4, t3), this;
      }, n3.remove = function(n4) {
        return this.i.Slides.remove(n4), this;
      }, n3.is = function(n4) {
        return this.n.type === n4;
      }, n3.refresh = function() {
        return this.emit(J), this;
      }, n3.destroy = function(t3) {
        void 0 === t3 && (t3 = true);
        var n4 = this.event, i3 = this.state;
        return i3.is(1) ? Q(this).on("ready", this.destroy.bind(this, t3)) : (w(
          this.i,
          function(n5) {
            n5.destroy && n5.destroy(t3);
          },
          true
        ), n4.emit(a), n4.destroy(), t3 && D(this.splides), i3.set(7)), this;
      }, Jt(i2, [
        {
          key: "options",
          get: function() {
            return this.n;
          },
          set: function(n4) {
            this.i.Media.set(n4, true, true);
          }
        },
        {
          key: "length",
          get: function() {
            return this.i.Slides.getLength(true);
          }
        },
        {
          key: "index",
          get: function() {
            return this.i.Controller.getIndex();
          }
        }
      ]), i2;
    })();
    return t2.defaults = {}, t2.STATES = r2, t2;
  }, "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (n = "undefined" != typeof globalThis ? globalThis : n || self).Splide = t();

  // src/assets/libs/js/viewer.js
  (function() {
    "use strict";
    Object.assign || (Object.assign = function(a, b) {
      for (var c = Object.keys(b), e = 0, f; e < c.length; e++) f = c[e], a[f] = b[f];
      return a;
    });
    Element.prototype.closest || (Element.prototype.closest = function(a) {
      a = a.substring(1);
      for (var b = this; b && 1 === b.nodeType; ) {
        if (b.classList.contains(a)) return b;
        b = b.parentElement;
      }
      return null;
    });
    function d(a, b, c) {
      a.classList[c ? "add" : "remove"](b);
    }
    function g(a, b, c) {
      c = "" + c;
      a["_s_" + b] !== c && (a.style.setProperty(b, c), a["_s_" + b] = c);
    }
    var aa = 0;
    function ba(a, b) {
      b && (g(a, "transition", "none"), b());
      aa || (aa = a.clientTop && 0);
      b && g(a, "transition", "");
    }
    function h(a, b, c, e) {
      k(true, a, b, c, e);
    }
    function k(a, b, c, e, f) {
      b[(a ? "add" : "remove") + "EventListener"](c, e, f || false === f ? f : true);
    }
    function ca(a, b) {
      a.stopPropagation();
      b && a.preventDefault();
    }
    function l(a, b) {
      g(a, "display", b ? "" : "none");
    }
    function da(a, b) {
      g(a, "visibility", b ? "" : "hidden");
    }
    function m(a, b) {
      g(a, "transition", b ? "" : "none");
    }
    var n2 = "theme download play page close autofit zoom-in zoom-out prev next fullscreen".split(" "), ea = { page: 1, close: 1, autofit: 1, "zoom-in": 1, "zoom-out": 1, prev: 1, next: 1, fullscreen: 1 };
    var p = document.createElement("div");
    p.id = "spotlight";
    p.innerHTML = "<div class=spl-spinner></div><div class=spl-track><div class=spl-scene><div class=spl-pane></div></div></div><div class=spl-header><div class=spl-page> </div></div><div class=spl-progress></div><div class=spl-footer><div class=spl-title> </div><div class=spl-description> </div><div class=spl-button> </div></div><div class=spl-prev></div><div class=spl-next></div>";
    var fa = {}, ha = document.createElement("video");
    function ia(a, b, c, e) {
      if ("node" !== e) {
        for (var f = Object.keys(c), A = 0, w; A < f.length; A++)
          if (w = f[A], 3 < w.length && 0 === w.indexOf("src")) {
            if ("video" === e) {
              var F = fa[w];
              if (F) {
                if (0 < F) {
                  var Ea = c[w];
                  break;
                }
              } else if (ha.canPlayType("video/" + w.substring(3).replace("-", "").toLowerCase())) {
                fa[w] = 1;
                Ea = c[w];
                break;
              } else fa[w] = -1;
            } else if (F = parseInt(w.substring(4), 10)) {
              if (F = Math.abs(b - F), !hb || F < hb) {
                var hb = F;
                Ea = c[w];
              }
            }
          }
      }
      return Ea || c.src || c.href || a.src || a.href;
    }
    var q = {}, ja = navigator.connection, ka = window.devicePixelRatio || 1, r2, t2, la, ma, u, na, oa, pa, v, qa, ra, sa, x, y, z, B, C, D, ta, E, G, ua, va, wa, xa, ya, za, H, Aa, Ba, Ca, Da, I, Fa, Ga, Ha, Ia, J, K, L, M, N, Ja = document.createElement("img"), Ka, La, Ma, Na, Oa, Pa, Qa, Ra, Sa, Ta, Ua, O, Va, P, Q, R, S, Wa, T, Xa;
    h(document, "click", Ya);
    function Za() {
      function a(c) {
        return q[c] = (p || document).getElementsByClassName("spl-" + c)[0];
      }
      if (!K) {
        K = document.body;
        Ka = a("scene");
        La = a("header");
        Ma = a("footer");
        Na = a("title");
        Oa = a("description");
        Pa = a("button");
        Qa = a("prev");
        Ra = a("next");
        Ta = a("page");
        O = a("progress");
        Va = a("spinner");
        M = [a("pane")];
        U("close", $a);
        K[T = "requestFullscreen"] || K[T = "msRequestFullscreen"] || K[T = "webkitRequestFullscreen"] || K[T = "mozRequestFullscreen"] || (T = "");
        T ? (Xa = T.replace("request", "exit").replace("mozRequest", "mozCancel").replace("Request", "Exit"), Sa = U("fullscreen", ab)) : n2.pop();
        U("autofit", V);
        U("zoom-in", bb);
        U("zoom-out", cb);
        U("theme", db);
        Ua = U("play", W);
        U("download", eb);
        h(Qa, "click", fb);
        h(Ra, "click", gb);
        var b = a("track");
        h(b, "mousedown", ib);
        h(b, "mousemove", jb);
        h(b, "mouseleave", kb);
        h(b, "mouseup", kb);
        h(b, "touchstart", ib, { passive: false });
        h(b, "touchmove", jb, { passive: true });
        h(b, "touchend", kb);
        h(Pa, "click", function() {
          Da ? Da(z, D) : Ca && (location.href = Ca);
        });
      }
    }
    function U(a, b) {
      var c = document.createElement("div");
      c.className = "spl-" + a;
      h(c, "click", b);
      La.appendChild(c);
      return q[a] = c;
    }
    function Ya(a) {
      var b = a.target.closest(".spotlight");
      if (b) {
        ca(a, true);
        a = b.closest(".spotlight-group");
        C = (a || document).getElementsByClassName("spotlight");
        for (var c = 0; c < C.length; c++)
          if (C[c] === b) {
            E = a && a.dataset;
            lb(c + 1);
            break;
          }
      }
    }
    function lb(a) {
      if (B = C.length) {
        K || Za();
        va && va(a);
        for (var b = M[0], c = b.parentNode, e = M.length; e < B; e++) {
          var f = b.cloneNode(false);
          g(f, "left", 100 * e + "%");
          c.appendChild(f);
          M[e] = f;
        }
        L || (K.appendChild(p), mb());
        z = a || 1;
        m(Ka);
        nb(true);
        T && l(Sa, 0 < screen.availHeight - window.innerHeight);
        history.pushState({ spl: 1 }, "");
        history.pushState({ spl: 2 }, "");
        m(p, true);
        d(K, "hide-scrollbars", true);
        d(p, "show", true);
        ob(true);
        mb();
        X();
        H && W(true, true);
      }
    }
    function Y(a, b) {
      a = D[a];
      return "undefined" !== typeof a ? (a = "" + a, "false" !== a && (a || b)) : b;
    }
    function pb(a) {
      a ? ba(N, pb) : (m(Ka, Ia), g(N, "opacity", Ha ? 0 : 1), qb(Ga && 0.8), J && d(N, J, true));
    }
    function rb(a) {
      L = M[a - 1];
      N = L.firstChild;
      z = a;
      if (N) x && V(), ya && d(N, ya, true), pb(true), J && d(N, J), Ha && g(N, "opacity", 1), Ga && g(N, "transform", ""), g(N, "visibility", "visible"), Q && (Ja.src = Q), H && sb(R);
      else {
        var b = P.media, c = Y("spinner", true);
        if ("video" === b)
          tb(c, true), N = document.createElement("video"), N.onloadedmetadata = function() {
            N === this && (N.onerror = null, N.width = N.videoWidth, N.height = N.videoHeight, ub(), tb(c), rb(a));
          }, N.poster = D.poster, N.preload = Ba ? "auto" : "metadata", N.controls = Y("controls", true), N.autoplay = D.autoplay, N.h = Y("inline"), N.muted = Y("muted"), N.src = P.src, L.appendChild(N);
        else {
          if ("node" === b) {
            N = P.src;
            "string" === typeof N && (N = document.querySelector(N));
            N && (N.g || (N.g = N.parentNode), ub(), L.appendChild(N), rb(a));
            return;
          }
          tb(c, true);
          N = document.createElement("img");
          N.onload = function() {
            N === this && (N.onerror = null, tb(c), rb(a), ub());
          };
          N.src = P.src;
          L.appendChild(N);
        }
        N && (c || g(N, "visibility", "visible"), N.onerror = function() {
          N === this && (vb(N), d(Va, "error", true), tb(c));
        });
      }
    }
    function tb(a, b) {
      a && d(Va, "spin", b);
    }
    function wb() {
      return document.fullscreen || document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
    }
    function xb() {
      mb();
      N && ub();
      if (T) {
        var a = wb();
        d(Sa, "on", a);
        a || l(Sa, 0 < screen.availHeight - window.innerHeight);
      }
    }
    function mb() {
      u = p.clientWidth;
      na = p.clientHeight;
    }
    function ub() {
      oa = N.clientWidth;
      pa = N.clientHeight;
    }
    function qb(a) {
      g(N, "transform", "translate(-50%, -50%) scale(" + (a || v) + ")");
    }
    function Z(a, b) {
      g(L, "transform", a || b ? "translate(" + a + "px, " + b + "px)" : "");
    }
    function yb(a, b, c) {
      b ? ba(Ka, function() {
        yb(a, false, c);
      }) : g(Ka, "transform", "translateX(" + (100 * -a + (c || 0)) + "%)");
    }
    function ob(a) {
      k(a, window, "keydown", zb);
      k(a, window, "wheel", Ab);
      k(a, window, "resize", xb);
      k(a, window, "popstate", Bb);
    }
    function Bb(a) {
      L && a.state.spl && $a(true);
    }
    function zb(a) {
      if (L) {
        var b = false !== D["zoom-in"];
        switch (a.keyCode) {
          case 8:
            b && V();
            break;
          case 27:
            $a();
            break;
          case 32:
            H && W();
            break;
          case 37:
            fb();
            break;
          case 39:
            gb();
            break;
          case 38:
          case 107:
          case 187:
            b && bb();
            break;
          case 40:
          case 109:
          case 189:
            b && cb();
        }
      }
    }
    function Ab(a) {
      L && false !== D["zoom-in"] && (a = a.deltaY, 0 > 0.5 * (0 > a ? 1 : a ? -1 : 0) ? cb() : bb());
    }
    function W(a, b) {
      ("boolean" === typeof a ? a : !R) === !R && (R = R ? clearTimeout(R) : 1, d(Ua, "on", R), b || sb(R));
    }
    function sb(a) {
      ua && (ba(O, function() {
        g(O, "transition-duration", "");
        g(O, "transform", "");
      }), a && (g(O, "transition-duration", Fa + "s"), g(O, "transform", "translateX(0)")));
      a && (R = setTimeout(gb, 1e3 * Fa));
    }
    function X() {
      za && (Wa = Date.now() + 2950, S || (d(p, "menu", true), Cb(3e3)));
    }
    function Cb(a) {
      S = setTimeout(function() {
        var b = Date.now();
        b >= Wa ? (d(p, "menu"), S = 0) : Cb(Wa - b);
      }, a);
    }
    function Db(a) {
      "boolean" === typeof a && (S = a ? S : 0);
      S ? (S = clearTimeout(S), d(p, "menu")) : X();
    }
    function ib(a) {
      ca(a, true);
      qa = true;
      ra = false;
      var b = a.touches;
      b && (b = b[0]) && (a = b);
      la = a.pageX;
      ma = a.pageY;
      m(L);
    }
    function kb(a) {
      ca(a);
      if (qa) {
        if (ra) {
          if (ra && v === 1) {
            var threshold = u / 120;
            var nextSlide = r2 < -threshold && (z < B || G);
            var prevSlide = r2 > threshold && (1 < z || G);
            if (nextSlide || prevSlide) {
              yb(z - 1, true, r2 / u * 100);
              if (nextSlide) {
                gb();
              } else if (prevSlide) {
                fb();
              }
            }
            r2 = 0;
            Z();
          }
          if (v > 1) {
            m(L, true);
            qa = false;
            return;
          }
          m(L, true);
        } else {
          Db();
        }
        qa = false;
      }
    }
    function jb(a) {
      ca(a);
      if (qa) {
        var touch = a.touches;
        touch && (touch = touch[0]) && (a = touch);
        var currentX = a.pageX;
        var currentY = a.pageY;
        var deltaX = currentX - la;
        var deltaY = currentY - ma;
        la = currentX;
        ma = currentY;
        var overflowX = oa * v - u;
        var overflowY = pa * v - na;
        if (v === 1) {
          r2 += deltaX;
        } else {
          if (overflowX > 0) {
            r2 += deltaX;
            var limitX = overflowX / 2;
            if (r2 > limitX) r2 = limitX;
            if (r2 < -limitX) r2 = -limitX;
          }
          if (overflowY > 0) {
            t2 += deltaY;
            var limitY = overflowY / 2;
            if (t2 > limitY) t2 = limitY;
            if (t2 < -limitY) t2 = -limitY;
          }
        }
        ra = true;
        Z(r2, t2);
      } else {
        X();
      }
    }
    function ab(a) {
      var b = wb();
      if ("boolean" !== typeof a || a !== !!b)
        if (b) document[Xa]();
        else p[T]();
    }
    function db(a) {
      "string" !== typeof a && (a = y ? "" : Aa || "white");
      y !== a && (y && d(p, y), a && d(p, a, true), y = a);
    }
    function V(a) {
      "boolean" === typeof a && (x = !a);
      x = 1 === v && !x;
      d(N, "autofit", x);
      g(N, "transform", "");
      v = 1;
      t2 = r2 = 0;
      ub();
      m(L);
      Z();
    }
    function bb(isButton) {
      var factor = isButton ? 1.25 : 1.05;
      var a = v * factor;
      if (a > 5) a = 5;
      Eb(a);
    }
    function cb(isButton) {
      var factor = isButton ? 0.8 : 0.95;
      var a = v * factor;
      if (a < 0.2) a = 0.2;
      Eb(a);
    }
    function Eb(a) {
      v = a || 1;
      g(N, "transition", "transform 0.2s ease-out");
      qb();
      setTimeout(() => g(N, "transition", ""), 200);
    }
    function eb() {
      var a = K, b = document.createElement("a"), c = N.src;
      b.href = c;
      b.download = c.substring(c.lastIndexOf("/") + 1);
      a.appendChild(b);
      b.click();
      a.removeChild(b);
    }
    function $a(a) {
      setTimeout(function() {
        K.removeChild(p);
        L = N = P = D = E = C = va = wa = xa = Da = null;
      }, 200);
      d(K, "hide-scrollbars");
      d(p, "show");
      ab(false);
      ob();
      history.go(true === a ? -1 : -2);
      Q && (Ja.src = "");
      R && W();
      N && vb(N);
      S && (S = clearTimeout(S));
      y && db();
      I && d(p, I);
      xa && xa();
    }
    function vb(a) {
      if (a.g) a.g.appendChild(a), a.g = null;
      else {
        var b = a.parentNode;
        b && b.removeChild(a);
        a.src = a.onerror = "";
      }
    }
    function fb(a) {
      a && X();
      if (1 < B) {
        if (1 < z) return Fb(z - 1);
        if (G) return yb(B, true), Fb(B);
      }
    }
    function gb(a) {
      a && X();
      if (1 < B) {
        if (z < B) return Fb(z + 1);
        if (G) return yb(-1, true), Fb(1);
        R && W();
      }
    }
    function Fb(a) {
      if (a !== z) {
        R ? (clearTimeout(R), sb()) : X();
        var b = a > z;
        z = a;
        nb(b);
        return true;
      }
    }
    function Gb(a) {
      var b = C[z - 1], c = b;
      D = {};
      E && Object.assign(D, E);
      Object.assign(D, c.dataset || c);
      ta = D.media;
      Da = D.onclick;
      Aa = D.theme;
      I = D["class"];
      za = Y("autohide", true);
      G = Y("infinite");
      ua = Y("progress", true);
      H = Y("autoslide");
      Ba = Y("preload", true);
      Ca = D.buttonHref;
      Fa = H && parseFloat(H) || 7;
      y || Aa && db(Aa);
      I && d(p, I, true);
      I && ba(p);
      if (c = D.control) {
        c = "string" === typeof c ? c.split(",") : c;
        for (var e = 0; e < n2.length; e++) D[n2[e]] = false;
        for (e = 0; e < c.length; e++) {
          var f = c[e].trim();
          "zoom" === f ? D["zoom-in"] = D["zoom-out"] = true : D[f] = true;
        }
      }
      c = D.animation;
      Ga = Ha = Ia = !c;
      J = false;
      if (c) for (c = "string" === typeof c ? c.split(",") : c, e = 0; e < c.length; e++) f = c[e].trim(), "scale" === f ? Ga = true : "fade" === f ? Ha = true : "slide" === f ? Ia = true : f && (J = f);
      ya = D.fit;
      e = ja && ja.downlink;
      c = Math.max(na, u) * ka;
      e && 1200 * e < c && (c = 1200 * e);
      var A;
      P = { media: ta, src: ia(b, c, D, ta), title: Y("title", b.alt || b.title || (A = b.firstElementChild) && (A.alt || A.title)) };
      Q && (Ja.src = Q = "");
      Ba && a && (b = C[z]) && (a = b.dataset || b, (A = a.media) && "image" !== A || (Q = ia(b, c, a, A)));
      for (b = 0; b < n2.length; b++) a = n2[b], l(q[a], Y(a, ea[a]));
    }
    function nb(a) {
      t2 = r2 = 0;
      v = 1;
      if (N)
        if (N.onerror) vb(N);
        else {
          var b = N;
          setTimeout(function() {
            b && N !== b && (vb(b), b = null);
          }, 650);
          pb();
          Z();
        }
      Gb(a);
      yb(z - 1);
      d(Va, "error");
      rb(z);
      m(L);
      Z();
      a = P.title;
      var c = Y("description"), e = Y("button"), f = a || c || e;
      f && (a && (Na.firstChild.nodeValue = a), c && (Oa.firstChild.nodeValue = c), e && (Pa.firstChild.nodeValue = e), l(Na, a), l(Oa, c), l(Pa, e), g(Ma, "transform", "all" === za ? "" : "none"));
      za || d(p, "menu", true);
      da(Ma, f);
      da(Qa, G || 1 < z);
      da(Ra, G || z < B);
      Ta.firstChild.nodeValue = 1 < B ? z + " / " + B : "";
      wa && wa(z, D);
    }
    window.Spotlight = {
      init: Za,
      theme: db,
      fullscreen: ab,
      download: eb,
      autofit: V,
      next: gb,
      prev: fb,
      goto: Fb,
      close: $a,
      zoom: Eb,
      menu: Db,
      show: function(a, b, c) {
        C = a;
        b && (E = b, va = b.onshow, wa = b.onchange, xa = b.onclose, c = c || b.index);
        lb(c);
      },
      play: W,
      addControl: U,
      removeControl: function(a) {
        var b = q[a];
        b && (La.removeChild(b), q[a] = null);
      }
    };
  }).call(void 0);

  // node_modules/swiper/shared/ssr-window.esm.mjs
  function isObject(obj) {
    return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
  }
  function extend(target = {}, src = {}) {
    const noExtend = ["__proto__", "constructor", "prototype"];
    Object.keys(src).filter((key) => noExtend.indexOf(key) < 0).forEach((key) => {
      if (typeof target[key] === "undefined") target[key] = src[key];
      else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
        extend(target[key], src[key]);
      }
    });
  }
  var ssrDocument = {
    body: {},
    addEventListener() {
    },
    removeEventListener() {
    },
    activeElement: {
      blur() {
      },
      nodeName: ""
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return null;
    },
    createEvent() {
      return {
        initEvent() {
        }
      };
    },
    createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute() {
        },
        getElementsByTagName() {
          return [];
        }
      };
    },
    createElementNS() {
      return {};
    },
    importNode() {
      return null;
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: ""
    }
  };
  function getDocument() {
    const doc = typeof document !== "undefined" ? document : {};
    extend(doc, ssrDocument);
    return doc;
  }
  var ssrWindow = {
    document: ssrDocument,
    navigator: {
      userAgent: ""
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: ""
    },
    history: {
      replaceState() {
      },
      pushState() {
      },
      go() {
      },
      back() {
      }
    },
    CustomEvent: function CustomEvent2() {
      return this;
    },
    addEventListener() {
    },
    removeEventListener() {
    },
    getComputedStyle() {
      return {
        getPropertyValue() {
          return "";
        }
      };
    },
    Image() {
    },
    Date() {
    },
    screen: {},
    setTimeout() {
    },
    clearTimeout() {
    },
    matchMedia() {
      return {};
    },
    requestAnimationFrame(callback) {
      if (typeof setTimeout === "undefined") {
        callback();
        return null;
      }
      return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
      if (typeof setTimeout === "undefined") {
        return;
      }
      clearTimeout(id);
    }
  };
  function getWindow() {
    const win = typeof window !== "undefined" ? window : {};
    extend(win, ssrWindow);
    return win;
  }

  // node_modules/swiper/shared/utils.mjs
  function classesToTokens(classes2 = "") {
    return classes2.trim().split(" ").filter((c) => !!c.trim());
  }
  function deleteProps(obj) {
    const object = obj;
    Object.keys(object).forEach((key) => {
      try {
        object[key] = null;
      } catch (e) {
      }
      try {
        delete object[key];
      } catch (e) {
      }
    });
  }
  function nextTick(callback, delay = 0) {
    return setTimeout(callback, delay);
  }
  function now() {
    return Date.now();
  }
  function getComputedStyle2(el) {
    const window2 = getWindow();
    let style;
    if (window2.getComputedStyle) {
      style = window2.getComputedStyle(el, null);
    }
    if (!style && el.currentStyle) {
      style = el.currentStyle;
    }
    if (!style) {
      style = el.style;
    }
    return style;
  }
  function getTranslate(el, axis = "x") {
    const window2 = getWindow();
    let matrix;
    let curTransform;
    let transformMatrix;
    const curStyle = getComputedStyle2(el);
    if (window2.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;
      if (curTransform.split(",").length > 6) {
        curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
      }
      transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
      matrix = transformMatrix.toString().split(",");
    }
    if (axis === "x") {
      if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m41;
      else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
      else curTransform = parseFloat(matrix[4]);
    }
    if (axis === "y") {
      if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m42;
      else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
      else curTransform = parseFloat(matrix[5]);
    }
    return curTransform || 0;
  }
  function isObject2(o) {
    return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
  }
  function isNode(node) {
    if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
      return node instanceof HTMLElement;
    }
    return node && (node.nodeType === 1 || node.nodeType === 11);
  }
  function extend2(...args) {
    const to = Object(args[0]);
    for (let i = 1; i < args.length; i += 1) {
      const nextSource = args[i];
      if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
        const keysArray = Object.keys(Object(nextSource)).filter((key) => key !== "__proto__" && key !== "constructor" && key !== "prototype");
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== void 0 && desc.enumerable) {
            if (isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend2(to[nextKey], nextSource[nextKey]);
              }
            } else if (!isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
              to[nextKey] = {};
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend2(to[nextKey], nextSource[nextKey]);
              }
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  }
  function setCSSProperty(el, varName, varValue) {
    el.style.setProperty(varName, varValue);
  }
  function animateCSSModeScroll({
    swiper,
    targetPosition,
    side
  }) {
    const window2 = getWindow();
    const startPosition = -swiper.translate;
    let startTime = null;
    let time;
    const duration = swiper.params.speed;
    swiper.wrapperEl.style.scrollSnapType = "none";
    window2.cancelAnimationFrame(swiper.cssModeFrameID);
    const dir = targetPosition > startPosition ? "next" : "prev";
    const isOutOfBound = (current, target) => {
      return dir === "next" && current >= target || dir === "prev" && current <= target;
    };
    const animate = () => {
      time = (/* @__PURE__ */ new Date()).getTime();
      if (startTime === null) {
        startTime = time;
      }
      const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
      if (isOutOfBound(currentPosition, targetPosition)) {
        currentPosition = targetPosition;
      }
      swiper.wrapperEl.scrollTo({
        [side]: currentPosition
      });
      if (isOutOfBound(currentPosition, targetPosition)) {
        swiper.wrapperEl.style.overflow = "hidden";
        swiper.wrapperEl.style.scrollSnapType = "";
        setTimeout(() => {
          swiper.wrapperEl.style.overflow = "";
          swiper.wrapperEl.scrollTo({
            [side]: currentPosition
          });
        });
        window2.cancelAnimationFrame(swiper.cssModeFrameID);
        return;
      }
      swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
    };
    animate();
  }
  function elementChildren(element, selector = "") {
    const window2 = getWindow();
    const children = [...element.children];
    if (window2.HTMLSlotElement && element instanceof HTMLSlotElement) {
      children.push(...element.assignedElements());
    }
    if (!selector) {
      return children;
    }
    return children.filter((el) => el.matches(selector));
  }
  function elementIsChildOfSlot(el, slot) {
    const elementsQueue = [slot];
    while (elementsQueue.length > 0) {
      const elementToCheck = elementsQueue.shift();
      if (el === elementToCheck) {
        return true;
      }
      elementsQueue.push(...elementToCheck.children, ...elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : [], ...elementToCheck.assignedElements ? elementToCheck.assignedElements() : []);
    }
  }
  function elementIsChildOf(el, parent) {
    const window2 = getWindow();
    let isChild = parent.contains(el);
    if (!isChild && window2.HTMLSlotElement && parent instanceof HTMLSlotElement) {
      const children = [...parent.assignedElements()];
      isChild = children.includes(el);
      if (!isChild) {
        isChild = elementIsChildOfSlot(el, parent);
      }
    }
    return isChild;
  }
  function showWarning(text) {
    try {
      console.warn(text);
      return;
    } catch (err) {
    }
  }
  function createElement(tag, classes2 = []) {
    const el = document.createElement(tag);
    el.classList.add(...Array.isArray(classes2) ? classes2 : classesToTokens(classes2));
    return el;
  }
  function elementPrevAll(el, selector) {
    const prevEls = [];
    while (el.previousElementSibling) {
      const prev = el.previousElementSibling;
      if (selector) {
        if (prev.matches(selector)) prevEls.push(prev);
      } else prevEls.push(prev);
      el = prev;
    }
    return prevEls;
  }
  function elementNextAll(el, selector) {
    const nextEls = [];
    while (el.nextElementSibling) {
      const next = el.nextElementSibling;
      if (selector) {
        if (next.matches(selector)) nextEls.push(next);
      } else nextEls.push(next);
      el = next;
    }
    return nextEls;
  }
  function elementStyle(el, prop) {
    const window2 = getWindow();
    return window2.getComputedStyle(el, null).getPropertyValue(prop);
  }
  function elementIndex(el) {
    let child = el;
    let i;
    if (child) {
      i = 0;
      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1) i += 1;
      }
      return i;
    }
    return void 0;
  }
  function elementParents(el, selector) {
    const parents = [];
    let parent = el.parentElement;
    while (parent) {
      if (selector) {
        if (parent.matches(selector)) parents.push(parent);
      } else {
        parents.push(parent);
      }
      parent = parent.parentElement;
    }
    return parents;
  }
  function elementOuterSize(el, size, includeMargins) {
    const window2 = getWindow();
    if (includeMargins) {
      return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
    }
    return el.offsetWidth;
  }

  // node_modules/swiper/shared/swiper-core.mjs
  var support;
  function calcSupport() {
    const window2 = getWindow();
    const document2 = getDocument();
    return {
      smoothScroll: document2.documentElement && document2.documentElement.style && "scrollBehavior" in document2.documentElement.style,
      touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
    };
  }
  function getSupport() {
    if (!support) {
      support = calcSupport();
    }
    return support;
  }
  var deviceCached;
  function calcDevice({
    userAgent
  } = {}) {
    const support2 = getSupport();
    const window2 = getWindow();
    const platform = window2.navigator.platform;
    const ua = userAgent || window2.navigator.userAgent;
    const device = {
      ios: false,
      android: false
    };
    const screenWidth = window2.screen.width;
    const screenHeight = window2.screen.height;
    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    let ipad = ua.match(/(iPad)(?!\1).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const windows = platform === "Win32";
    let macos = platform === "MacIntel";
    const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
    if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      if (!ipad) ipad = [0, 1, "13_0_0"];
      macos = false;
    }
    if (android && !windows) {
      device.os = "android";
      device.android = true;
    }
    if (ipad || iphone || ipod) {
      device.os = "ios";
      device.ios = true;
    }
    return device;
  }
  function getDevice(overrides = {}) {
    if (!deviceCached) {
      deviceCached = calcDevice(overrides);
    }
    return deviceCached;
  }
  var browser;
  function calcBrowser() {
    const window2 = getWindow();
    const device = getDevice();
    let needPerspectiveFix = false;
    function isSafari() {
      const ua = window2.navigator.userAgent.toLowerCase();
      return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
    }
    if (isSafari()) {
      const ua = String(window2.navigator.userAgent);
      if (ua.includes("Version/")) {
        const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
        needPerspectiveFix = major < 16 || major === 16 && minor < 2;
      }
    }
    const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent);
    const isSafariBrowser = isSafari();
    const need3dFix = isSafariBrowser || isWebView && device.ios;
    return {
      isSafari: needPerspectiveFix || isSafariBrowser,
      needPerspectiveFix,
      need3dFix,
      isWebView
    };
  }
  function getBrowser() {
    if (!browser) {
      browser = calcBrowser();
    }
    return browser;
  }
  function Resize({
    swiper,
    on,
    emit
  }) {
    const window2 = getWindow();
    let observer = null;
    let animationFrame = null;
    const resizeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit("beforeResize");
      emit("resize");
    };
    const createObserver = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      observer = new ResizeObserver((entries) => {
        animationFrame = window2.requestAnimationFrame(() => {
          const {
            width,
            height
          } = swiper;
          let newWidth = width;
          let newHeight = height;
          entries.forEach(({
            contentBoxSize,
            contentRect,
            target
          }) => {
            if (target && target !== swiper.el) return;
            newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
            newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
          });
          if (newWidth !== width || newHeight !== height) {
            resizeHandler();
          }
        });
      });
      observer.observe(swiper.el);
    };
    const removeObserver = () => {
      if (animationFrame) {
        window2.cancelAnimationFrame(animationFrame);
      }
      if (observer && observer.unobserve && swiper.el) {
        observer.unobserve(swiper.el);
        observer = null;
      }
    };
    const orientationChangeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit("orientationchange");
    };
    on("init", () => {
      if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
        createObserver();
        return;
      }
      window2.addEventListener("resize", resizeHandler);
      window2.addEventListener("orientationchange", orientationChangeHandler);
    });
    on("destroy", () => {
      removeObserver();
      window2.removeEventListener("resize", resizeHandler);
      window2.removeEventListener("orientationchange", orientationChangeHandler);
    });
  }
  function Observer({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const observers = [];
    const window2 = getWindow();
    const attach = (target, options = {}) => {
      const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
      const observer = new ObserverFunc((mutations) => {
        if (swiper.__preventObserver__) return;
        if (mutations.length === 1) {
          emit("observerUpdate", mutations[0]);
          return;
        }
        const observerUpdate = function observerUpdate2() {
          emit("observerUpdate", mutations[0]);
        };
        if (window2.requestAnimationFrame) {
          window2.requestAnimationFrame(observerUpdate);
        } else {
          window2.setTimeout(observerUpdate, 0);
        }
      });
      observer.observe(target, {
        attributes: typeof options.attributes === "undefined" ? true : options.attributes,
        childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
        characterData: typeof options.characterData === "undefined" ? true : options.characterData
      });
      observers.push(observer);
    };
    const init = () => {
      if (!swiper.params.observer) return;
      if (swiper.params.observeParents) {
        const containerParents = elementParents(swiper.hostEl);
        for (let i = 0; i < containerParents.length; i += 1) {
          attach(containerParents[i]);
        }
      }
      attach(swiper.hostEl, {
        childList: swiper.params.observeSlideChildren
      });
      attach(swiper.wrapperEl, {
        attributes: false
      });
    };
    const destroy = () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
      observers.splice(0, observers.length);
    };
    extendParams({
      observer: false,
      observeParents: false,
      observeSlideChildren: false
    });
    on("init", init);
    on("destroy", destroy);
  }
  var eventsEmitter = {
    on(events2, handler, priority) {
      const self2 = this;
      if (!self2.eventsListeners || self2.destroyed) return self2;
      if (typeof handler !== "function") return self2;
      const method = priority ? "unshift" : "push";
      events2.split(" ").forEach((event2) => {
        if (!self2.eventsListeners[event2]) self2.eventsListeners[event2] = [];
        self2.eventsListeners[event2][method](handler);
      });
      return self2;
    },
    once(events2, handler, priority) {
      const self2 = this;
      if (!self2.eventsListeners || self2.destroyed) return self2;
      if (typeof handler !== "function") return self2;
      function onceHandler(...args) {
        self2.off(events2, onceHandler);
        if (onceHandler.__emitterProxy) {
          delete onceHandler.__emitterProxy;
        }
        handler.apply(self2, args);
      }
      onceHandler.__emitterProxy = handler;
      return self2.on(events2, onceHandler, priority);
    },
    onAny(handler, priority) {
      const self2 = this;
      if (!self2.eventsListeners || self2.destroyed) return self2;
      if (typeof handler !== "function") return self2;
      const method = priority ? "unshift" : "push";
      if (self2.eventsAnyListeners.indexOf(handler) < 0) {
        self2.eventsAnyListeners[method](handler);
      }
      return self2;
    },
    offAny(handler) {
      const self2 = this;
      if (!self2.eventsListeners || self2.destroyed) return self2;
      if (!self2.eventsAnyListeners) return self2;
      const index = self2.eventsAnyListeners.indexOf(handler);
      if (index >= 0) {
        self2.eventsAnyListeners.splice(index, 1);
      }
      return self2;
    },
    off(events2, handler) {
      const self2 = this;
      if (!self2.eventsListeners || self2.destroyed) return self2;
      if (!self2.eventsListeners) return self2;
      events2.split(" ").forEach((event2) => {
        if (typeof handler === "undefined") {
          self2.eventsListeners[event2] = [];
        } else if (self2.eventsListeners[event2]) {
          self2.eventsListeners[event2].forEach((eventHandler, index) => {
            if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
              self2.eventsListeners[event2].splice(index, 1);
            }
          });
        }
      });
      return self2;
    },
    emit(...args) {
      const self2 = this;
      if (!self2.eventsListeners || self2.destroyed) return self2;
      if (!self2.eventsListeners) return self2;
      let events2;
      let data;
      let context;
      if (typeof args[0] === "string" || Array.isArray(args[0])) {
        events2 = args[0];
        data = args.slice(1, args.length);
        context = self2;
      } else {
        events2 = args[0].events;
        data = args[0].data;
        context = args[0].context || self2;
      }
      data.unshift(context);
      const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
      eventsArray.forEach((event2) => {
        if (self2.eventsAnyListeners && self2.eventsAnyListeners.length) {
          self2.eventsAnyListeners.forEach((eventHandler) => {
            eventHandler.apply(context, [event2, ...data]);
          });
        }
        if (self2.eventsListeners && self2.eventsListeners[event2]) {
          self2.eventsListeners[event2].forEach((eventHandler) => {
            eventHandler.apply(context, data);
          });
        }
      });
      return self2;
    }
  };
  function updateSize() {
    const swiper = this;
    let width;
    let height;
    const el = swiper.el;
    if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
      width = swiper.params.width;
    } else {
      width = el.clientWidth;
    }
    if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
      height = swiper.params.height;
    } else {
      height = el.clientHeight;
    }
    if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
      return;
    }
    width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
    height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
    if (Number.isNaN(width)) width = 0;
    if (Number.isNaN(height)) height = 0;
    Object.assign(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height
    });
  }
  function updateSlides() {
    const swiper = this;
    function getDirectionPropertyValue(node, label) {
      return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
    }
    const params = swiper.params;
    const {
      wrapperEl,
      slidesEl,
      rtlTranslate: rtl,
      wrongRTL
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
    const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
    const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
    let snapGrid = [];
    const slidesGrid = [];
    const slidesSizesGrid = [];
    let offsetBefore = params.slidesOffsetBefore;
    if (typeof offsetBefore === "function") {
      offsetBefore = params.slidesOffsetBefore.call(swiper);
    }
    let offsetAfter = params.slidesOffsetAfter;
    if (typeof offsetAfter === "function") {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }
    const previousSnapGridLength = swiper.snapGrid.length;
    const previousSlidesGridLength = swiper.slidesGrid.length;
    const swiperSize = swiper.size - offsetBefore - offsetAfter;
    let spaceBetween = params.spaceBetween;
    let slidePosition = -offsetBefore;
    let prevSlideSize = 0;
    let index = 0;
    if (typeof swiperSize === "undefined") {
      return;
    }
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    swiper.virtualSize = -spaceBetween - offsetBefore - offsetAfter;
    slides.forEach((slideEl) => {
      if (rtl) {
        slideEl.style.marginLeft = "";
      } else {
        slideEl.style.marginRight = "";
      }
      slideEl.style.marginBottom = "";
      slideEl.style.marginTop = "";
    });
    if (params.centeredSlides && params.cssMode) {
      setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
      setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
    }
    if (params.cssMode) {
      setCSSProperty(wrapperEl, "--swiper-slides-offset-before", `${offsetBefore}px`);
      setCSSProperty(wrapperEl, "--swiper-slides-offset-after", `${offsetAfter}px`);
    }
    const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
    if (gridEnabled) {
      swiper.grid.initSlides(slides);
    } else if (swiper.grid) {
      swiper.grid.unsetSlides();
    }
    let slideSize;
    const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
      return typeof params.breakpoints[key].slidesPerView !== "undefined";
    }).length > 0;
    for (let i = 0; i < slidesLength; i += 1) {
      slideSize = 0;
      const slide2 = slides[i];
      if (slide2) {
        if (gridEnabled) {
          swiper.grid.updateSlide(i, slide2, slides);
        }
        if (elementStyle(slide2, "display") === "none") continue;
      }
      if (isVirtual && params.slidesPerView === "auto") {
        if (params.virtual.slidesPerViewAutoSlideSize) {
          slideSize = params.virtual.slidesPerViewAutoSlideSize;
        }
        if (slideSize && slide2) {
          if (params.roundLengths) slideSize = Math.floor(slideSize);
          slide2.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
        }
      } else if (params.slidesPerView === "auto") {
        if (shouldResetSlideSize) {
          slide2.style[swiper.getDirectionLabel("width")] = ``;
        }
        const slideStyles = getComputedStyle(slide2);
        const currentTransform = slide2.style.transform;
        const currentWebKitTransform = slide2.style.webkitTransform;
        if (currentTransform) {
          slide2.style.transform = "none";
        }
        if (currentWebKitTransform) {
          slide2.style.webkitTransform = "none";
        }
        if (params.roundLengths) {
          slideSize = swiper.isHorizontal() ? elementOuterSize(slide2, "width", true) : elementOuterSize(slide2, "height", true);
        } else {
          const width = getDirectionPropertyValue(slideStyles, "width");
          const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
          const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
          const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
          const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
          const boxSizing = slideStyles.getPropertyValue("box-sizing");
          if (boxSizing && boxSizing === "border-box") {
            slideSize = width + marginLeft + marginRight;
          } else {
            const {
              clientWidth,
              offsetWidth
            } = slide2;
            slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
          }
        }
        if (currentTransform) {
          slide2.style.transform = currentTransform;
        }
        if (currentWebKitTransform) {
          slide2.style.webkitTransform = currentWebKitTransform;
        }
        if (params.roundLengths) slideSize = Math.floor(slideSize);
      } else {
        slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
        if (params.roundLengths) slideSize = Math.floor(slideSize);
        if (slide2) {
          slide2.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
        }
      }
      if (slide2) {
        slide2.swiperSlideSize = slideSize;
      }
      slidesSizesGrid.push(slideSize);
      if (params.centeredSlides) {
        slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
        if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
      } else {
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
      }
      swiper.virtualSize += slideSize + spaceBetween;
      prevSlideSize = slideSize;
      index += 1;
    }
    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
    if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
      wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (params.setWrapperSize) {
      wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (gridEnabled) {
      swiper.grid.updateWrapperSize(slideSize, snapGrid);
    }
    if (!params.centeredSlides) {
      const isFractionalSlidesPerView = params.slidesPerView !== "auto" && params.slidesPerView % 1 !== 0;
      const shouldSnapToSlideEdge = params.snapToSlideEdge && !params.loop && (params.slidesPerView === "auto" || isFractionalSlidesPerView);
      let lastAllowedSnapIndex = snapGrid.length;
      if (shouldSnapToSlideEdge) {
        let minVisibleSlides;
        if (params.slidesPerView === "auto") {
          minVisibleSlides = 1;
          let accumulatedSize = 0;
          for (let i = slidesSizesGrid.length - 1; i >= 0; i -= 1) {
            accumulatedSize += slidesSizesGrid[i] + (i < slidesSizesGrid.length - 1 ? spaceBetween : 0);
            if (accumulatedSize <= swiperSize) {
              minVisibleSlides = slidesSizesGrid.length - i;
            } else {
              break;
            }
          }
        } else {
          minVisibleSlides = Math.floor(params.slidesPerView);
        }
        lastAllowedSnapIndex = Math.max(slidesLength - minVisibleSlides, 0);
      }
      const newSlidesGrid = [];
      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (shouldSnapToSlideEdge) {
          if (i <= lastAllowedSnapIndex) {
            newSlidesGrid.push(slidesGridItem);
          }
        } else if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
          newSlidesGrid.push(slidesGridItem);
        }
      }
      snapGrid = newSlidesGrid;
      if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
        if (!shouldSnapToSlideEdge) {
          snapGrid.push(swiper.virtualSize - swiperSize);
        }
      }
    }
    if (isVirtual && params.loop) {
      const size = slidesSizesGrid[0] + spaceBetween;
      if (params.slidesPerGroup > 1) {
        const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
        const groupSize = size * params.slidesPerGroup;
        for (let i = 0; i < groups; i += 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
        }
      }
      for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
        if (params.slidesPerGroup === 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + size);
        }
        slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
        swiper.virtualSize += size;
      }
    }
    if (snapGrid.length === 0) snapGrid = [0];
    if (spaceBetween !== 0) {
      const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
      slides.filter((_, slideIndex) => {
        if (!params.cssMode || params.loop) return true;
        if (slideIndex === slides.length - 1) {
          return false;
        }
        return true;
      }).forEach((slideEl) => {
        slideEl.style[key] = `${spaceBetween}px`;
      });
    }
    if (params.centeredSlides && params.centeredSlidesBounds) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
      snapGrid = snapGrid.map((snap) => {
        if (snap <= 0) return -offsetBefore;
        if (snap > maxSnap) return maxSnap + offsetAfter;
        return snap;
      });
    }
    if (params.centerInsufficientSlides) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      if (allSlidesSize < swiperSize) {
        const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
        snapGrid.forEach((snap, snapIndex) => {
          snapGrid[snapIndex] = snap - allSlidesOffset;
        });
        slidesGrid.forEach((snap, snapIndex) => {
          slidesGrid[snapIndex] = snap + allSlidesOffset;
        });
      }
    }
    Object.assign(swiper, {
      slides,
      snapGrid,
      slidesGrid,
      slidesSizesGrid
    });
    if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
      setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
      setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
      const addToSnapGrid = -swiper.snapGrid[0];
      const addToSlidesGrid = -swiper.slidesGrid[0];
      swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
      swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
    }
    if (slidesLength !== previousSlidesLength) {
      swiper.emit("slidesLengthChange");
    }
    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow) swiper.checkOverflow();
      swiper.emit("snapGridLengthChange");
    }
    if (slidesGrid.length !== previousSlidesGridLength) {
      swiper.emit("slidesGridLengthChange");
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    swiper.emit("slidesUpdated");
    if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
      const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
      const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
      if (slidesLength <= params.maxBackfaceHiddenSlides) {
        if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
      } else if (hasClassBackfaceClassAdded) {
        swiper.el.classList.remove(backFaceHiddenClass);
      }
    }
  }
  function updateAutoHeight(speed) {
    const swiper = this;
    const activeSlides = [];
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let newHeight = 0;
    let i;
    if (typeof speed === "number") {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }
    const getSlideByIndex = (index) => {
      if (isVirtual) {
        return swiper.slides[swiper.getSlideIndexByData(index)];
      }
      return swiper.slides[index];
    };
    if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
      if (swiper.params.centeredSlides) {
        (swiper.visibleSlides || []).forEach((slide2) => {
          activeSlides.push(slide2);
        });
      } else {
        for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
          const index = swiper.activeIndex + i;
          if (index > swiper.slides.length && !isVirtual) break;
          activeSlides.push(getSlideByIndex(index));
        }
      }
    } else {
      activeSlides.push(getSlideByIndex(swiper.activeIndex));
    }
    for (i = 0; i < activeSlides.length; i += 1) {
      if (typeof activeSlides[i] !== "undefined") {
        const height = activeSlides[i].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    }
    if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
  }
  function updateSlidesOffset() {
    const swiper = this;
    const slides = swiper.slides;
    const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
    for (let i = 0; i < slides.length; i += 1) {
      slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
    }
  }
  var toggleSlideClasses$1 = (slideEl, condition, className) => {
    if (condition && !slideEl.classList.contains(className)) {
      slideEl.classList.add(className);
    } else if (!condition && slideEl.classList.contains(className)) {
      slideEl.classList.remove(className);
    }
  };
  function updateSlidesProgress(translate2 = this && this.translate || 0) {
    const swiper = this;
    const params = swiper.params;
    const {
      slides,
      rtlTranslate: rtl,
      snapGrid
    } = swiper;
    if (slides.length === 0) return;
    if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
    let offsetCenter = -translate2;
    if (rtl) offsetCenter = translate2;
    swiper.visibleSlidesIndexes = [];
    swiper.visibleSlides = [];
    let spaceBetween = params.spaceBetween;
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    for (let i = 0; i < slides.length; i += 1) {
      const slide2 = slides[i];
      let slideOffset = slide2.swiperSlideOffset;
      if (params.cssMode && params.centeredSlides) {
        slideOffset -= slides[0].swiperSlideOffset;
      }
      const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
      const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
      const slideBefore = -(offsetCenter - slideOffset);
      const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
      const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
      const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
      if (isVisible) {
        swiper.visibleSlides.push(slide2);
        swiper.visibleSlidesIndexes.push(i);
      }
      toggleSlideClasses$1(slide2, isVisible, params.slideVisibleClass);
      toggleSlideClasses$1(slide2, isFullyVisible, params.slideFullyVisibleClass);
      slide2.progress = rtl ? -slideProgress : slideProgress;
      slide2.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
    }
  }
  function updateProgress(translate2) {
    const swiper = this;
    if (typeof translate2 === "undefined") {
      const multiplier = swiper.rtlTranslate ? -1 : 1;
      translate2 = swiper && swiper.translate && swiper.translate * multiplier || 0;
    }
    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let {
      progress,
      isBeginning,
      isEnd,
      progressLoop
    } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;
    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate2 - swiper.minTranslate()) / translatesDiff;
      const isBeginningRounded = Math.abs(translate2 - swiper.minTranslate()) < 1;
      const isEndRounded = Math.abs(translate2 - swiper.maxTranslate()) < 1;
      isBeginning = isBeginningRounded || progress <= 0;
      isEnd = isEndRounded || progress >= 1;
      if (isBeginningRounded) progress = 0;
      if (isEndRounded) progress = 1;
    }
    if (params.loop) {
      const firstSlideIndex = swiper.getSlideIndexByData(0);
      const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
      const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
      const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
      const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
      const translateAbs = Math.abs(translate2);
      if (translateAbs >= firstSlideTranslate) {
        progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
      } else {
        progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
      }
      if (progressLoop > 1) progressLoop -= 1;
    }
    Object.assign(swiper, {
      progress,
      progressLoop,
      isBeginning,
      isEnd
    });
    if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate2);
    if (isBeginning && !wasBeginning) {
      swiper.emit("reachBeginning toEdge");
    }
    if (isEnd && !wasEnd) {
      swiper.emit("reachEnd toEdge");
    }
    if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
      swiper.emit("fromEdge");
    }
    swiper.emit("progress", progress);
  }
  var toggleSlideClasses = (slideEl, condition, className) => {
    if (condition && !slideEl.classList.contains(className)) {
      slideEl.classList.add(className);
    } else if (!condition && slideEl.classList.contains(className)) {
      slideEl.classList.remove(className);
    }
  };
  function updateSlidesClasses() {
    const swiper = this;
    const {
      slides,
      params,
      slidesEl,
      activeIndex
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    const getFilteredSlide = (selector) => {
      return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
    };
    let activeSlide;
    let prevSlide;
    let nextSlide;
    if (isVirtual) {
      if (params.loop) {
        let slideIndex = activeIndex - swiper.virtual.slidesBefore;
        if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
        if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
      } else {
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
      }
    } else {
      if (gridEnabled) {
        activeSlide = slides.find((slideEl) => slideEl.column === activeIndex);
        nextSlide = slides.find((slideEl) => slideEl.column === activeIndex + 1);
        prevSlide = slides.find((slideEl) => slideEl.column === activeIndex - 1);
      } else {
        activeSlide = slides[activeIndex];
      }
    }
    if (activeSlide) {
      if (!gridEnabled) {
        nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !nextSlide) {
          nextSlide = slides[0];
        }
        prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !prevSlide === 0) {
          prevSlide = slides[slides.length - 1];
        }
      }
    }
    slides.forEach((slideEl) => {
      toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
      toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
      toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
    });
    swiper.emitSlidesClasses();
  }
  var processLazyPreloader = (swiper, imageEl) => {
    if (!swiper || swiper.destroyed || !swiper.params) return;
    const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
    const slideEl = imageEl.closest(slideSelector());
    if (slideEl) {
      let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
      if (!lazyEl && swiper.isElement) {
        if (slideEl.shadowRoot) {
          lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
        } else {
          requestAnimationFrame(() => {
            if (slideEl.shadowRoot) {
              lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
              if (lazyEl && !lazyEl.lazyPreloaderManaged) lazyEl.remove();
            }
          });
        }
      }
      if (lazyEl && !lazyEl.lazyPreloaderManaged) lazyEl.remove();
    }
  };
  var unlazy = (swiper, index) => {
    if (!swiper.slides[index]) return;
    const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
    if (imageEl) imageEl.removeAttribute("loading");
  };
  var preload = (swiper) => {
    if (!swiper || swiper.destroyed || !swiper.params) return;
    let amount = swiper.params.lazyPreloadPrevNext;
    const len = swiper.slides.length;
    if (!len || !amount || amount < 0) return;
    amount = Math.min(amount, len);
    const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
    const activeIndex = swiper.activeIndex;
    if (swiper.params.grid && swiper.params.grid.rows > 1) {
      const activeColumn = activeIndex;
      const preloadColumns = [activeColumn - amount];
      preloadColumns.push(...Array.from({
        length: amount
      }).map((_, i) => {
        return activeColumn + slidesPerView + i;
      }));
      swiper.slides.forEach((slideEl, i) => {
        if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
      });
      return;
    }
    const slideIndexLastInView = activeIndex + slidesPerView - 1;
    if (swiper.params.rewind || swiper.params.loop) {
      for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
        const realIndex = (i % len + len) % len;
        if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
      }
    } else {
      for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) {
        if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) {
          unlazy(swiper, i);
        }
      }
    }
  };
  function getActiveIndexByTranslate(swiper) {
    const {
      slidesGrid,
      params
    } = swiper;
    const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    let activeIndex;
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate2 >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
    }
    return activeIndex;
  }
  function updateActiveIndex(newActiveIndex) {
    const swiper = this;
    const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    const {
      snapGrid,
      params,
      activeIndex: previousIndex,
      realIndex: previousRealIndex,
      snapIndex: previousSnapIndex
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;
    const getVirtualRealIndex = (aIndex) => {
      let realIndex2 = aIndex - swiper.virtual.slidesBefore;
      if (realIndex2 < 0) {
        realIndex2 = swiper.virtual.slides.length + realIndex2;
      }
      if (realIndex2 >= swiper.virtual.slides.length) {
        realIndex2 -= swiper.virtual.slides.length;
      }
      return realIndex2;
    };
    if (typeof activeIndex === "undefined") {
      activeIndex = getActiveIndexByTranslate(swiper);
    }
    if (snapGrid.indexOf(translate2) >= 0) {
      snapIndex = snapGrid.indexOf(translate2);
    } else {
      const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
      snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
    }
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
    if (activeIndex === previousIndex && !swiper.params.loop) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit("snapIndexChange");
      }
      return;
    }
    if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.realIndex = getVirtualRealIndex(activeIndex);
      return;
    }
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    let realIndex;
    if (swiper.virtual && params.virtual.enabled) {
      if (params.loop) {
        realIndex = getVirtualRealIndex(activeIndex);
      } else {
        realIndex = activeIndex;
      }
    } else if (gridEnabled) {
      const firstSlideInColumn = swiper.slides.find((slideEl) => slideEl.column === activeIndex);
      let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
      if (Number.isNaN(activeSlideIndex)) {
        activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
      }
      realIndex = Math.floor(activeSlideIndex / params.grid.rows);
    } else if (swiper.slides[activeIndex]) {
      const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
      if (slideIndex) {
        realIndex = parseInt(slideIndex, 10);
      } else {
        realIndex = activeIndex;
      }
    } else {
      realIndex = activeIndex;
    }
    Object.assign(swiper, {
      previousSnapIndex,
      snapIndex,
      previousRealIndex,
      realIndex,
      previousIndex,
      activeIndex
    });
    if (swiper.initialized) {
      preload(swiper);
    }
    swiper.emit("activeIndexChange");
    swiper.emit("snapIndexChange");
    if (swiper.initialized || swiper.params.runCallbacksOnInit) {
      if (previousRealIndex !== realIndex) {
        swiper.emit("realIndexChange");
      }
      swiper.emit("slideChange");
    }
  }
  function updateClickedSlide(el, path) {
    const swiper = this;
    const params = swiper.params;
    let slide2 = el.closest(`.${params.slideClass}, swiper-slide`);
    if (!slide2 && swiper.isElement && path && path.length > 1 && path.includes(el)) {
      [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl) => {
        if (!slide2 && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) {
          slide2 = pathEl;
        }
      });
    }
    let slideFound = false;
    let slideIndex;
    if (slide2) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        if (swiper.slides[i] === slide2) {
          slideFound = true;
          slideIndex = i;
          break;
        }
      }
    }
    if (slide2 && slideFound) {
      swiper.clickedSlide = slide2;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt(slide2.getAttribute("data-swiper-slide-index"), 10);
      } else {
        swiper.clickedIndex = slideIndex;
      }
    } else {
      swiper.clickedSlide = void 0;
      swiper.clickedIndex = void 0;
      return;
    }
    if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
      swiper.slideToClickedSlide();
    }
  }
  var update = {
    updateSize,
    updateSlides,
    updateAutoHeight,
    updateSlidesOffset,
    updateSlidesProgress,
    updateProgress,
    updateSlidesClasses,
    updateActiveIndex,
    updateClickedSlide
  };
  function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
    const swiper = this;
    const {
      params,
      rtlTranslate: rtl,
      translate: translate2,
      wrapperEl
    } = swiper;
    if (params.virtualTranslate) {
      return rtl ? -translate2 : translate2;
    }
    if (params.cssMode) {
      return translate2;
    }
    let currentTranslate = getTranslate(wrapperEl, axis);
    currentTranslate += swiper.cssOverflowAdjustment();
    if (rtl) currentTranslate = -currentTranslate;
    return currentTranslate || 0;
  }
  function setTranslate(translate2, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl,
      params,
      wrapperEl,
      progress
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;
    if (swiper.isHorizontal()) {
      x = rtl ? -translate2 : translate2;
    } else {
      y = translate2;
    }
    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y;
    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      if (swiper.isHorizontal()) {
        x -= swiper.cssOverflowAdjustment();
      } else {
        y -= swiper.cssOverflowAdjustment();
      }
      wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    }
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate2 - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== progress) {
      swiper.updateProgress(translate2);
    }
    swiper.emit("setTranslate", swiper.translate, byController);
  }
  function minTranslate() {
    return -this.snapGrid[0];
  }
  function maxTranslate() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }
  function translateTo(translate2 = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
    const swiper = this;
    const {
      params,
      wrapperEl
    } = swiper;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    const minTranslate2 = swiper.minTranslate();
    const maxTranslate2 = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate2 > minTranslate2) newTranslate = minTranslate2;
    else if (translateBounds && translate2 < maxTranslate2) newTranslate = maxTranslate2;
    else newTranslate = translate2;
    swiper.updateProgress(newTranslate);
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: -newTranslate,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: -newTranslate,
          behavior: "smooth"
        });
      }
      return true;
    }
    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionEnd");
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionStart");
      }
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;
            swiper.animating = false;
            if (runCallbacks) {
              swiper.emit("transitionEnd");
            }
          };
        }
        swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
      }
    }
    return true;
  }
  var translate = {
    getTranslate: getSwiperTranslate,
    setTranslate,
    minTranslate,
    maxTranslate,
    translateTo
  };
  function setTransition(duration, byController) {
    const swiper = this;
    if (!swiper.params.cssMode) {
      swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
      swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
    }
    swiper.emit("setTransition", duration, byController);
  }
  function transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step
  }) {
    const {
      activeIndex,
      previousIndex
    } = swiper;
    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex) dir = "next";
      else if (activeIndex < previousIndex) dir = "prev";
      else dir = "reset";
    }
    swiper.emit(`transition${step}`);
    if (runCallbacks && dir === "reset") {
      swiper.emit(`slideResetTransition${step}`);
    } else if (runCallbacks && activeIndex !== previousIndex) {
      swiper.emit(`slideChangeTransition${step}`);
      if (dir === "next") {
        swiper.emit(`slideNextTransition${step}`);
      } else {
        swiper.emit(`slidePrevTransition${step}`);
      }
    }
  }
  function transitionStart(runCallbacks = true, direction) {
    const swiper = this;
    const {
      params
    } = swiper;
    if (params.cssMode) return;
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "Start"
    });
  }
  function transitionEnd(runCallbacks = true, direction) {
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.animating = false;
    if (params.cssMode) return;
    swiper.setTransition(0);
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "End"
    });
  }
  var transition = {
    setTransition,
    transitionStart,
    transitionEnd
  };
  function slideTo(index = 0, speed, runCallbacks = true, internal, initial) {
    if (typeof index === "string") {
      index = parseInt(index, 10);
    }
    const swiper = this;
    let slideIndex = index;
    if (slideIndex < 0) slideIndex = 0;
    const {
      params,
      snapGrid,
      slidesGrid,
      previousIndex,
      activeIndex,
      rtlTranslate: rtl,
      wrapperEl,
      enabled
    } = swiper;
    if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
    let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
    const translate2 = -snapGrid[snapIndex];
    if (params.normalizeSlideIndex) {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        const normalizedTranslate = -Math.floor(translate2 * 100);
        const normalizedGrid = Math.floor(slidesGrid[i] * 100);
        const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
        if (typeof slidesGrid[i + 1] !== "undefined") {
          if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
            slideIndex = i;
          } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
            slideIndex = i + 1;
          }
        } else if (normalizedTranslate >= normalizedGrid) {
          slideIndex = i;
        }
      }
    }
    if (swiper.initialized && slideIndex !== activeIndex) {
      if (!swiper.allowSlideNext && (rtl ? translate2 > swiper.translate && translate2 > swiper.minTranslate() : translate2 < swiper.translate && translate2 < swiper.minTranslate())) {
        return false;
      }
      if (!swiper.allowSlidePrev && translate2 > swiper.translate && translate2 > swiper.maxTranslate()) {
        if ((activeIndex || 0) !== slideIndex) {
          return false;
        }
      }
    }
    if (slideIndex !== (previousIndex || 0) && runCallbacks) {
      swiper.emit("beforeSlideChangeStart");
    }
    swiper.updateProgress(translate2);
    let direction;
    if (slideIndex > activeIndex) direction = "next";
    else if (slideIndex < activeIndex) direction = "prev";
    else direction = "reset";
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    const isInitialVirtual = isVirtual && initial;
    if (!isInitialVirtual && (rtl && -translate2 === swiper.translate || !rtl && translate2 === swiper.translate)) {
      swiper.updateActiveIndex(slideIndex);
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
      swiper.updateSlidesClasses();
      if (params.effect !== "slide") {
        swiper.setTranslate(translate2);
      }
      if (direction !== "reset") {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }
      return false;
    }
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      const t2 = rtl ? translate2 : -translate2;
      if (speed === 0) {
        if (isVirtual) {
          swiper.wrapperEl.style.scrollSnapType = "none";
          swiper._immediateVirtual = true;
        }
        if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
          swiper._cssModeVirtualInitialSet = true;
          requestAnimationFrame(() => {
            wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
          });
        } else {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
        }
        if (isVirtual) {
          requestAnimationFrame(() => {
            swiper.wrapperEl.style.scrollSnapType = "";
            swiper._immediateVirtual = false;
          });
        }
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: t2,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: t2,
          behavior: "smooth"
        });
      }
      return true;
    }
    const browser2 = getBrowser();
    const isSafari = browser2.isSafari;
    if (isVirtual && !initial && isSafari && swiper.isElement) {
      swiper.virtual.update(false, false, slideIndex);
    }
    swiper.setTransition(speed);
    swiper.setTranslate(translate2);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit("beforeTransitionStart", speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    if (speed === 0) {
      swiper.transitionEnd(runCallbacks, direction);
    } else if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }
      swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
    }
    return true;
  }
  function slideToLoop(index = 0, speed, runCallbacks = true, internal) {
    if (typeof index === "string") {
      const indexAsNumber = parseInt(index, 10);
      index = indexAsNumber;
    }
    const swiper = this;
    if (swiper.destroyed) return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
    let newIndex = index;
    if (swiper.params.loop) {
      if (swiper.virtual && swiper.params.virtual.enabled) {
        newIndex = newIndex + swiper.virtual.slidesBefore;
      } else {
        let targetSlideIndex;
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          targetSlideIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
        } else {
          targetSlideIndex = swiper.getSlideIndexByData(newIndex);
        }
        const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
        const {
          centeredSlides,
          slidesOffsetBefore,
          slidesOffsetAfter
        } = swiper.params;
        const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
        let slidesPerView = swiper.params.slidesPerView;
        if (slidesPerView === "auto") {
          slidesPerView = swiper.slidesPerViewDynamic();
        } else {
          slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
          if (bothDirections && slidesPerView % 2 === 0) {
            slidesPerView = slidesPerView + 1;
          }
        }
        let needLoopFix = cols - targetSlideIndex < slidesPerView;
        if (bothDirections) {
          needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
        }
        if (internal && bothDirections && swiper.params.slidesPerView !== "auto" && !gridEnabled) {
          needLoopFix = false;
        }
        if (needLoopFix) {
          const direction = bothDirections ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
          swiper.loopFix({
            direction,
            slideTo: true,
            activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
            slideRealIndex: direction === "next" ? swiper.realIndex : void 0
          });
        }
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          newIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
        } else {
          newIndex = swiper.getSlideIndexByData(newIndex);
        }
      }
    }
    requestAnimationFrame(() => {
      swiper.slideTo(newIndex, speed, runCallbacks, internal);
    });
    return swiper;
  }
  function slideNext(speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      enabled,
      params,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed) return swiper;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    let perGroup = params.slidesPerGroup;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
    }
    const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding) return false;
      swiper.loopFix({
        direction: "next"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
      if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
        requestAnimationFrame(() => {
          swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
        });
        return true;
      }
    }
    if (params.rewind && swiper.isEnd) {
      return swiper.slideTo(0, speed, runCallbacks, internal);
    }
    return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
  }
  function slidePrev(speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      params,
      snapGrid,
      slidesGrid,
      rtlTranslate,
      enabled,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed) return swiper;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding) return false;
      swiper.loopFix({
        direction: "prev"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
    }
    const translate2 = rtlTranslate ? swiper.translate : -swiper.translate;
    function normalize(val) {
      if (val < 0) return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }
    const normalizedTranslate = normalize(translate2);
    const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
    const isFreeMode = params.freeMode && params.freeMode.enabled;
    let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
    if (typeof prevSnap === "undefined" && (params.cssMode || isFreeMode)) {
      let prevSnapIndex;
      snapGrid.forEach((snap, snapIndex) => {
        if (normalizedTranslate >= snap) {
          prevSnapIndex = snapIndex;
        }
      });
      if (typeof prevSnapIndex !== "undefined") {
        prevSnap = isFreeMode ? snapGrid[prevSnapIndex] : snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
      }
    }
    let prevIndex = 0;
    if (typeof prevSnap !== "undefined") {
      prevIndex = slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
      if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
        prevIndex = Math.max(prevIndex, 0);
      }
    }
    if (params.rewind && swiper.isBeginning) {
      const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
    } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(prevIndex, speed, runCallbacks, internal);
      });
      return true;
    }
    return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
  }
  function slideReset(speed, runCallbacks = true, internal) {
    const swiper = this;
    if (swiper.destroyed) return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }
  function slideToClosest(speed, runCallbacks = true, internal, threshold = 0.5) {
    const swiper = this;
    if (swiper.destroyed) return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    let index = swiper.activeIndex;
    const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
    const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
    const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    if (translate2 >= swiper.snapGrid[snapIndex]) {
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];
      if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.slidesPerGroup;
      }
    } else {
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];
      if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.slidesPerGroup;
      }
    }
    index = Math.max(index, 0);
    index = Math.min(index, swiper.slidesGrid.length - 1);
    return swiper.slideTo(index, speed, runCallbacks, internal);
  }
  function slideToClickedSlide() {
    const swiper = this;
    if (swiper.destroyed) return;
    const {
      params,
      slidesEl
    } = swiper;
    const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
    let slideToIndex = swiper.getSlideIndexWhenGrid(swiper.clickedIndex);
    let realIndex;
    const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
    const isGrid = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
    if (params.loop) {
      if (swiper.animating) return;
      realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
      if (params.centeredSlides) {
        swiper.slideToLoop(realIndex);
      } else if (slideToIndex > (isGrid ? (swiper.slides.length - slidesPerView) / 2 - (swiper.params.grid.rows - 1) : swiper.slides.length - slidesPerView)) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  var slide = {
    slideTo,
    slideToLoop,
    slideNext,
    slidePrev,
    slideReset,
    slideToClosest,
    slideToClickedSlide
  };
  function loopCreate(slideRealIndex, initial) {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
    const initSlides = () => {
      const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      slides.forEach((el, index) => {
        el.setAttribute("data-swiper-slide-index", index);
      });
    };
    const clearBlankSlides = () => {
      const slides = elementChildren(slidesEl, `.${params.slideBlankClass}`);
      slides.forEach((el) => {
        el.remove();
      });
      if (slides.length > 0) {
        swiper.recalcSlides();
        swiper.updateSlides();
      }
    };
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    if (params.loopAddBlankSlides && (params.slidesPerGroup > 1 || gridEnabled)) {
      clearBlankSlides();
    }
    const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
    const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
    const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
    const addBlankSlides = (amountOfSlides) => {
      for (let i = 0; i < amountOfSlides; i += 1) {
        const slideEl = swiper.isElement ? createElement("swiper-slide", [params.slideBlankClass]) : createElement("div", [params.slideClass, params.slideBlankClass]);
        swiper.slidesEl.append(slideEl);
      }
    };
    if (shouldFillGroup) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      }
      initSlides();
    } else if (shouldFillGrid) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      }
      initSlides();
    } else {
      initSlides();
    }
    const bothDirections = params.centeredSlides || !!params.slidesOffsetBefore || !!params.slidesOffsetAfter;
    swiper.loopFix({
      slideRealIndex,
      direction: bothDirections ? void 0 : "next",
      initial
    });
  }
  function loopFix({
    slideRealIndex,
    slideTo: slideTo2 = true,
    direction,
    setTranslate: setTranslate2,
    activeSlideIndex,
    initial,
    byController,
    byMousewheel
  } = {}) {
    const swiper = this;
    if (!swiper.params.loop) return;
    swiper.emit("beforeLoopFix");
    const {
      slides,
      allowSlidePrev,
      allowSlideNext,
      slidesEl,
      params
    } = swiper;
    const {
      centeredSlides,
      slidesOffsetBefore,
      slidesOffsetAfter,
      initialSlide
    } = params;
    const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;
    if (swiper.virtual && params.virtual.enabled) {
      if (slideTo2) {
        if (!bothDirections && swiper.snapIndex === 0) {
          swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
        } else if (bothDirections && swiper.snapIndex < params.slidesPerView) {
          swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
        } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
          swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
        }
      }
      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit("loopFix");
      return;
    }
    let slidesPerView = params.slidesPerView;
    if (slidesPerView === "auto") {
      slidesPerView = swiper.slidesPerViewDynamic();
    } else {
      slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
      if (bothDirections && slidesPerView % 2 === 0) {
        slidesPerView = slidesPerView + 1;
      }
    }
    const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
    let loopedSlides = bothDirections ? Math.max(slidesPerGroup, Math.ceil(slidesPerView / 2)) : slidesPerGroup;
    if (loopedSlides % slidesPerGroup !== 0) {
      loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
    }
    loopedSlides += params.loopAdditionalSlides;
    swiper.loopedSlides = loopedSlides;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    if (slides.length < slidesPerView + loopedSlides || swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
      showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters");
    } else if (gridEnabled && params.grid.fill === "row") {
      showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
    }
    const prependSlidesIndexes = [];
    const appendSlidesIndexes = [];
    const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
    const isInitialOverflow = initial && cols - initialSlide < slidesPerView && !bothDirections;
    let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
    if (typeof activeSlideIndex === "undefined") {
      activeSlideIndex = swiper.getSlideIndex(slides.find((el) => el.classList.contains(params.slideActiveClass)));
    } else {
      activeIndex = activeSlideIndex;
    }
    const isNext = direction === "next" || !direction;
    const isPrev = direction === "prev" || !direction;
    let slidesPrepended = 0;
    let slidesAppended = 0;
    const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
    const activeColIndexWithShift = activeColIndex + (bothDirections && typeof setTranslate2 === "undefined" ? -slidesPerView / 2 + 0.5 : 0);
    if (activeColIndexWithShift < loopedSlides) {
      slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
      for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          const colIndexToPrepend = cols - index - 1;
          for (let i2 = slides.length - 1; i2 >= 0; i2 -= 1) {
            if (slides[i2].column === colIndexToPrepend) prependSlidesIndexes.push(i2);
          }
        } else {
          prependSlidesIndexes.push(cols - index - 1);
        }
      }
    } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
      slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
      if (isInitialOverflow) {
        slidesAppended = Math.max(slidesAppended, slidesPerView - cols + initialSlide + 1);
      }
      for (let i = 0; i < slidesAppended; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          slides.forEach((slide2, slideIndex) => {
            if (slide2.column === index) appendSlidesIndexes.push(slideIndex);
          });
        } else {
          appendSlidesIndexes.push(index);
        }
      }
    }
    swiper.__preventObserver__ = true;
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
    if (swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
      if (appendSlidesIndexes.includes(activeSlideIndex)) {
        appendSlidesIndexes.splice(appendSlidesIndexes.indexOf(activeSlideIndex), 1);
      }
      if (prependSlidesIndexes.includes(activeSlideIndex)) {
        prependSlidesIndexes.splice(prependSlidesIndexes.indexOf(activeSlideIndex), 1);
      }
    }
    if (isPrev) {
      prependSlidesIndexes.forEach((index) => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.prepend(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    if (isNext) {
      appendSlidesIndexes.forEach((index) => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.append(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    swiper.recalcSlides();
    if (params.slidesPerView === "auto") {
      swiper.updateSlides();
    } else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) {
      swiper.slides.forEach((slide2, slideIndex) => {
        swiper.grid.updateSlide(slideIndex, slide2, swiper.slides);
      });
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    if (slideTo2) {
      if (prependSlidesIndexes.length > 0 && isPrev) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
            if (setTranslate2) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          if (setTranslate2) {
            const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
            swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
            swiper.touchEventsData.currentTranslate = swiper.translate;
          }
        }
      } else if (appendSlidesIndexes.length > 0 && isNext) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
            if (setTranslate2) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
        }
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.controller && swiper.controller.control && !byController) {
      const loopParams = {
        slideRealIndex,
        direction,
        setTranslate: setTranslate2,
        activeSlideIndex,
        byController: true
      };
      if (Array.isArray(swiper.controller.control)) {
        swiper.controller.control.forEach((c) => {
          if (!c.destroyed && c.params.loop) c.loopFix({
            ...loopParams,
            slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo2 : false
          });
        });
      } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
        swiper.controller.control.loopFix({
          ...loopParams,
          slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo2 : false
        });
      }
    }
    swiper.emit("loopFix");
  }
  function loopDestroy() {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || !slidesEl || swiper.virtual && swiper.params.virtual.enabled) return;
    swiper.recalcSlides();
    const newSlidesOrder = [];
    swiper.slides.forEach((slideEl) => {
      const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
      newSlidesOrder[index] = slideEl;
    });
    swiper.slides.forEach((slideEl) => {
      slideEl.removeAttribute("data-swiper-slide-index");
    });
    newSlidesOrder.forEach((slideEl) => {
      slidesEl.append(slideEl);
    });
    swiper.recalcSlides();
    swiper.slideTo(swiper.realIndex, 0);
  }
  var loop = {
    loopCreate,
    loopFix,
    loopDestroy
  };
  function setGrabCursor(moving) {
    const swiper = this;
    if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
    const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    el.style.cursor = "move";
    el.style.cursor = moving ? "grabbing" : "grab";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }
  function unsetGrabCursor() {
    const swiper = this;
    if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
      return;
    }
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }
  var grabCursor = {
    setGrabCursor,
    unsetGrabCursor
  };
  function closestElement(selector, base = this) {
    function __closestFrom(el) {
      if (!el || el === getDocument() || el === getWindow()) return null;
      if (el.assignedSlot) el = el.assignedSlot;
      const found = el.closest(selector);
      if (!found && !el.getRootNode) {
        return null;
      }
      return found || __closestFrom(el.getRootNode().host);
    }
    return __closestFrom(base);
  }
  function preventEdgeSwipe(swiper, event2, startX) {
    const window2 = getWindow();
    const {
      params
    } = swiper;
    const edgeSwipeDetection = params.edgeSwipeDetection;
    const edgeSwipeThreshold = params.edgeSwipeThreshold;
    if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
      if (edgeSwipeDetection === "prevent") {
        event2.preventDefault();
        return true;
      }
      return false;
    }
    return true;
  }
  function onTouchStart(event2) {
    const swiper = this;
    const document2 = getDocument();
    let e = event2;
    if (e.originalEvent) e = e.originalEvent;
    const data = swiper.touchEventsData;
    if (e.type === "pointerdown") {
      if (data.pointerId !== null && data.pointerId !== e.pointerId) {
        return;
      }
      data.pointerId = e.pointerId;
    } else if (e.type === "touchstart" && e.targetTouches.length === 1) {
      data.touchId = e.targetTouches[0].identifier;
    }
    if (e.type === "touchstart") {
      preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
      return;
    }
    const {
      params,
      touches,
      enabled
    } = swiper;
    if (!enabled) return;
    if (!params.simulateTouch && e.pointerType === "mouse") return;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }
    if (!swiper.animating && params.cssMode && params.loop) {
      swiper.loopFix();
    }
    let targetEl = e.target;
    if (params.touchEventsTarget === "wrapper") {
      if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
    }
    if ("which" in e && e.which === 3) return;
    if ("button" in e && e.button > 0) return;
    if (data.isTouched && data.isMoved) return;
    const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
    const eventPath = e.composedPath ? e.composedPath() : e.path;
    if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
      targetEl = eventPath[0];
    }
    const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
    const isTargetShadow = !!(e.target && e.target.shadowRoot);
    if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
      swiper.allowClick = true;
      return;
    }
    if (params.swipeHandler) {
      if (!targetEl.closest(params.swipeHandler)) return;
    }
    touches.currentX = e.pageX;
    touches.currentY = e.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY;
    if (!preventEdgeSwipe(swiper, e, startX)) {
      return;
    }
    Object.assign(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: void 0,
      startMoving: void 0
    });
    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = now();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = void 0;
    if (params.threshold > 0) data.allowThresholdMove = false;
    let preventDefault = true;
    if (targetEl.matches(data.focusableElements)) {
      preventDefault = false;
      if (targetEl.nodeName === "SELECT") {
        data.isTouched = false;
      }
    }
    if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== targetEl && (e.pointerType === "mouse" || e.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) {
      document2.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
      e.preventDefault();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
      swiper.freeMode.onTouchStart();
    }
    swiper.emit("touchStart", e);
  }
  function onTouchMove(event2) {
    const document2 = getDocument();
    const swiper = this;
    const data = swiper.touchEventsData;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      enabled
    } = swiper;
    if (!enabled) return;
    if (!params.simulateTouch && event2.pointerType === "mouse") return;
    let e = event2;
    if (e.originalEvent) e = e.originalEvent;
    if (e.type === "pointermove") {
      if (data.touchId !== null) return;
      const id = e.pointerId;
      if (id !== data.pointerId) return;
    }
    let targetTouch;
    if (e.type === "touchmove") {
      targetTouch = [...e.changedTouches].find((t2) => t2.identifier === data.touchId);
      if (!targetTouch || targetTouch.identifier !== data.touchId) return;
    } else {
      targetTouch = e;
    }
    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit("touchMoveOpposite", e);
      }
      return;
    }
    const pageX = targetTouch.pageX;
    const pageY = targetTouch.pageY;
    if (e.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }
    if (!swiper.allowTouchMove) {
      if (!e.target.matches(data.focusableElements)) {
        swiper.allowClick = false;
      }
      if (data.isTouched) {
        Object.assign(touches, {
          startX: pageX,
          startY: pageY,
          currentX: pageX,
          currentY: pageY
        });
        data.touchStartTime = now();
      }
      return;
    }
    if (params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (rtl && (pageX > touches.startX && -swiper.translate <= swiper.maxTranslate() || pageX < touches.startX && -swiper.translate >= swiper.minTranslate())) {
        return;
      } else if (!rtl && (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate())) {
        return;
      }
    }
    if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== e.target && e.pointerType !== "mouse") {
      document2.activeElement.blur();
    }
    if (document2.activeElement) {
      if (e.target === document2.activeElement && e.target.matches(data.focusableElements)) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }
    if (data.allowTouchCallbacks) {
      swiper.emit("touchMove", e);
    }
    touches.previousX = touches.currentX;
    touches.previousY = touches.currentY;
    touches.currentX = pageX;
    touches.currentY = pageY;
    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
    if (typeof data.isScrolling === "undefined") {
      let touchAngle;
      if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
        data.isScrolling = false;
      } else {
        if (diffX * diffX + diffY * diffY >= 25) {
          touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
          data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
        }
      }
    }
    if (data.isScrolling) {
      swiper.emit("touchMoveOpposite", e);
    }
    if (typeof data.startMoving === "undefined") {
      if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
        data.startMoving = true;
      }
    }
    if (data.isScrolling || e.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
      data.isTouched = false;
      return;
    }
    if (!data.startMoving) {
      return;
    }
    swiper.allowClick = false;
    if (!params.cssMode && e.cancelable) {
      e.preventDefault();
    }
    if (params.touchMoveStopPropagation && !params.nested) {
      e.stopPropagation();
    }
    let diff = swiper.isHorizontal() ? diffX : diffY;
    let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
    if (params.oneWayMovement) {
      diff = Math.abs(diff) * (rtl ? 1 : -1);
      touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
    }
    touches.diff = diff;
    diff *= params.touchRatio;
    if (rtl) {
      diff = -diff;
      touchesDiff = -touchesDiff;
    }
    const prevTouchesDirection = swiper.touchesDirection;
    swiper.swipeDirection = diff > 0 ? "prev" : "next";
    swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
    const isLoop = swiper.params.loop && !params.cssMode;
    const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
    if (!data.isMoved) {
      if (isLoop && allowLoopFix) {
        swiper.loopFix({
          direction: swiper.swipeDirection
        });
      }
      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);
      if (swiper.animating) {
        const evt = new window.CustomEvent("transitionend", {
          bubbles: true,
          cancelable: true,
          detail: {
            bySwiperTouchMove: true
          }
        });
        swiper.wrapperEl.dispatchEvent(evt);
      }
      data.allowMomentumBounce = false;
      if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(true);
      }
      swiper.emit("sliderFirstMove", e);
    }
    let loopFixed;
    (/* @__PURE__ */ new Date()).getTime();
    if (params._loopSwapReset !== false && data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY,
        startTranslate: data.currentTranslate
      });
      data.loopSwapReset = true;
      data.startTranslate = data.currentTranslate;
      return;
    }
    swiper.emit("sliderMove", e);
    data.isMoved = true;
    data.currentTranslate = diff + data.startTranslate;
    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;
    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }
    if (diff > 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) {
        swiper.loopFix({
          direction: "prev",
          setTranslate: true,
          activeSlideIndex: 0
        });
      }
      if (data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        }
      }
    } else if (diff < 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) {
        swiper.loopFix({
          direction: "next",
          setTranslate: true,
          activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
        });
      }
      if (data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
      }
    }
    if (disableParentSwiper) {
      e.preventedByNestedSwiper = true;
    }
    if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
      data.currentTranslate = data.startTranslate;
    }
    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }
    if (!params.followFinger || params.cssMode) return;
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
      swiper.freeMode.onTouchMove();
    }
    swiper.updateProgress(data.currentTranslate);
    swiper.setTranslate(data.currentTranslate);
  }
  function onTouchEnd(event2) {
    const swiper = this;
    const data = swiper.touchEventsData;
    let e = event2;
    if (e.originalEvent) e = e.originalEvent;
    let targetTouch;
    const isTouchEvent = e.type === "touchend" || e.type === "touchcancel";
    if (!isTouchEvent) {
      if (data.touchId !== null) return;
      if (e.pointerId !== data.pointerId) return;
      targetTouch = e;
    } else {
      targetTouch = [...e.changedTouches].find((t2) => t2.identifier === data.touchId);
      if (!targetTouch || targetTouch.identifier !== data.touchId) return;
    }
    if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(e.type)) {
      const proceed = ["pointercancel", "contextmenu"].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
      if (!proceed) {
        return;
      }
    }
    data.pointerId = null;
    data.touchId = null;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      slidesGrid,
      enabled
    } = swiper;
    if (!enabled) return;
    if (!params.simulateTouch && e.pointerType === "mouse") return;
    if (data.allowTouchCallbacks) {
      swiper.emit("touchEnd", e);
    }
    data.allowTouchCallbacks = false;
    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(false);
    }
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (swiper.allowClick) {
      const pathTree = e.path || e.composedPath && e.composedPath();
      swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
      swiper.emit("tap click", e);
      if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
        swiper.emit("doubleTap doubleClick", e);
      }
    }
    data.lastClickTime = now();
    nextTick(() => {
      if (!swiper.destroyed) swiper.allowClick = true;
    });
    if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    let currentPos;
    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }
    if (params.cssMode) {
      return;
    }
    if (params.freeMode && params.freeMode.enabled) {
      swiper.freeMode.onTouchEnd({
        currentPos
      });
      return;
    }
    const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
    let stopIndex = 0;
    let groupSize = swiper.slidesSizesGrid[0];
    for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
      const increment2 = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
      if (typeof slidesGrid[i + increment2] !== "undefined") {
        if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2]) {
          stopIndex = i;
          groupSize = slidesGrid[i + increment2] - slidesGrid[i];
        }
      } else if (swipeToLast || currentPos >= slidesGrid[i]) {
        stopIndex = i;
        groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
      }
    }
    let rewindFirstIndex = null;
    let rewindLastIndex = null;
    if (params.rewind) {
      if (swiper.isBeginning) {
        rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      } else if (swiper.isEnd) {
        rewindFirstIndex = 0;
      }
    }
    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
    const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (timeDiff > params.longSwipesMs) {
      if (!params.longSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (swiper.swipeDirection === "next") {
        if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
        else swiper.slideTo(stopIndex);
      }
      if (swiper.swipeDirection === "prev") {
        if (ratio > 1 - params.longSwipesRatio) {
          swiper.slideTo(stopIndex + increment);
        } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
          swiper.slideTo(rewindLastIndex);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    } else {
      if (!params.shortSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === "next") {
          swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
        }
        if (swiper.swipeDirection === "prev") {
          swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
        }
      } else if (e.target === swiper.navigation.nextEl) {
        swiper.slideTo(stopIndex + increment);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  }
  function onResize() {
    const swiper = this;
    const {
      params,
      el
    } = swiper;
    if (el && el.offsetWidth === 0) return;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    const {
      allowSlideNext,
      allowSlidePrev,
      snapGrid
    } = swiper;
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateSlidesClasses();
    const isVirtualLoop = isVirtual && params.loop;
    if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      if (swiper.params.loop && !isVirtual) {
        swiper.slideToLoop(swiper.realIndex, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
    }
    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      clearTimeout(swiper.autoplay.resizeTimeout);
      swiper.autoplay.resizeTimeout = setTimeout(() => {
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
          swiper.autoplay.resume();
        }
      }, 500);
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }
  function onClick(e) {
    const swiper = this;
    if (!swiper.enabled) return;
    if (!swiper.allowClick) {
      if (swiper.params.preventClicks) e.preventDefault();
      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }
  function onScroll() {
    const swiper = this;
    const {
      wrapperEl,
      rtlTranslate,
      enabled
    } = swiper;
    if (!enabled) return;
    swiper.previousTranslate = swiper.translate;
    if (swiper.isHorizontal()) {
      swiper.translate = -wrapperEl.scrollLeft;
    } else {
      swiper.translate = -wrapperEl.scrollTop;
    }
    if (swiper.translate === 0) swiper.translate = 0;
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== swiper.progress) {
      swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
    }
    swiper.emit("setTranslate", swiper.translate, false);
  }
  function onLoad(e) {
    const swiper = this;
    processLazyPreloader(swiper, e.target);
    if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) {
      return;
    }
    swiper.update();
  }
  function onDocumentTouchStart() {
    const swiper = this;
    if (swiper.documentTouchHandlerProceeded) return;
    swiper.documentTouchHandlerProceeded = true;
    if (swiper.params.touchReleaseOnEdges) {
      swiper.el.style.touchAction = "auto";
    }
  }
  var events = (swiper, method) => {
    const document2 = getDocument();
    const {
      params,
      el,
      wrapperEl,
      device
    } = swiper;
    const capture = !!params.nested;
    const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
    const swiperMethod = method;
    if (!el || typeof el === "string") return;
    document2[domMethod]("touchstart", swiper.onDocumentTouchStart, {
      passive: false,
      capture
    });
    el[domMethod]("touchstart", swiper.onTouchStart, {
      passive: false
    });
    el[domMethod]("pointerdown", swiper.onTouchStart, {
      passive: false
    });
    document2[domMethod]("touchmove", swiper.onTouchMove, {
      passive: false,
      capture
    });
    document2[domMethod]("pointermove", swiper.onTouchMove, {
      passive: false,
      capture
    });
    document2[domMethod]("touchend", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerup", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointercancel", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("touchcancel", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerout", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerleave", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("contextmenu", swiper.onTouchEnd, {
      passive: true
    });
    if (params.preventClicks || params.preventClicksPropagation) {
      el[domMethod]("click", swiper.onClick, true);
    }
    if (params.cssMode) {
      wrapperEl[domMethod]("scroll", swiper.onScroll);
    }
    if (params.updateOnWindowResize) {
      swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
    } else {
      swiper[swiperMethod]("observerUpdate", onResize, true);
    }
    el[domMethod]("load", swiper.onLoad, {
      capture: true
    });
  };
  function attachEvents() {
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);
    swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
    if (params.cssMode) {
      swiper.onScroll = onScroll.bind(swiper);
    }
    swiper.onClick = onClick.bind(swiper);
    swiper.onLoad = onLoad.bind(swiper);
    events(swiper, "on");
  }
  function detachEvents() {
    const swiper = this;
    events(swiper, "off");
  }
  var events$1 = {
    attachEvents,
    detachEvents
  };
  var isGridEnabled = (swiper, params) => {
    return swiper.grid && params.grid && params.grid.rows > 1;
  };
  function setBreakpoint() {
    const swiper = this;
    const {
      realIndex,
      initialized,
      params,
      el
    } = swiper;
    const breakpoints2 = params.breakpoints;
    if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0) return;
    const document2 = getDocument();
    const breakpointsBase = params.breakpointsBase === "window" || !params.breakpointsBase ? params.breakpointsBase : "container";
    const breakpointContainer = ["window", "container"].includes(params.breakpointsBase) || !params.breakpointsBase ? swiper.el : document2.querySelector(params.breakpointsBase);
    const breakpoint = swiper.getBreakpoint(breakpoints2, breakpointsBase, breakpointContainer);
    if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
    const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
    const breakpointParams = breakpointOnlyParams || swiper.originalParams;
    const wasMultiRow = isGridEnabled(swiper, params);
    const isMultiRow = isGridEnabled(swiper, breakpointParams);
    const wasGrabCursor = swiper.params.grabCursor;
    const isGrabCursor = breakpointParams.grabCursor;
    const wasEnabled = params.enabled;
    if (wasMultiRow && !isMultiRow) {
      el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      el.classList.add(`${params.containerModifierClass}grid`);
      if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
        el.classList.add(`${params.containerModifierClass}grid-column`);
      }
      swiper.emitContainerClasses();
    }
    if (wasGrabCursor && !isGrabCursor) {
      swiper.unsetGrabCursor();
    } else if (!wasGrabCursor && isGrabCursor) {
      swiper.setGrabCursor();
    }
    ["navigation", "pagination", "scrollbar"].forEach((prop) => {
      if (typeof breakpointParams[prop] === "undefined") return;
      const wasModuleEnabled = params[prop] && params[prop].enabled;
      const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
      if (wasModuleEnabled && !isModuleEnabled) {
        swiper[prop].disable();
      }
      if (!wasModuleEnabled && isModuleEnabled) {
        swiper[prop].enable();
      }
    });
    const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
    const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
    const wasLoop = params.loop;
    if (directionChanged && initialized) {
      swiper.changeDirection();
    }
    extend2(swiper.params, breakpointParams);
    const isEnabled = swiper.params.enabled;
    const hasLoop = swiper.params.loop;
    Object.assign(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev
    });
    if (wasEnabled && !isEnabled) {
      swiper.disable();
    } else if (!wasEnabled && isEnabled) {
      swiper.enable();
    }
    swiper.currentBreakpoint = breakpoint;
    swiper.emit("_beforeBreakpoint", breakpointParams);
    if (initialized) {
      if (needsReLoop) {
        swiper.loopDestroy();
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (!wasLoop && hasLoop) {
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (wasLoop && !hasLoop) {
        swiper.loopDestroy();
      }
    }
    swiper.emit("breakpoint", breakpointParams);
  }
  function getBreakpoint(breakpoints2, base = "window", containerEl) {
    if (!breakpoints2 || base === "container" && !containerEl) return void 0;
    let breakpoint = false;
    const window2 = getWindow();
    const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
    const points = Object.keys(breakpoints2).map((point) => {
      if (typeof point === "string" && point.indexOf("@") === 0) {
        const minRatio = parseFloat(point.substr(1));
        const value = currentHeight * minRatio;
        return {
          value,
          point
        };
      }
      return {
        value: point,
        point
      };
    });
    points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
    for (let i = 0; i < points.length; i += 1) {
      const {
        point,
        value
      } = points[i];
      if (base === "window") {
        if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
          breakpoint = point;
        }
      } else if (value <= containerEl.clientWidth) {
        breakpoint = point;
      }
    }
    return breakpoint || "max";
  }
  var breakpoints = {
    setBreakpoint,
    getBreakpoint
  };
  function prepareClasses(entries, prefix) {
    const resultClasses = [];
    entries.forEach((item) => {
      if (typeof item === "object") {
        Object.keys(item).forEach((classNames) => {
          if (item[classNames]) {
            resultClasses.push(prefix + classNames);
          }
        });
      } else if (typeof item === "string") {
        resultClasses.push(prefix + item);
      }
    });
    return resultClasses;
  }
  function addClasses() {
    const swiper = this;
    const {
      classNames,
      params,
      rtl,
      el,
      device
    } = swiper;
    const suffixes = prepareClasses(["initialized", params.direction, {
      "free-mode": swiper.params.freeMode && params.freeMode.enabled
    }, {
      "autoheight": params.autoHeight
    }, {
      "rtl": rtl
    }, {
      "grid": params.grid && params.grid.rows > 1
    }, {
      "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
    }, {
      "android": device.android
    }, {
      "ios": device.ios
    }, {
      "css-mode": params.cssMode
    }, {
      "centered": params.cssMode && params.centeredSlides
    }, {
      "watch-progress": params.watchSlidesProgress
    }], params.containerModifierClass);
    classNames.push(...suffixes);
    el.classList.add(...classNames);
    swiper.emitContainerClasses();
  }
  function removeClasses() {
    const swiper = this;
    const {
      el,
      classNames
    } = swiper;
    if (!el || typeof el === "string") return;
    el.classList.remove(...classNames);
    swiper.emitContainerClasses();
  }
  var classes = {
    addClasses,
    removeClasses
  };
  function checkOverflow() {
    const swiper = this;
    const {
      isLocked: wasLocked,
      params
    } = swiper;
    const {
      slidesOffsetBefore
    } = params;
    if (slidesOffsetBefore) {
      const lastSlideIndex = swiper.slides.length - 1;
      const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
      swiper.isLocked = swiper.size > lastSlideRightEdge;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }
    if (params.allowSlideNext === true) {
      swiper.allowSlideNext = !swiper.isLocked;
    }
    if (params.allowSlidePrev === true) {
      swiper.allowSlidePrev = !swiper.isLocked;
    }
    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
    }
    if (wasLocked !== swiper.isLocked) {
      swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
  }
  var checkOverflow$1 = {
    checkOverflow
  };
  var defaults = {
    init: true,
    direction: "horizontal",
    oneWayMovement: false,
    swiperElementNodeName: "SWIPER-CONTAINER",
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: false,
    updateOnWindowResize: true,
    resizeObserver: true,
    nested: false,
    createElements: false,
    eventsPrefix: "swiper",
    enabled: true,
    focusableElements: "input, select, option, textarea, button, video, label",
    // Overrides
    width: null,
    height: null,
    //
    preventInteractionOnTransition: false,
    // ssr
    userAgent: null,
    url: null,
    // To support iOS's swipe-to-go-back gesture (when being used in-app).
    edgeSwipeDetection: false,
    edgeSwipeThreshold: 20,
    // Autoheight
    autoHeight: false,
    // Set wrapper width
    setWrapperSize: false,
    // Virtual Translate
    virtualTranslate: false,
    // Effects
    effect: "slide",
    // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
    // Breakpoints
    breakpoints: void 0,
    breakpointsBase: "window",
    // Slides grid
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    slidesOffsetBefore: 0,
    // in px
    slidesOffsetAfter: 0,
    // in px
    normalizeSlideIndex: true,
    centerInsufficientSlides: false,
    snapToSlideEdge: false,
    // Disable swiper and hide navigation when container not overflow
    watchOverflow: true,
    // Round length
    roundLengths: false,
    // Touches
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    allowTouchMove: true,
    threshold: 5,
    touchMoveStopPropagation: false,
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchReleaseOnEdges: false,
    // Unique Navigation Elements
    uniqueNavElements: true,
    // Resistance
    resistance: true,
    resistanceRatio: 0.85,
    // Progress
    watchSlidesProgress: false,
    // Cursor
    grabCursor: false,
    // Clicks
    preventClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: false,
    // loop
    loop: false,
    loopAddBlankSlides: true,
    loopAdditionalSlides: 0,
    loopPreventsSliding: true,
    // rewind
    rewind: false,
    // Swiping/no swiping
    allowSlidePrev: true,
    allowSlideNext: true,
    swipeHandler: null,
    // '.swipe-handler',
    noSwiping: true,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    // Passive Listeners
    passiveListeners: true,
    maxBackfaceHiddenSlides: 10,
    // NS
    containerModifierClass: "swiper-",
    // NEW
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-blank",
    slideActiveClass: "swiper-slide-active",
    slideVisibleClass: "swiper-slide-visible",
    slideFullyVisibleClass: "swiper-slide-fully-visible",
    slideNextClass: "swiper-slide-next",
    slidePrevClass: "swiper-slide-prev",
    wrapperClass: "swiper-wrapper",
    lazyPreloaderClass: "swiper-lazy-preloader",
    lazyPreloadPrevNext: 0,
    // Callbacks
    runCallbacksOnInit: true,
    // Internals
    _emitClasses: false
  };
  function moduleExtendParams(params, allModulesParams) {
    return function extendParams(obj = {}) {
      const moduleParamName = Object.keys(obj)[0];
      const moduleParams = obj[moduleParamName];
      if (typeof moduleParams !== "object" || moduleParams === null) {
        extend2(allModulesParams, obj);
        return;
      }
      if (params[moduleParamName] === true) {
        params[moduleParamName] = {
          enabled: true
        };
      }
      if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) {
        params[moduleParamName].auto = true;
      }
      if (["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) {
        params[moduleParamName].auto = true;
      }
      if (!(moduleParamName in params && "enabled" in moduleParams)) {
        extend2(allModulesParams, obj);
        return;
      }
      if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
        params[moduleParamName].enabled = true;
      }
      if (!params[moduleParamName]) params[moduleParamName] = {
        enabled: false
      };
      extend2(allModulesParams, obj);
    };
  }
  var prototypes = {
    eventsEmitter,
    update,
    translate,
    transition,
    slide,
    loop,
    grabCursor,
    events: events$1,
    breakpoints,
    checkOverflow: checkOverflow$1,
    classes
  };
  var extendedDefaults = {};
  var Swiper = class _Swiper {
    constructor(...args) {
      let el;
      let params;
      if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
        params = args[0];
      } else {
        [el, params] = args;
      }
      if (!params) params = {};
      params = extend2({}, params);
      if (el && !params.el) params.el = el;
      const document2 = getDocument();
      if (params.el && typeof params.el === "string" && document2.querySelectorAll(params.el).length > 1) {
        const swipers = [];
        document2.querySelectorAll(params.el).forEach((containerEl) => {
          const newParams = extend2({}, params, {
            el: containerEl
          });
          swipers.push(new _Swiper(newParams));
        });
        return swipers;
      }
      const swiper = this;
      swiper.__swiper__ = true;
      swiper.support = getSupport();
      swiper.device = getDevice({
        userAgent: params.userAgent
      });
      swiper.browser = getBrowser();
      swiper.eventsListeners = {};
      swiper.eventsAnyListeners = [];
      swiper.modules = [...swiper.__modules__];
      if (params.modules && Array.isArray(params.modules)) {
        params.modules.forEach((mod) => {
          if (typeof mod === "function" && swiper.modules.indexOf(mod) < 0) {
            swiper.modules.push(mod);
          }
        });
      }
      const allModulesParams = {};
      swiper.modules.forEach((mod) => {
        mod({
          params,
          swiper,
          extendParams: moduleExtendParams(params, allModulesParams),
          on: swiper.on.bind(swiper),
          once: swiper.once.bind(swiper),
          off: swiper.off.bind(swiper),
          emit: swiper.emit.bind(swiper)
        });
      });
      const swiperParams = extend2({}, defaults, allModulesParams);
      swiper.params = extend2({}, swiperParams, extendedDefaults, params);
      swiper.originalParams = extend2({}, swiper.params);
      swiper.passedParams = extend2({}, params);
      if (swiper.params && swiper.params.on) {
        Object.keys(swiper.params.on).forEach((eventName) => {
          swiper.on(eventName, swiper.params.on[eventName]);
        });
      }
      if (swiper.params && swiper.params.onAny) {
        swiper.onAny(swiper.params.onAny);
      }
      Object.assign(swiper, {
        enabled: swiper.params.enabled,
        el,
        // Classes
        classNames: [],
        // Slides
        slides: [],
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],
        // isDirection
        isHorizontal() {
          return swiper.params.direction === "horizontal";
        },
        isVertical() {
          return swiper.params.direction === "vertical";
        },
        // Indexes
        activeIndex: 0,
        realIndex: 0,
        //
        isBeginning: true,
        isEnd: false,
        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,
        cssOverflowAdjustment() {
          return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
        },
        // Locks
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,
        // Touch Events
        touchEventsData: {
          isTouched: void 0,
          isMoved: void 0,
          allowTouchCallbacks: void 0,
          touchStartTime: void 0,
          isScrolling: void 0,
          currentTranslate: void 0,
          startTranslate: void 0,
          allowThresholdMove: void 0,
          // Form elements to match
          focusableElements: swiper.params.focusableElements,
          // Last click time
          lastClickTime: 0,
          clickTimeout: void 0,
          // Velocities
          velocities: [],
          allowMomentumBounce: void 0,
          startMoving: void 0,
          pointerId: null,
          touchId: null
        },
        // Clicks
        allowClick: true,
        // Touches
        allowTouchMove: swiper.params.allowTouchMove,
        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0
        },
        // Images
        imagesToLoad: [],
        imagesLoaded: 0
      });
      swiper.emit("_swiper");
      if (swiper.params.init) {
        swiper.init();
      }
      return swiper;
    }
    getDirectionLabel(property) {
      if (this.isHorizontal()) {
        return property;
      }
      return {
        "width": "height",
        "margin-top": "margin-left",
        "margin-bottom ": "margin-right",
        "margin-left": "margin-top",
        "margin-right": "margin-bottom",
        "padding-left": "padding-top",
        "padding-right": "padding-bottom",
        "marginRight": "marginBottom"
      }[property];
    }
    getSlideIndex(slideEl) {
      const {
        slidesEl,
        params
      } = this;
      const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      const firstSlideIndex = elementIndex(slides[0]);
      return elementIndex(slideEl) - firstSlideIndex;
    }
    getSlideIndexByData(index) {
      return this.getSlideIndex(this.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index));
    }
    getSlideIndexWhenGrid(index) {
      if (this.grid && this.params.grid && this.params.grid.rows > 1) {
        if (this.params.grid.fill === "column") {
          index = Math.floor(index / this.params.grid.rows);
        } else if (this.params.grid.fill === "row") {
          index = index % Math.ceil(this.slides.length / this.params.grid.rows);
        }
      }
      return index;
    }
    recalcSlides() {
      const swiper = this;
      const {
        slidesEl,
        params
      } = swiper;
      swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    }
    enable() {
      const swiper = this;
      if (swiper.enabled) return;
      swiper.enabled = true;
      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }
      swiper.emit("enable");
    }
    disable() {
      const swiper = this;
      if (!swiper.enabled) return;
      swiper.enabled = false;
      if (swiper.params.grabCursor) {
        swiper.unsetGrabCursor();
      }
      swiper.emit("disable");
    }
    setProgress(progress, speed) {
      const swiper = this;
      progress = Math.min(Math.max(progress, 0), 1);
      const min = swiper.minTranslate();
      const max = swiper.maxTranslate();
      const current = (max - min) * progress + min;
      swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    emitContainerClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const cls = swiper.el.className.split(" ").filter((className) => {
        return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
      });
      swiper.emit("_containerClasses", cls.join(" "));
    }
    getSlideClasses(slideEl) {
      const swiper = this;
      if (swiper.destroyed) return "";
      return slideEl.className.split(" ").filter((className) => {
        return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
      }).join(" ");
    }
    emitSlidesClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const updates = [];
      swiper.slides.forEach((slideEl) => {
        const classNames = swiper.getSlideClasses(slideEl);
        updates.push({
          slideEl,
          classNames
        });
        swiper.emit("_slideClass", slideEl, classNames);
      });
      swiper.emit("_slideClasses", updates);
    }
    slidesPerViewDynamic(view = "current", exact = false) {
      const swiper = this;
      const {
        params,
        slides,
        slidesGrid,
        slidesSizesGrid,
        size: swiperSize,
        activeIndex
      } = swiper;
      let spv = 1;
      if (typeof params.slidesPerView === "number") return params.slidesPerView;
      if (params.centeredSlides) {
        let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
        let breakLoop;
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slides[i] && !breakLoop) {
            slideSize += Math.ceil(slides[i].swiperSlideSize);
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
      } else {
        if (view === "current") {
          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        } else {
          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        }
      }
      return spv;
    }
    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed) return;
      const {
        snapGrid,
        params
      } = swiper;
      if (params.breakpoints) {
        swiper.setBreakpoint();
      }
      [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
        if (imageEl.complete) {
          processLazyPreloader(swiper, imageEl);
        }
      });
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      function setTranslate2() {
        const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      let translated;
      if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
        setTranslate2();
        if (params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
          const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
          translated = swiper.slideTo(slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }
        if (!translated) {
          setTranslate2();
        }
      }
      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
      swiper.emit("update");
    }
    changeDirection(newDirection, needUpdate = true) {
      const swiper = this;
      const currentDirection = swiper.params.direction;
      if (!newDirection) {
        newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
      }
      if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
        return swiper;
      }
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
      swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
      swiper.emitContainerClasses();
      swiper.params.direction = newDirection;
      swiper.slides.forEach((slideEl) => {
        if (newDirection === "vertical") {
          slideEl.style.width = "";
        } else {
          slideEl.style.height = "";
        }
      });
      swiper.emit("changeDirection");
      if (needUpdate) swiper.update();
      return swiper;
    }
    changeLanguageDirection(direction) {
      const swiper = this;
      if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
      swiper.rtl = direction === "rtl";
      swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
      if (swiper.rtl) {
        swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = "rtl";
      } else {
        swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = "ltr";
      }
      swiper.update();
    }
    mount(element) {
      const swiper = this;
      if (swiper.mounted) return true;
      let el = element || swiper.params.el;
      if (typeof el === "string") {
        el = document.querySelector(el);
      }
      if (!el) {
        return false;
      }
      el.swiper = swiper;
      if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) {
        swiper.isElement = true;
      }
      const getWrapperSelector = () => {
        return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
      };
      const getWrapper = () => {
        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          const res = el.shadowRoot.querySelector(getWrapperSelector());
          return res;
        }
        return elementChildren(el, getWrapperSelector())[0];
      };
      let wrapperEl = getWrapper();
      if (!wrapperEl && swiper.params.createElements) {
        wrapperEl = createElement("div", swiper.params.wrapperClass);
        el.append(wrapperEl);
        elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
          wrapperEl.append(slideEl);
        });
      }
      Object.assign(swiper, {
        el,
        wrapperEl,
        slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
        hostEl: swiper.isElement ? el.parentNode.host : el,
        mounted: true,
        // RTL
        rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
        rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
        wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
      });
      return true;
    }
    init(el) {
      const swiper = this;
      if (swiper.initialized) return swiper;
      const mounted = swiper.mount(el);
      if (mounted === false) return swiper;
      swiper.emit("beforeInit");
      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      }
      swiper.addClasses();
      swiper.updateSize();
      swiper.updateSlides();
      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      }
      if (swiper.params.grabCursor && swiper.enabled) {
        swiper.setGrabCursor();
      }
      if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
        swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
      } else {
        swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
      }
      if (swiper.params.loop) {
        swiper.loopCreate(void 0, true);
      }
      swiper.attachEvents();
      const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
      if (swiper.isElement) {
        lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
      }
      lazyElements.forEach((imageEl) => {
        if (imageEl.complete) {
          processLazyPreloader(swiper, imageEl);
        } else {
          imageEl.addEventListener("load", (e) => {
            processLazyPreloader(swiper, e.target);
          });
        }
      });
      preload(swiper);
      swiper.initialized = true;
      preload(swiper);
      swiper.emit("init");
      swiper.emit("afterInit");
      return swiper;
    }
    destroy(deleteInstance = true, cleanStyles = true) {
      const swiper = this;
      const {
        params,
        el,
        wrapperEl,
        slides
      } = swiper;
      if (typeof swiper.params === "undefined" || swiper.destroyed) {
        return null;
      }
      swiper.emit("beforeDestroy");
      swiper.initialized = false;
      swiper.detachEvents();
      if (params.loop) {
        swiper.loopDestroy();
      }
      if (cleanStyles) {
        swiper.removeClasses();
        if (el && typeof el !== "string") {
          el.removeAttribute("style");
        }
        if (wrapperEl) {
          wrapperEl.removeAttribute("style");
        }
        if (slides && slides.length) {
          slides.forEach((slideEl) => {
            slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
            slideEl.removeAttribute("style");
            slideEl.removeAttribute("data-swiper-slide-index");
          });
        }
      }
      swiper.emit("destroy");
      Object.keys(swiper.eventsListeners).forEach((eventName) => {
        swiper.off(eventName);
      });
      if (deleteInstance !== false) {
        if (swiper.el && typeof swiper.el !== "string") {
          swiper.el.swiper = null;
        }
        deleteProps(swiper);
      }
      swiper.destroyed = true;
      return null;
    }
    static extendDefaults(newDefaults) {
      extend2(extendedDefaults, newDefaults);
    }
    static get extendedDefaults() {
      return extendedDefaults;
    }
    static get defaults() {
      return defaults;
    }
    static installModule(mod) {
      if (!_Swiper.prototype.__modules__) _Swiper.prototype.__modules__ = [];
      const modules = _Swiper.prototype.__modules__;
      if (typeof mod === "function" && modules.indexOf(mod) < 0) {
        modules.push(mod);
      }
    }
    static use(module2) {
      if (Array.isArray(module2)) {
        module2.forEach((m) => _Swiper.installModule(m));
        return _Swiper;
      }
      _Swiper.installModule(module2);
      return _Swiper;
    }
  };
  Object.keys(prototypes).forEach((prototypeGroup) => {
    Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
      Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
    });
  });
  Swiper.use([Resize, Observer]);

  // node_modules/swiper/modules/autoplay.mjs
  function Autoplay({
    swiper,
    extendParams,
    on,
    emit,
    params
  }) {
    swiper.autoplay = {
      running: false,
      paused: false,
      timeLeft: 0
    };
    extendParams({
      autoplay: {
        enabled: false,
        delay: 3e3,
        waitForTransition: true,
        disableOnInteraction: false,
        stopOnLastSlide: false,
        reverseDirection: false,
        pauseOnMouseEnter: false
      }
    });
    let timeout;
    let raf;
    let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
    let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
    let autoplayTimeLeft;
    let autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
    let wasPaused;
    let isTouched;
    let pausedByTouch;
    let touchStartTimeout;
    let pausedByInteraction;
    let pausedByPointerEnter;
    function onTransitionEnd(e) {
      if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
      if (e.target !== swiper.wrapperEl) return;
      swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
      if (pausedByPointerEnter || e.detail && e.detail.bySwiperTouchMove) {
        return;
      }
      resume();
    }
    const calcTimeLeft = () => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      if (swiper.autoplay.paused) {
        wasPaused = true;
      } else if (wasPaused) {
        autoplayDelayCurrent = autoplayTimeLeft;
        wasPaused = false;
      }
      const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (/* @__PURE__ */ new Date()).getTime();
      swiper.autoplay.timeLeft = timeLeft;
      emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
      raf = requestAnimationFrame(() => {
        calcTimeLeft();
      });
    };
    const getSlideDelay = () => {
      let activeSlideEl;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        activeSlideEl = swiper.slides.find((slideEl) => slideEl.classList.contains("swiper-slide-active"));
      } else {
        activeSlideEl = swiper.slides[swiper.activeIndex];
      }
      if (!activeSlideEl) return void 0;
      const currentSlideDelay = parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
      return currentSlideDelay;
    };
    const getTotalDelay = () => {
      let totalDelay = swiper.params.autoplay.delay;
      const currentSlideDelay = getSlideDelay();
      if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0) {
        totalDelay = currentSlideDelay;
      }
      return totalDelay;
    };
    const run = (delayForce) => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      cancelAnimationFrame(raf);
      calcTimeLeft();
      let delay = delayForce;
      if (typeof delay === "undefined") {
        delay = getTotalDelay();
        autoplayDelayTotal = delay;
        autoplayDelayCurrent = delay;
      }
      autoplayTimeLeft = delay;
      const speed = swiper.params.speed;
      const proceed = () => {
        if (!swiper || swiper.destroyed) return;
        if (swiper.params.autoplay.reverseDirection) {
          if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
            swiper.slidePrev(speed, true, true);
            emit("autoplay");
          } else if (!swiper.params.autoplay.stopOnLastSlide) {
            swiper.slideTo(swiper.slides.length - 1, speed, true, true);
            emit("autoplay");
          }
        } else {
          if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
            swiper.slideNext(speed, true, true);
            emit("autoplay");
          } else if (!swiper.params.autoplay.stopOnLastSlide) {
            swiper.slideTo(0, speed, true, true);
            emit("autoplay");
          }
        }
        if (swiper.params.cssMode) {
          autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
          requestAnimationFrame(() => {
            run();
          });
        }
      };
      if (delay > 0) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          proceed();
        }, delay);
      } else {
        requestAnimationFrame(() => {
          proceed();
        });
      }
      return delay;
    };
    const start = () => {
      autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
      swiper.autoplay.running = true;
      run();
      emit("autoplayStart");
    };
    const stop = () => {
      swiper.autoplay.running = false;
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
      emit("autoplayStop");
    };
    const pause = (internal, reset) => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      clearTimeout(timeout);
      if (!internal) {
        pausedByInteraction = true;
      }
      const proceed = () => {
        emit("autoplayPause");
        if (swiper.params.autoplay.waitForTransition) {
          swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd);
        } else {
          resume();
        }
      };
      swiper.autoplay.paused = true;
      if (reset) {
        proceed();
        return;
      }
      const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
      autoplayTimeLeft = delay - ((/* @__PURE__ */ new Date()).getTime() - autoplayStartTime);
      if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
      if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
      proceed();
    };
    const resume = () => {
      if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
      autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
      if (pausedByInteraction) {
        pausedByInteraction = false;
        run(autoplayTimeLeft);
      } else {
        run();
      }
      swiper.autoplay.paused = false;
      emit("autoplayResume");
    };
    const onVisibilityChange = () => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      const document2 = getDocument();
      if (document2.visibilityState === "hidden") {
        pausedByInteraction = true;
        pause(true);
      }
      if (document2.visibilityState === "visible") {
        resume();
      }
    };
    const onPointerEnter = (e) => {
      if (e.pointerType !== "mouse") return;
      pausedByInteraction = true;
      pausedByPointerEnter = true;
      if (swiper.animating || swiper.autoplay.paused) return;
      pause(true);
    };
    const onPointerLeave = (e) => {
      if (e.pointerType !== "mouse") return;
      pausedByPointerEnter = false;
      if (swiper.autoplay.paused) {
        resume();
      }
    };
    const attachMouseEvents = () => {
      if (swiper.params.autoplay.pauseOnMouseEnter) {
        swiper.el.addEventListener("pointerenter", onPointerEnter);
        swiper.el.addEventListener("pointerleave", onPointerLeave);
      }
    };
    const detachMouseEvents = () => {
      if (swiper.el && typeof swiper.el !== "string") {
        swiper.el.removeEventListener("pointerenter", onPointerEnter);
        swiper.el.removeEventListener("pointerleave", onPointerLeave);
      }
    };
    const attachDocumentEvents = () => {
      const document2 = getDocument();
      document2.addEventListener("visibilitychange", onVisibilityChange);
    };
    const detachDocumentEvents = () => {
      const document2 = getDocument();
      document2.removeEventListener("visibilitychange", onVisibilityChange);
    };
    on("init", () => {
      if (swiper.params.autoplay.enabled) {
        attachMouseEvents();
        attachDocumentEvents();
        start();
      }
    });
    on("destroy", () => {
      detachMouseEvents();
      detachDocumentEvents();
      if (swiper.autoplay.running) {
        stop();
      }
    });
    on("_freeModeStaticRelease", () => {
      if (pausedByTouch || pausedByInteraction) {
        resume();
      }
    });
    on("_freeModeNoMomentumRelease", () => {
      if (!swiper.params.autoplay.disableOnInteraction) {
        pause(true, true);
      } else {
        stop();
      }
    });
    on("beforeTransitionStart", (_s, speed, internal) => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      if (internal || !swiper.params.autoplay.disableOnInteraction) {
        pause(true, true);
      } else {
        stop();
      }
    });
    on("sliderFirstMove", () => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      if (swiper.params.autoplay.disableOnInteraction) {
        stop();
        return;
      }
      isTouched = true;
      pausedByTouch = false;
      pausedByInteraction = false;
      touchStartTimeout = setTimeout(() => {
        pausedByInteraction = true;
        pausedByTouch = true;
        pause(true);
      }, 200);
    });
    on("touchEnd", () => {
      if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
      clearTimeout(touchStartTimeout);
      clearTimeout(timeout);
      if (swiper.params.autoplay.disableOnInteraction) {
        pausedByTouch = false;
        isTouched = false;
        return;
      }
      if (pausedByTouch && swiper.params.cssMode) resume();
      pausedByTouch = false;
      isTouched = false;
    });
    on("slideChange", () => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      if (swiper.autoplay.paused) {
        autoplayTimeLeft = getTotalDelay();
        autoplayDelayTotal = getTotalDelay();
      }
    });
    Object.assign(swiper.autoplay, {
      start,
      stop,
      pause,
      resume
    });
  }

  // src/assets/libs/js/vendor.js
  Swiper.use([Autoplay]);
  window.Swiper = Swiper;
})();
