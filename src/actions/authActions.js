export const ACTION_CONSTANTS = {
  AUTH: 'AUTH',
  NOT_AUTH: 'NOT_AUTH',
}

export function getAuthAction(type) {
  return {
    type,
  }
}
