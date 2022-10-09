import { format, getYear, isSameDay, isToday } from 'date-fns'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
const DatePicker = (props: ReactDatePickerProps) => {
  return (
    <ReactDatePicker
      className='block w-full input'
      calendarClassName='bg-white p-3 rounded-lg shadow relative top-[5px]'
      dayClassName={date =>
        'cursor-pointer rounded-lg w-[40px] py-2 text-center inline-block last-of-type:ml-0 text-sm'
      }
      weekDayClassName={() =>
        'inline-block  w-[40px] text-center text-sm last-of-type:ml-0'
      }
      dateFormat='dd-MM-yyyy'
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled
      }) => (
        <div className='flex items-center'>
          <p className='font-bold'>{`${format(date, 'MMMM')} ${getYear(
            date
          )}`}</p>
          <div className='mr-auto'>
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              type='button'
              className='hover:bg-gray-200 p-2 rounded-full'
            >
              <MdChevronRight size={20} />
            </button>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              type='button'
              className='hover:bg-gray-200 p-2 rounded-full'
            >
              <MdChevronLeft size={20} />
            </button>
          </div>
        </div>
      )}
      {...props}
    />
  )
}

export default DatePicker
