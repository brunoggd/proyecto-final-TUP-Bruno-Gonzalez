export function isValidTime(value: unknown): value is string {
    if (typeof value !== 'string') return false;

    const parts = value.split(':');

    if (parts.length !== 2 && parts.length !== 3) return false;

    const [hours, minutes, seconds = '0'] = parts;
    const h = Number(hours);
    const m = Number(minutes);
    const s = Number(seconds);

    return (
        Number.isInteger(h) && h >= 0 && h <= 23 &&
        Number.isInteger(m) && m >= 0 && m <= 59 &&
        Number.isInteger(s) && s >= 0 && s <= 59
    );
}