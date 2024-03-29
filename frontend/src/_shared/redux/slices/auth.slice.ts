import { createSlice } from '@reduxjs/toolkit';
import { user } from '../../types/auth.slice.types';

type AuthState = {
    user: user | undefined;
    token: string | undefined;
    loading: boolean;
    error: boolean;
    success: boolean;
    isAuthenticated: boolean;
};

const slice = createSlice({
    name: 'auth',
    initialState: {
        token: '',
        user: undefined,
        isAuthenticated: false,
    } as AuthState,
    reducers: {
        setCredentials: (state, { payload: { token } }) => {
            state.token = token;
            localStorage.setItem('_falcon_tkn', token);
            state.isAuthenticated = true;
        },

        setUserInfo: (state, { payload: { user } }) => {
            state.user = user;
            localStorage.setItem('_falcon_usr', JSON.stringify(user));
        },

        removeCredentials: state => {
            state.token = undefined;
            localStorage.removeItem('_falcon_tkn');
            state.isAuthenticated = false;
        }
    }
});

export const { setCredentials, removeCredentials, setUserInfo } = slice.actions;
export default slice.reducer;
