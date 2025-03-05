import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';

export const formatEventDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.toDateString() === end.toDateString()) {
    // Same day event
    return `${formatDate(start)} • ${formatTime(start)} - ${formatTime(end)}`;
  } else {
    // Multi-day event
    return `${formatDateTime(start)} - ${formatDateTime(end)}`;
  }
};

export const formatDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end - start;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const parts = [];

  if (days > 0) {
    parts.push(`${days} day${days > 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0 && days === 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }

  return parts.join(' ');
};

export const isEventUpcoming = (startDate) => {
  const now = new Date();
  const start = new Date(startDate);
  return start > now;
};

export const isEventOngoing = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= now && end >= now;
};

export const isEventPast = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  return end < now;
};

export const getEventStatus = (startDate, endDate) => {
  if (isEventUpcoming(startDate)) {
    return 'upcoming';
  }
  if (isEventOngoing(startDate, endDate)) {
    return 'ongoing';
  }
  return 'past';
};

export const getRelativeTimeString = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diff = target - now;
  const diffInSeconds = Math.floor(diff / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `in ${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
  }
  if (diffInHours > 0) {
    return `in ${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
  }
  if (diffInMinutes > 0) {
    return `in ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }
  if (diffInSeconds > 0) {
    return 'starting soon';
  }
  return 'started';
};

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}; 