// import {
//   LOGIN_FAILURE,
//   LOGIN_REQUEST,
//   LOGIN_SUCCESS,
//   LOGOUT,
// } from "../actions/authActions";

// const initialState = {
//   token: null,
//   error: null,
//   loading: false,
// };

// const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOGIN_REQUEST:
//       return {
//         ...state,
//         error: null,
//         loading: true,
//       };
//     case LOGIN_SUCCESS:
//       return {
//         ...state,
//         token: action.payload,
//         error: null,
//         loading: false,
//       };
//     case LOGIN_FAILURE:
//       return {
//         ...state,
//         error: action.payload,
//         loading: false,
//       };
//     case LOGOUT:
//       return {
//         ...state,
//         user: null,
//       };
//     default:
//       return state;
//   }
// };

// export default authReducer;
