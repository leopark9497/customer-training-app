import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'

export interface Event {
    start: string, end: string, title: string
}

const localizer = momentLocalizer(moment)


export function TrainingsCalendar ({ events } : { events: Event[] }) {

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
        />
    )
}