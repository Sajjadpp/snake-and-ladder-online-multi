export const authActions = {
  SET_LOADING: 'SET_LOADING',
  SET_TOKEN: 'SET_TOKEN',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT'
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case authActions.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case authActions.SET_TOKEN:
      return { ...state, token: action.payload };
    
    case authActions.SET_USER:
      return { ...state, user: action.payload };
    
    case authActions.LOGOUT:
      return { 
        token: null, 
        user: null, 
        loading: false 
      };
    
    default:
      return state;
  }
};