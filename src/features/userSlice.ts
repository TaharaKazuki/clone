import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../app/store'

type USER = {
  uid?: string
  displayName?: string
  photoUrl?: string
}

export type UserState = {
  user: USER
}

const initialState: UserState = {
  user: {
    uid: undefined,
    photoUrl: undefined,
    displayName: undefined,
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = initialState.user
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName
      state.user.photoUrl = action.payload.photoUrl
    },
  },
})

export const { login, logout, updateUserProfile } = userSlice.actions

export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer
