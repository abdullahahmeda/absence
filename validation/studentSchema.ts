import yup from './yup'

const studentSchema = yup.object({
  name: yup
    .string()
    .required()
    .label('الاسم')
    .max(100)
})

export default studentSchema
