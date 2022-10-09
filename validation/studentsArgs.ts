import yup from './yup'

const studentsArgs = {
  lesson: yup
    .number()
    .positive()
    .integer()
}

export default studentsArgs
