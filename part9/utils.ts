export function isNotNumber(argument: any): boolean {
	return isNaN(Number(argument));
}

export default { isNotNumber };
