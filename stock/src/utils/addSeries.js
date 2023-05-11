export const addSeries = (series, newStock) => {
	// console.log("HIT?",series,"|||",newStock);
	if(!newStock.dataset){
		series.push({name: '', data: ''});
	} else {
		let lastStock = series[series.length - 1];
		console.log("newStock",newStock.dataset);
		series.push({
			name: newStock.dataset.dataset_code,
			data: newStock.dataset.data.map( d => [ new Date(d[0]).getTime(), d[4] ] ),
			_colorIndex: lastStock ? lastStock._colorIndex + 1 : 0,
			_symbolIndex: lastStock ? lastStock._symbolIndex + 1 : 0
		});		
	};
};

export const findStockIndex = (array, fieldName, stock) => (
	array.findIndex(s => s[fieldName] === stock.code)
)
