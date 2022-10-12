import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: ({ path }) => `حقل ${path} إجباري.`,
    oneOf: ({ path, values }) =>
      `حقل ${path} يجب أن يكون واحداً من القيم ${values}`
  },
  string: {
    url: ({ path }) => `حقل ${path} يجب أن يكون رابط.`,
    min: ({ path, min }) => `حقل ${path} يجب أن يكون ${min} حروف على الأقل.`,
    max: ({ path, max }) => `حقل ${path} يجب أن يكون ${max} حرف على الأكثر.`
  },
  array: {
    min: ({ path, min }) =>
      `حقل ${path} يجب أن يحتوي على ${min} عنصر على الأقل.`
  }
})

yup.addMethod(yup.string, 'password', function () {
  return this.min(4).max(100)
})

export default yup
