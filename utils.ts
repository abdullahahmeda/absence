import * as yup from 'yup'

export function isValidId (id: unknown) {
  return yup
    .number()
    .positive()
    .integer()
    .isValidSync(id)
}
