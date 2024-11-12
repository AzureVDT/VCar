import dayjs, { Dayjs } from "dayjs";
import { jwtDecode } from "jwt-decode";
import numeral from "numeral";
import { DecodedToken } from "../types/common";

export function formatDateToDDMMYYYY(date: Date) {
    return dayjs(date).format('DD-MM-YYYY');
}

export function formatDateToDDMMYYYYHHMMSS(date: Date) {
    return dayjs(date).format('DD-MM-YYYY HH:mm:ss');
}

export function formatDateToDDMM (date: string) {
    return dayjs(date).format('DD/MM');
}

export const formatPrice = (price: number) => {
    return numeral(price).format("0,0");
};

export const getDateRange = (range: 'date' | 'week' | 'month' | 'year'): [Dayjs, Dayjs] => {
    const now = dayjs();
    let startDate: Dayjs;
    let endDate: Dayjs;

    switch (range) {
        case 'date':
            startDate = now.startOf('day');
            endDate = now.endOf('day');
            break;
        case 'week':
            startDate = now.startOf('week');
            endDate = now.endOf('week');
            break;
        case 'month':
            startDate = now.startOf('month');
            endDate = now.endOf('month');
            break;
        case 'year':
        default:
            startDate = now.startOf('year');
            endDate = now.endOf('year');
            break;
    }

    return [startDate, endDate];
};

export const handleDecodeJWT = (token: string): DecodedToken | null => {
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const replaceSpacesWithUnderscores = (str: string): string => {
    return str.replace(/\s+/g, '_');
};

export const convertTimestampToDayjs = (timestamp: number | null): dayjs.Dayjs | null => {
    if (timestamp === null) {
      return null;
    }
    const seconds = timestamp.toString().length === 13 ? Math.floor(timestamp / 1000) : timestamp;
    return dayjs.unix(seconds);
};