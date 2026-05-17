export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};