import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../app/store'

export type UserState = {
  user: {
    uid?: string
    photoUrl?: string
    displayName?: string
  }
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
    updateUserProfile: (state, action: PayloadAction<UserState>) => {
      state.user.displayName = action.payload.user.displayName
      state.user.photoUrl = action.payload.user.photoUrl
    },
  },
})

export const { login, logout, updateUserProfile } = userSlice.actions

export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer
