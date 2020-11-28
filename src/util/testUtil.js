import React from 'react'
import { Provider } from 'react-redux'

export function AppWrapper(props) {
  return <Provider store={props.store}>{props.children}</Provider>
}
