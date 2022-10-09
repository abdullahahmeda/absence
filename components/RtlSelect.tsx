import { MdExpandMore } from 'react-icons/md'
import Select, { Props, components } from 'react-select'

const RtlSelect = (props: Props) => {
  return (
    <Select
      isRtl
      noOptionsMessage={() => 'لا يوجد نتائج'}
      loadingMessage={() => 'جاري التحميل...'}
      placeholder='اختر...'
      styles={{
        control: () => ({}),
        valueContainer: base => ({ ...base, padding: 0 }),
        input: base => ({
          ...base,
          paddingTop: 0,
          paddingBottom: 0
        }),
        dropdownIndicator: base => ({
          ...base,
          padding: 0,
          paddingRight: 8
        }),
        indicatorSeparator: base => ({
          ...base,
          marginTop: 0,
          marginBottom: 0
        })
      }}
      components={{
        Control: ({ children, ...props }) => {
          return (
            <components.Control
              {...props}
              className='form-input flex w-full input'
            >
              {children}
            </components.Control>
          )
        },
        DropdownIndicator: props => {
          return (
            <components.DropdownIndicator {...props}>
              <MdExpandMore size={22} />
            </components.DropdownIndicator>
          )
        }
      }}
      {...props}
    />
  )
}

export default RtlSelect
