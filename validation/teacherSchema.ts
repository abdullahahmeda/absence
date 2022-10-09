import yup from './yup'

const teacherSchema = yup.object({
  name: yup
    .string()
    .required()
    .label('الاسم')
    .max(100)
})

export default teacherSchema
