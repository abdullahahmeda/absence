import yup from './yup'

const profileSchema = yup.object({
  currentPassword: yup
    .string()
    .password()
    .required()
    .label('كلمة المرور الحالية'),
  newPassword: yup
    .string()
    .password()
    .required()
    .label('كلمة المرور الجديدة'),
  newPasswordConfirmation: yup
    .string()
    .password()
    .required()
    .label('تأكيد كلمة المرور الجديدة')
    .oneOf([yup.ref('newPassword'), null], 'كلمتا المرور غير متطابقتين.')
})

export default profileSchema
