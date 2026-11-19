export function isValidDateOnly(value: unknown): value is string {
    if (typeof value !== 'string') return false;

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
        !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
}