import React from 'react';
import { List, Icon } from 'semantic-ui-react';

const StockListItem = ({ stockMeta, removeStockOnClick }) => (
	<List.Item className="stock-list-item-wrap">
		<List.Header as="h3" >{stockMeta.code}</List.Header> 
		<List.Content className="stock-list-item">
			{stockMeta.name.slice(0,-45)}
		</List.Content>
	<Icon className="stock-list-item-remove" name="close" onClick={() => removeStockOnClick(stockMeta._id)} />
	</List.Item>
	);

export default StockListItem;

