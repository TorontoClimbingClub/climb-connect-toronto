
export const useEventStatus = () => {
  const getEventStatus = (event: any) => {
    const now = new Date();
    const eventStartTime = new Date(`${event.date}T${event.time}`);
    const eventEndTime = event.end_time ? new Date(`${event.date}T${event.end_time}`) : null;

    if (now < eventStartTime) {
      return { status: 'upcoming', label: 'Upcoming', color: 'blue' };
    } else if (eventEndTime && now >= eventStartTime && now <= eventEndTime) {
      return { status: 'running', label: 'Event Running', color: 'green' };
    } else {
      return { status: 'ended', label: 'Event Ended', color: 'gray' };
    }
  };

  return { getEventStatus };
};
