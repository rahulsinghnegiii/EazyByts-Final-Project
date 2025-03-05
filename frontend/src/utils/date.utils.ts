import { format, formatDistance, parseISO, isValid, isFuture, isPast } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, formatStr) : 'Invalid date';
};

export const formatRelativeTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate)
    ? formatDistance(parsedDate, new Date(), { addSuffix: true })
    : 'Invalid date';
};

export const formatEventDate = (startDate: string | Date, endDate?: string | Date): string => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  
  if (!endDate) {
    return formatDate(start, 'PPP');
  }

  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(start) || !isValid(end)) {
    return 'Invalid date';
  }

  // Same day event
  if (format(start, 'PP') === format(end, 'PP')) {
    return `${format(start, 'PPP')} ${format(start, 'p')} - ${format(end, 'p')}`;
  }

  // Multi-day event
  return `${format(start, 'PPP')} - ${format(end, 'PPP')}`;
};

export const getEventStatus = (startDate: string | Date, endDate: string | Date): 'upcoming' | 'ongoing' | 'past' => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(start) || !isValid(end)) {
    throw new Error('Invalid date');
  }

  const now = new Date();

  if (isFuture(start)) {
    return 'upcoming';
  }

  if (isPast(end)) {
    return 'past';
  }

  return 'ongoing';
};

export const formatTimeRange = (startTime: string, endTime: string): string => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  if (!isValid(start) || !isValid(end)) {
    return 'Invalid time';
  }

  return `${format(start, 'p')} - ${format(end, 'p')}`;
}; 