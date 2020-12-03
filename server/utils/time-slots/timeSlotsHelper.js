const moment = require('moment');

module.exports.formatOrderedTimeSlots = (timeSlots) => 
    timeSlots.map(timeSlot => timeSlot.start_time.substring(0, 5));

module.exports.getFreeTimeSlots = (start_time, end_time, slot_duration, orderedSlots, date) => {
    start_time = moment(start_time, 'HH:mm:ss');
    end_time = moment(end_time, 'HH:mm:ss');
    current_time = moment();

    const freeSlots = [];

    do {
        const formatedTime = start_time.format('HH:mm');
        if(! orderedSlots.includes(formatedTime)) freeSlots.push(formatedTime);
        start_time.add(slot_duration, 'minutes');
    } while(start_time < end_time)

    return freeSlots;
}

module.exports.scheduleToTimeslots = (schedules) => {
    return [].concat(...schedules.map(schedule => schedule.timeSlots.map(timeSlot => {
        return {
            start_time: timeSlot.start_time.substring(0, 5),
            date_visiting: moment(timeSlot.date_visiting).format('YYYY-MM-DD'),
            doctor_name: `${schedule.workPlace.doctor.person.first_name} ${schedule.workPlace.doctor.person.middle_name} ${schedule.workPlace.doctor.person.last_name}`,
            doctor_photo: schedule.workPlace.doctor.person.photo,
            hospital: schedule.workPlace.hospital.name_hosp

        }
    })))
}