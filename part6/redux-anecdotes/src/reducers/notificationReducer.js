import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return initialState
    },
  },
})

export const { removeNotification, createNotification } =
  notificationSlice.actions

export const setNotification = (content, dismissAfter) => {
  return async (dispatch) => {
    dispatch(removeNotification())
    dispatch(createNotification(content))
    setTimeout(() => {
      dispatch(removeNotification())
    }, dismissAfter * 1000)
  }
}

export default notificationSlice.reducer
