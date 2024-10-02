import numeral from 'numeral';
import moment from 'moment';

export const formatPrice = (price: number) => {
  return numeral(price).format('0,0');
};

export const formatDate = (date: string) => {
  // using moment to format timestamp to dd/mm/yyyy hh:mm
  return moment(date).format('DD/MM/YYYY HH:mm');
};
