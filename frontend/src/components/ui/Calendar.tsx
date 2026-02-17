//Generate code for Calendar component to use like <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />. The Calendar component should use the react-day-picker library to render a calendar and allow users to select a date or range of dates based on the mode prop. The selected date(s) should be passed back to the parent component through the onSelect callback.
import React from 'react';
//alternative to react-day-picker implemnt here
import { format } from 'date-fns';
//how to use format to display date in calendar component 
//import { format } from 'date-fns';     
// const formattedDate = format(new Date(), 'MM/dd/yyyy');
// console.log(formattedDate); // Output: 09/30/2021
// how to use format to display date range in calendar component
// const formattedRange = format(new Date(), 'MM/dd/yyyy') + ' - ' + format(new Date(), 'MM/dd/yyyy');
// console.log(formattedRange); // Output: 09/30/2021 - 09/30/2021
// how to use format to display month and year in calendar component
// const formattedMonthYear = format(new Date(), 'MMMM yyyy');
// console.log(formattedMonthYear); // Output: September 2021
// how to use format to display day of week in calendar component
// const formattedDayOfWeek = format(new Date(), 'EEEE');
// console.log(formattedDayOfWeek); // Output: Thursday
// how to use format to display date and time in calendar component
// const formattedDateTime = format(new Date(), 'MM/dd/yyyy HH:mm:ss');
// console.log(formattedDateTime); // Output: 09/30/2021 14:30:00
// how to use format to display date in different locale in calendar component
// const formattedDateLocale = format(new Date(), 'MM/dd/yyyy', { locale: fr });
// console.log(formattedDateLocale); // Output: 30/09/2021

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
interface CalendarProps {
    mode: 'single' | 'multiple' | 'range';
    selected?: Date | Date[] | { from: Date; to: Date };
    onSelect: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
}
const Calendar: React.FC<CalendarProps> = ({ mode, selected, onSelect }) => {
    return (
        <DayPicker
            mode={mode}
            selected={selected}
            onSelect={onSelect}
        />
    );
}       
export default Calendar;
