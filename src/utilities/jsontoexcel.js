const XLSX = require('xlsx');

function generateXLSX(filename, data) {
	const ws = XLSX.utils.json_to_sheet(data);

	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Random-sheet-name');

	XLSX.writeFile(wb, 'test.xlsx');
}

module.exports = generateXLSX;

if (require.main === module) {
	const jsondata = [
		{ name: 'John', city: 'Seattle' },
		{ name: 'Mike', city: 'Los Angeles' },
		{ name: 'Zach', city: 'New York' }
	];
	generateXLSX('test.xlxs', jsondata);
}
