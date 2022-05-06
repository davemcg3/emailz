 import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { USERS_CREATE, USERS_LOGIN, USERS_RETRIEVE, USERS_LOGOUT } from '../constants'

const authState = {
    loading: false,
    profileFetching: false,
    email: "",
    name: "",
    secret: "",
    admin: false,
    error: "",
}

const registerCall = createAsyncThunk(USERS_CREATE, args => {
    return fetch("http://localhost:8888/api/users-sign-up", { method: 'POST', mode: 'no-cors', body: JSON.stringify(args) })
        .then(response => {
            if (!response.ok) throw Error(response.statusText)
            return response.json()
        })
        .then(json => json)
})

const loginCall = createAsyncThunk(USERS_LOGIN, (args, { dispatch }) => {
    return fetch("http://localhost:8888/api/users-sign-in", { method: 'POST', mode: 'no-cors', body: args })
        .then(response => {
            if (!response.ok) throw Error(response.statusText)
            return response.json()
        })
        .then(json => {
            dispatch(profileFetchCall({ secret: json.secret, id: json.instance["@ref"].id }))
            return json
        })
        .then(json => json)
})

const profileFetchCall = createAsyncThunk(USERS_RETRIEVE, args => {
    return fetch("http://localhost:8888/api/user-retrieve", { method: 'POST', mode: 'cors', headers: { 'Authorization': `Bearer ${args.secret}` }, body: JSON.stringify({id: args.id}) })
        .then(response => {
            if (!response.ok) throw Error(response.statusText)
            return response.json()
        })
        .then(json => json)
})

const logoutCall = createAsyncThunk(USERS_LOGOUT, args => {
    return fetch("http://localhost:8888/api/users-sign-out", { method: 'DELETE', mode: 'cors', headers: { 'Authorization': `Bearer ${args.secret}` } })
        .then(response => {
            if (!response.ok) throw Error(response.statusText)
            return response.json()
        })
        .then(json => json)
})

const authSlice = createSlice({
    name: "auth",
    initialState: authState,
    reducers: {
    },
    extraReducers: {
        [loginCall.pending]: state => {
            state.loading = true
            state.profileFetching = true
        },
        [loginCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [loginCall.fulfilled]: (state, action) => {
            state.loading = false
            state.error = ""
            state.secret = action.payload.secret
        },
        [profileFetchCall.pending]: state => {
            state.profileFetching = true
        },
        [profileFetchCall.rejected]: (state, action) => {
            state.profileFetching = false
            state.email = ""
            state.name = ""
            state.admin = false
            state.error = action.error.message
        },
        [profileFetchCall.fulfilled]: (state, action) => {
            state.profileFetching = false
            state.email = action.payload.data.email
            state.name = action.payload.data.name
            state.admin = action.payload.data.admin || false
        },
        [logoutCall.pending]: state => {
            state.loading = true
        },
        [logoutCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [logoutCall.fulfilled]: (state, action) => {
            state.loading = false
            state.email = ''
            state.name = ''
            state.admin = false
            state.secret = ''
            state.error = ''
        },
        [registerCall.pending]: state => {
            state.loading = true
        },
        [registerCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [registerCall.fulfilled]: (state, action) => {
            state.loading = false
            state.email = action.payload.email
            state.name = action.payload.name
            state.admin = action.payload.admin || false
            state.secret = action.payload.secret
            state.error = ''
        }
    }
})

// const { loginSuccess, loginFailed } = authSlice.actions
const authReducer = authSlice.reducer

export { authReducer, loginCall, logoutCall, profileFetchCall, registerCall, authState }
