export default async function apiReducer(action, state, allState) {
  const { type, data } = action;
  if (type === 'request') {
    const info = { method: data.method };
    if(info.method === 'POST') {
      info.body = data.body;
      if(typeof info.body !== 'string') {
        info.body = JSON.stringify(info.body);
      }
    }

    const response = await fetch(data.url, info).then((res) => res.text());
    let result;
    try {
      result = JSON.parse(response);
    } catch (e) {
      result = response;
    }
    return { ...state, data: result };
  }

  if (type === 'setData') {
    return { ...state, data: action.data }
  }

  if (type === 'setProperty') {
    return { ...state, property: { ...state.property, ...action.data } }
  }
}