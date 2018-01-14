import express from 'express';
import axios from 'axios';
import CircularJSON from 'circular-json';

import Stock from '../Model';

const router = express.Router();

///// Routes
router.get('/', (req, res)=> {
	Stock.findAsync().then(response=>{
	res.status(200).json({data:response});
	});
});

router.get('/:code', (req,res)=> {
	// console.log(req.params.code)
	let name = req.params.code,
	now = new Date(),
	year = now.getFullYear(),
	month = now.getMonth() + 1,
	date = now.getDate();
	axios({
		method: 'get',
		url: `https://www.quandl.com/api/v3/datasets/WIKI/${name}.json?api_key=QNL1siP-U1MdnPPd3Wx-&order=asc&start_date=${year - 3}-${month}-${date}&end_date=${year}-${month}-${date}`,
		responseType: 'json'				
		})
	.then(response => {
		let x = CircularJSON.stringify(response);
		// console.log(response);
		res.status(200).json({data: x}).end();
	})
	.catch(err => console.log(err));	
});

router.post('/', (req,res)=> { // Add stock
	// console.log(req.body.stockName)
	let name = req.body.stockName,
	now = new Date(),
	year = now.getFullYear(),
	month = now.getMonth() + 1,
	date = now.getDate();	
	if (!name){
		res.status(400).end();
		return;
	};	
	axios({
		method: 'get',
		url: `https://www.quandl.com/api/v3/datasets/WIKI/${name.toUpperCase()}.json?api_key=QNL1siP-U1MdnPPd3Wx-&order=asc&start_date=${year - 3}-${month}-${date}&end_date=${year}-${month}-${date}`,
		responseType: 'json'				
		}).then(response=> {
			Stock.findAsync({code: response.data.dataset.dataset_code})
				.then(stock=> {
					if(stock.length) {
						res.json({err: 'Stock already displayed.'});
					} else {
						Stock.createAsync({
							name:response.data.dataset.name,
							code:response.data.dataset.dataset_code
						})
					res.status(200).json({});					
					};
				});		
		}).catch(err => {
			console.log('ERROR!: ', err.response.data.quandl_error)
			res.status(200).json({err: err.response.data.quandl_error}).end();
	} );

	// res.status(200).json({})
});

router.delete('/:id', (req,res)=> {	
	Stock.findByIdAsync(req.params.id)
		.then(res=> {
				res.removeAsync()
		}
			).then(response=>
			res.status(204).end()			
			).catch(err=> console.log('Error!: ', err));
});

export default router;


