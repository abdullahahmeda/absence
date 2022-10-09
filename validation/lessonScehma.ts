import yup from './yup'

const lessonSchema = yup.object({
  name: yup
    .string()
    .required()
    .max(150)
    .label('الاسم'),
  teacher: yup
    .object({
      id: yup
        .number()
        .positive()
        .integer()
        .required()
    })
    .label('الشيخ')
    .required()
    .nullable(),
  students: yup
    .array()
    .of(
      yup.object({
        id: yup
          .number()
          .positive()
          .integer()
          .required()
      })
    )
    .required()
    .min(1)
    .label('الطلاب')
})

export default lessonSchema
