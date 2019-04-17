export const GET_FCM_TOKEN = "GET_FCM_TOKEN";
export const SET_FCM_TOKEN = "SET_FCM_TOKEN";

const fcmReducer = (
  state = {
    token: ""
  },
  action
) => {
  switch (action.type) {
    case GET_FCM_TOKEN:
      return state.token;
    case SET_FCM_TOKEN:
      return { token: action.token };
    default:
      return state;
  }
};

export default fcmReducer;
