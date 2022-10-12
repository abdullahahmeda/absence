import * as yup from 'yup'

export function isValidId (id: any) {
  return yup
    .number()
    .positive()
    .integer()
    .isValidSync(id)
}
