define(["react"], function(__WEBPACK_EXTERNAL_MODULE_react__) { return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = "../../../../components/evtBtn/v1.0/index.jsx");
  /******/ })
  /************************************************************************/
  /******/ ({
  
  /***/ "../../../../components/evtBtn/v1.0/index.jsx":
  /*!*******************************************************************************!*\
    !*** /home/whj/Documents/script/xeditor-cli/components/evtBtn/v1.0/index.jsx ***!
    \*******************************************************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
  /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
  
  var initialState = {
    name: '事件按钮',
    style: {
      width: '80px',
      height: '50px'
    },
    property: {
      disabled: false
    }
  };
  var option = {
    event: {
      trigger: [{
        name: '点击',
        type: 'click'
      },
      {
        name: '鼠标移上',
        type: 'hover'
      }]
    },
    property: {
      disabled: {
        name: '禁用',
        type: 'switch',
        config: {
          on: true,
          off: false
        }
      }
    }
  };
  
  function reducer(action) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : initialState;
    return state;
  }
  
  function EvtBtn(props) {
    return arguments[0].connect(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: props.style
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      style: {
        width: props.style.width,
        height: props.style.height
      },
      disabled: props.property.disabled,
      onClick: function onClick() {
        return props.trigger('click');
      }
    }, "\u70B9\u51FB")));
  }
  
  /* harmony default export */ __webpack_exports__["default"] = ({
    reducer: reducer,
    component: EvtBtn,
    option: option
  });
  
  /***/ }),
  
  /***/ "react":
  /*!************************!*\
    !*** external "react" ***!
    \************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  module.exports = __WEBPACK_EXTERNAL_MODULE_react__;
  
  /***/ })
  
  /******/ })});;
  //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9ob21lL3doai9Eb2N1bWVudHMvc2NyaXB0L3hlZGl0b3ItY2xpL2NvbXBvbmVudHMvZXZ0QnRuL3YxLjAvaW5kZXguanN4Iiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0XCIiXSwibmFtZXMiOlsiaW5pdGlhbFN0YXRlIiwibmFtZSIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJwcm9wZXJ0eSIsImRpc2FibGVkIiwib3B0aW9uIiwiZXZlbnQiLCJ0cmlnZ2VyIiwidHlwZSIsImNvbmZpZyIsIm9uIiwib2ZmIiwic3RhdGUiLCJwcm9wcyIsInJlZHVjZXIiLCJjb21wb25lbnQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFDQSxJQUFNQSxZQUFZLEdBQUc7QUFDbkJDLE1BQUksRUFEZTtBQUVuQkMsT0FBSyxFQUFFO0FBQ0xDLFNBQUssRUFEQTtBQUVMQyxVQUFNLEVBQUU7QUFGSCxHQUZZO0FBTW5CQyxVQUFRLEVBQUU7QUFDUkMsWUFBUSxFQUFFO0FBREY7QUFOUyxDQUFyQjtBQVdBLElBQU1DLE1BQU0sR0FBRztBQUNiQyxPQUFLLEVBQUU7QUFDTEMsV0FBTyxFQUFFLENBQUM7QUFDUlIsVUFBSSxFQURJO0FBRVJTLFVBQUksRUFBRTtBQUZFLEtBQUQ7QUFESixHQURNO0FBT2JMLFVBQVEsRUFBRTtBQUNSQyxZQUFRLEVBQUU7QUFDUkwsVUFBSSxFQURJO0FBRVJTLFVBQUksRUFGSTtBQUdSQyxZQUFNLEVBQUU7QUFDTkMsVUFBRSxFQURJO0FBRU5DLFdBQUcsRUFBRTtBQUZDO0FBSEE7QUFERjtBQVBHLENBQWY7O0FBbUJBLHlCQUErQztBQUFBLE1BQXRCQyxLQUFzQix1RUFBZGQsWUFBYztBQUM3QztBQUNEOztBQUVELHVCQUF1QjtBQUNyQiw4QkFDRTtBQUFLLFNBQUssRUFBRWUsS0FBSyxDQUFDYjtBQUFsQixLQUNFO0FBQ0UsU0FBSyxFQUFFO0FBQ0xDLFdBQUssRUFBRVksS0FBSyxDQUFMQSxNQURGO0FBRUxYLFlBQU0sRUFBRVcsS0FBSyxDQUFMQSxNQUFZWDtBQUZmLEtBRFQ7QUFLRSxZQUFRLEVBQUVXLEtBQUssQ0FBTEEsU0FMWjtBQU1FLFdBQU8sRUFBRTtBQUFBLGFBQU1BLEtBQUssQ0FBTEEsUUFBTixPQUFNQSxDQUFOO0FBQUE7QUFOWCxLQUZKLGNBRUksQ0FERixDQURGO0FBYUQ7O0FBRWM7QUFDYkMsU0FBTyxFQURNO0FBRWJDLFdBQVMsRUFGSTtBQUdiVixRQUFNLEVBQU5BO0FBSGEsQ0FBZixFOzs7Ozs7Ozs7OztBQ25EQSxtRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4uLy4uLy4uLy4uL2NvbXBvbmVudHMvZXZ0QnRuL3YxLjAvaW5kZXguanN4XCIpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgbmFtZTogJ+S6i+S7tuaMiemSricsXG4gIHN0eWxlOiB7XG4gICAgd2lkdGg6ICc4MHB4JyxcbiAgICBoZWlnaHQ6ICc1MHB4J1xuICB9LFxuICBwcm9wZXJ0eToge1xuICAgIGRpc2FibGVkOiBmYWxzZVxuICB9XG59O1xuXG5jb25zdCBvcHRpb24gPSB7XG4gIGV2ZW50OiB7XG4gICAgdHJpZ2dlcjogW3tcbiAgICAgIG5hbWU6ICfngrnlh7snLFxuICAgICAgdHlwZTogJ2NsaWNrJ1xuICAgIH1dXG4gIH0sXG4gIHByb3BlcnR5OiB7XG4gICAgZGlzYWJsZWQ6IHtcbiAgICAgIG5hbWU6ICfnpoHnlKgnLFxuICAgICAgdHlwZTogJ3N3aXRjaCcsXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgb246IHRydWUsXG4gICAgICAgIG9mZjogZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZHVjZXIoYWN0aW9uLCBzdGF0ZSA9IGluaXRpYWxTdGF0ZSkge1xuICByZXR1cm4gc3RhdGU7XG59XG5cbmZ1bmN0aW9uIEV2dEJ0bihwcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3Byb3BzLnN0eWxlfT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogcHJvcHMuc3R5bGUud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBwcm9wcy5zdHlsZS5oZWlnaHRcbiAgICAgICAgfX1cbiAgICAgICAgZGlzYWJsZWQ9e3Byb3BzLnByb3BlcnR5LmRpc2FibGVkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBwcm9wcy50cmlnZ2VyKCdjbGljaycpfT5cbiAgICAgICAg54K55Ye7XG4gICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcmVkdWNlcjogcmVkdWNlcixcbiAgY29tcG9uZW50OiBFdnRCdG4sXG4gIG9wdGlvblxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfcmVhY3RfXzsiXSwic291cmNlUm9vdCI6IiJ9