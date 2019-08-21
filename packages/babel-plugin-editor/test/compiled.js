"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

require("css!leaflet");

require("css!ol-commonjs");

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

var flv = _interopRequireWildcard(require("flv"));

var _hls = _interopRequireDefault(require("hls"));

var b = _interopRequireWildcard(require("ol-commonjs"));

var c = _interopRequireWildcard(require("leaflet"));

var d = _interopRequireWildcard(require("./compiled.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const initialState = {
  name: '文字',
  style: {
    width: '140px',
    height: '40px'
  },
  property: {
    text: {
      fontSize: '35px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      textAlign: 'left',
      lineHeight: '35px',
      fontFamily: 'none',
      color: 'rgba(0, 0, 0, 0.65)'
    }
  },
  data: {
    json: [{
      name: '',
      value: '一段文字'
    }],
    api: {
      data: [],
      form: {
        url: 'www'
      }
    },
    type: 'json'
  }
};
const option = {
  event: {
    response: [{
      name: '赋值',
      type: 'assgin'
    }, {
      name: '更改url',
      type: 'changeUrl'
    }]
  }
};

function reducer(action, state = initialState) {
  switch (action) {
    case 'assgin':
      {
        return (0, _immutabilityHelper.default)(state, {
          data: {
            json: {
              [0]: {
                value: {
                  $set: action.data
                }
              }
            }
          }
        });
      }
  }

  return state;
}

function Text(props) {
  return arguments[0].connect(_react.default.createElement("div", {
    style: _objectSpread({}, props.style, props.property.text)
  }, props.value));
} // class Text extends React.Component {
//   render() {
//     return (
//       <div style={{ ...props.style, ...props.property.text }}>
//         {props.value}
//       </div>
//     );
//   }
// }


var _default = {
  reducer: reducer,
  component: Text,
  option
};
exports.default = _default;
