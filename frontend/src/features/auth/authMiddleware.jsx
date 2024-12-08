import {logout,setAuthError} from './authSlice'

const createAuthMiddleware = (store) => (next) => (action) => {
    if (action.type === 'auth/error'){
        const {status} = action.error;
        if(status === 401){
            store.dispatch(logout());
        } else if(status === 403){
            store.dispatch(setAuthError('You do not have permission for this action.'));
        }
    }
    return next(action);
}

export default createAuthMiddleware;