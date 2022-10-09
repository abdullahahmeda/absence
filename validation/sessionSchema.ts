import yup from './yup'
import mapValues from 'lodash.mapvalues'

const sessionSchema = yup.object({
  title: yup
    .string()
    .required()
    .label('العنوان')
    .max(150),
  lesson: yup
    .object({
      id: yup
        .number()
        .positive()
        .integer()
        .required()
    })
    .required()
    .nullable()
    .label('الدرس'),
  date: yup
    .date()
    .required()
    .nullable()
    .label('تاريخ الجلسة'),
  students: yup.lazy(obj =>
    yup
      .object(
        mapValues(obj, (_: any, key: any) =>
          yup.object({
            present: yup.boolean(),
            count: yup.boolean()
          })
        )
      )
      .label('الطلاب')
  ) as any
})

export default sessionSchema
