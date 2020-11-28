import reducer, { initialState } from './authReducer'
import { getAuthAction, ACTION_CONSTANTS } from '../actions/authActions'

describe('auth reducer', () => {
  it('should retturn inital state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle AUTH', () => {
    expect(reducer(initialState, getAuthAction(ACTION_CONSTANTS.AUTH))).toEqual({
      isAuth: true,
    })
  })

  it('should handle NOT_AUTH', () => {
    expect(reducer(initialState, getAuthAction(ACTION_CONSTANTS.NOT_AUTH))).toEqual({
      isAuth: false,
    })
  })
})
