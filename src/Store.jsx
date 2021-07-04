import { createStore } from "redux";

const initialState = {
  authenticated: false,
  user: {}
};

function modifyStore(state = initialState, action) {
  switch (action.type) {
    case "auth/authenticated":
      return { ...state, authenticated: action.payload}
    case "auth/user":
      return { ...state, user: action.payload }
    default:
      return state;
  }
}

const store = createStore(modifyStore);
export { store };