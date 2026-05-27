import { PermissionsAndroid, Platform } from 'react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function makeError(error: any, name?: string, message?: string) {
  if (!error) {
    return;
  }

  let err: Error;
  if (error instanceof Error) {
    err = error;
  } else {
    err = new Error(`${error}`);
  }

  err.name = err.name || name || '';
  err.message = err.message || message || '';

  return err;
}

export function omitEmpty(data: Record<string, any>) {
  return Object.keys(data)
    .filter((k) => data[k] !== undefined)
    .reduce((c, v) => ({ ...c, [v]: data[v] }), {});
}

export async function requestBluetoothPermissions() {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    const permissions = [
      'android.permission.BLUETOOTH_SCAN',
      'android.permission.BLUETOOTH_CONNECT',
    ];

    const granted = await PermissionsAndroid.requestMultiple(permissions as any);

    if (
      granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Bluetooth permissions granted!');
      return true;
    } else {
      console.warn('Bluetooth permissions denied!');
      return false;
    }
  }
  return true;
}

export async function requestLocationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    const permissions = [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ];

    const granted = await PermissionsAndroid.requestMultiple(permissions as any);

    if (
      granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Location permissions granted!');
      return true;
    } else {
      console.warn('Location permissions denied!');
      return false;
    }
  }
  return true;
}

export function removeVietnameseTones(str: string): string {
  if (!str) {
    return '';
  }

  return str
    .normalize('NFD') // Decompose accents from letters
    .replace(/[\u0300-\u036f]/g, '') // Remove all combining marks
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function wrapText(text: string, maxCharsPerLine = 28): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export function formatDateToDDMMYYYY(date: Date | string | number): string {
  const dayjsDate = dayjs(date);
  return dayjsDate.format('DD/MM/YYYY');
}

export function isWithinShiftTime(data: ShiftData): { result: boolean; message: string } {
  const { date, start_shift, end_shift } = data;

  const TIMEZONE = 'Asia/Ho_Chi_Minh';

  const startTime = dayjs.tz(`${date} ${start_shift}`, 'YYYY-MM-DD HH:mm', TIMEZONE);
  let endTime = dayjs.tz(`${date} ${end_shift}`, 'YYYY-MM-DD HH:mm', TIMEZONE);

  if (endTime.isBefore(startTime)) {
    endTime = endTime.add(1, 'day');
  }

  const now = dayjs().tz(TIMEZONE);

  if (now.isAfter(startTime) && now.isBefore(endTime)) {
    return { result: true, message: 'Đang trong ca làm việc.' };
  } else {
    return {
      result: false,
      message: `Không nằm trong ca làm việc (${start_shift} - ${end_shift} ngày ${date}). Vui lòng trở về màn hình danh sách để ghi nhận ca làm việc mới`,
    };
  }
}

/**
 * Format number to Vietnamese Dong (VND) currency
 * @param value - The number to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatToVND(25000000) // "25.000.000 ₫"
 * formatToVND(25000000, { showSymbol: false }) // "25.000.000"
 * formatToVND(25000000, { symbolPosition: 'before' }) // "₫ 25.000.000"
 * formatToVND(0) // "0 ₫"
 * formatToVND(null) // "0 ₫"
 */
export function formatToVND(
  value: number | null | undefined,
  options?: {
    showSymbol?: boolean;
    symbolPosition?: 'before' | 'after';
    separator?: string;
  },
): string {
  const { showSymbol = true, symbolPosition = 'after', separator = '.' } = options || {};

  // Handle null, undefined, or invalid values
  const numValue = value ?? 0;

  // Format number with thousand separators
  const formattedNumber = numValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  // Return with or without currency symbol
  if (!showSymbol) {
    return formattedNumber;
  }

  return symbolPosition === 'before' ? `₫ ${formattedNumber}` : `${formattedNumber} ₫`;
}

// Format datetime string from API (07-11-2025 08:53:04) to display (08:53 07/11/2025)
export const formatDateTime = (datetime?: string) => {
  if (!datetime) {
    return '';
  }
  try {
    // Parse format: 07-11-2025 08:53:04
    const parts = datetime.split(' ');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return datetime;
    }
    const datePart = parts[0];
    const timePart = parts[1];
    const dateParts = datePart.split('-');
    const timeParts = timePart.split(':');
    if (dateParts.length !== 3 || timeParts.length < 2) {
      return datetime;
    }
    const [year, month, day] = dateParts;
    const [hours, minutes] = timeParts;
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return datetime;
  }
};

// Format time to display (HH:mm)
export const formatTime = (date?: Date) => {
  if (!date) {
    return '';
  }
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Format time range to display (HH:mm - HH:mm)
export const formatTimeRange = (fromDate?: Date, toDate?: Date) => {
  if (!fromDate && !toDate) {
    return '';
  }
  const fromTime = fromDate ? formatTime(fromDate) : '--:--';
  const toTime = toDate ? formatTime(toDate) : '--:--';
  return `${fromTime} - ${toTime}`;
};

// Format Date to Odoo datetime string (YYYY-MM-DD HH:mm:ss) in local timezone
export const formatDateTimeForOdoo = (date?: Date) => {
  if (!date) {
    return undefined;
  }
  const temp = dayjs(date).utc().format('YYYY-MM-DD HH:mm:ss');
  console.log(temp);
  return temp;
};

// Format Date to Odoo datetime string (YYYY-MM-DD HH:mm:ss) in local timezone
export const formatDateTimeForOdoo2 = (date?: string): string | undefined => {
  if (!date) {
    return false as unknown as string;
  }
  const temp = dayjs(date).utc().format('YYYY-MM-DD HH:mm:ss');
  return temp;
};

export const getLocalFileType = (mimetype: string): 'image' | 'pdf' | 'docx' | 'video' => {
  if (mimetype.startsWith('image')) {
    return 'image';
  } else if (mimetype.includes('pdf')) {
    return 'pdf';
  } else if (mimetype.startsWith('video')) {
    return 'video';
  }
  return 'docx';
};

export const getRemoteFileType = (type: string): string => {
  let mimeType = 'application/octet-stream';
  if (type === 'image') {
    mimeType = 'image/jpeg';
  } else if (type === 'pdf') {
    mimeType = 'application/pdf';
  } else if (type === 'docx') {
    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return mimeType;
};

export const formatCurrency = (value?: string | number): string => {
  if (!value) {
    return '';
  }
  return formatToVND(+value.toString().replaceAll('.', '').replaceAll(',', '.'), {
    showSymbol: false,
  });
};

export const getLocaleDurationDisplay = (durationDisplay: string): string => {
  return durationDisplay
    .replace(/day(s?)/, 'ngày')
    .replace(/hour(s?)/, 'giờ')
    .replace(/minute(s?)/, 'phút');
};

export const timeToHours = (time: string): number => {
  if (time.includes('ngày')) {
    const days = parseFloat(time.replace('ngày', '').trim());
    return days * 8;
  }

  const [hours, minutes] = time.replace('giờ', '').trim().split(':').map(Number);
  return (hours ?? 0) + (minutes ?? 0) / 60;
};

export const isCodeShowLeaveHours = (code: string) =>
  ['nb', 'kl'].includes(code?.toLowerCase() ?? '--');

export const cleanNumberString = (value: string): string => {
  let mValue = value.replace(',', '.').replace(/[^0-9.]/g, '');
  if (mValue.split('.').length > 2) {
    const parts = mValue.split('.');
    mValue = parts[0] + '.' + parts.slice(1).join('');
  }

  return mValue;
};

export const string2Number = (value: string | number | undefined): number | undefined => {
  if (value === undefined) {
    return undefined;
  }
  const num = parseFloat(value.toString().replaceAll('.', ''));
  return isNaN(num) ? undefined : num;
};

export const index2Roman = (index: number): string => {
  const romanNumerals = [
    'I',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
    'XIII',
    'XIV',
    'XV',
    'XVI',
    'XVII',
    'XVIII',
    'XIX',
    'XX',
  ];
  return romanNumerals[index] || '';
};
