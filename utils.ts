import * as yup from 'yup'

export function isValidId (id) {
  return yup
    .number()
    .positive()
    .integer()
    .isValidSync(id)
}
