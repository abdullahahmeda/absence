import yup from './yup'

const loginSchema = yup.object({
  username: yup
    .string()
    .required()
    .matches(/^\w+$/, {
      excludeEmptyString: true,
      message: '${path} يمكن أن يحتوي على حروف إنجليزية، أو رقام أو ( _ ).'
    })
    .max(100)
    .min(3)
    .label('اسم المستخدم'),
  password: yup
    .string()
    .required()
    .max(100)
    .min(4)
    .label('كلمة المرور')
})

export default loginSchema
