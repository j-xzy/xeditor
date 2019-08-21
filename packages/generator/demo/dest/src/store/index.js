import { createStore, combineReducer } from '../../packages/annie';
import compReducer from './compReducer';
import varReducer from './varReducer';
import apiReducer from './apiReducer';
import property from "../components/property";
const store = createStore();
store.model({
  namespace: "0",
  state: {
    style: {
      "width": "1920px",
      "height": "1080px",
      "backgroundSize": "cover",
      "backgroundImage": "url()",
      "backgroundColor": "#ffffff",
      "scale": 0.55
    }
  },
  reducer: compReducer
});
store.model({
  namespace: "4",
  state: {
    "name": "属性示例",
    "style": {
      "position": "relative",
      "visibility": "visible",
      "display": "block",
      "float": "none",
      "width": "180px",
      "height": "180px",
      "zIndex": 0,
      "margin": "0px",
      "padding": "0px",
      "top": "0",
      "left": "0",
      "right": "0",
      "bottom": "0",
      "flexDirection": "row",
      "justifyContent": "space-between",
      "alignItems": "center",
      "flex": "0 1 auto",
      "backgroundImage": "url()",
      "backgroundSize": "cover",
      "backgroundColor": "rgba(255,255,255,0)"
    },
    "property": {
      "refresh": -1,
      "input": "文本",
      "select": "value1",
      "switch": "value1",
      "radio": "value1",
      "checkbox": ["value1"],
      "upload": "http://192.168.8.96:8000/public/images/Gnf_MkAzZKBDH79JnT_Ri6U9.png",
      "color": "#ff8800",
      "slider": 5,
      "nest": {
        "nest1": {
          "foo": "http://192.168.8.96:8000/public/images/1XbQaGxbNAxWzHVsX5zseRBz.png",
          "bar": true,
          "nest2": {
            "foo": "xxx",
            "nest3": {
              "name": "1"
            }
          }
        },
        "prop1": "prop1",
        "prop2": "prop2"
      }
    },
    "id": 4
  },
  reducer: combineReducer([property.reducer, compReducer])
});
export default store;