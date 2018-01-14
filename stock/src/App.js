import React, { Component } from 'react';
import ReactHighStock from 'react-highcharts/ReactHighstock.src';
import {Form,Input,Button } from 'semantic-ui-react';
import CircularJSON from 'circular-json';
import axios from 'axios';
import io from 'socket.io-client';
import { List, Dimmer, Loader } from 'semantic-ui-react';

import './App.css';
import chartConfig from './chartConfig.js';
import InlineError from './messages/InlineError';
import { addSeries, findStockIndex } from './utils/addSeries';
import StockListItem from './StockListItem';

class App extends Component {
  state = {
    stockName: undefined,
    stockList: [],
    series: [],
    errors: '',
    loading:true
  }
  componentDidMount(){
    const socket = io('localhost:8080', {
      path: '/stockchart'
    });
    socket.on('stock:save', stock=> {
      let stockList = this.state.stockList.slice();
      let series = this.state.series.slice();
      // stockList.push(stock);
      this.setState({ stockList, loading: true });
        stockList.push(stock);
        axios.get('/api/data/'+ stock.code)
          .then(results=> {          
            // console.log(results);
          let x= CircularJSON.parse(results.data.data);
          let stockData = x.data;
          addSeries(series, stockData)
          this.setState({series, loading: false });        
        });
    });
    socket.on('stock:remove', stock => {
        let { stockList, series } = this.state;
        let stockListIndex = findStockIndex(stockList, 'code', stock);
        let seriesIndex = findStockIndex(series, 'name', stock);
        stockList = [...stockList.slice(0, stockListIndex), ...stockList.slice(stockListIndex + 1)];
        series = [...series.slice(0, seriesIndex), ...series.slice(seriesIndex + 1)];
        this.setState({ stockList, series, errors: '' });
      });
    ///////sockets^
    axios.get('/api/data/').then(res=>{
      // console.log(res.data.data);
      let stockList = res.data.data;
      const series = this.state.series;
      let promises= [];
      this.setState({ stockList, loading: true });
      stockList.forEach(stock => {
        promises.push(axios.get('/api/data/'+ stock.code) );
      }); //end stockList.forEach
      axios.all(promises)
        .then(results=> {
          results.forEach(response=> {
          let x= CircularJSON.parse(response.data.data);
          let stockData = x.data;
          addSeries(series, stockData)
          this.setState({series, loading: false });
          })
        });
    });// get-inital stocks
  };
  handleSubmit = () => {
    const { stockName } = this.state;
    console.log(this.state.stockList.length)
    if (this.state.stockList.length<5) {
      if (typeof stockName !== 'undefined') {
      axios.post('/api/data/', { stockName }).then(res=> {
        // console.log(res.data.err)
        if (res.data.err && res.data.err.message){
        this.setState({errors: res.data.err.message})        
        } else if (res.data.err){
          // console.log(typeof res.data.err);
          this.setState({errors: res.data.err});        
        } else {
          //insert
          console.log('asd')
          this.setState({errors: ''});        
        }
      });
      };      
    } else {
      this.setState({errors: 'Can\'t display more than 5 stocks at a time.'})
    };
  };
  handleChange = e => {this.setState({stockName: e.target.value});}
  displayStocks = () => {
    let { stockList } = this.state;
    return stockList.map( stock => {
      // console.log(stock);
          return(  <StockListItem
                        key={stock.code}
                        stockMeta={stock}
                        removeStockOnClick={this.removeStockOnClick}
                      />)}
      )
  };
  removeStockOnClick = stockDBId => {
    axios.delete('/api/data/'+ stockDBId);
    // removeStock(stockDBId);
  };  
  render() {
    const { series, errors, loading } = this.state;
    chartConfig.series = series;
    // console.log('state:',this.state);
    return (
      <div className="chart-page-root">
        <div className="chart-wrap">
          <ReactHighStock config={chartConfig} />
          { <Dimmer active={loading}>
                <Loader />
                Loading
              </Dimmer> }             
        </div>
        <Form className="input-background-black" onSubmit={this.handleSubmit}>
          <Input onChange={this.handleChange} 
          type="text"
          placeholder="VIEW STOCK"
          autoFocus />
          <Button type="submit">VIEW STOCK</Button>
          <br/>
          {errors && <InlineError text={errors} /> }
        </Form>
        {
          <div className="chart-page-stocks">
          <h1>Stock List</h1>
          <List divided inverted relaxed className="stock-list">
            { this.displayStocks() }
          </List>
          </div>
        }
      </div>

    );
  }
}

export default App;
