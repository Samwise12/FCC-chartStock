import React, { Component } from 'react';
import ReactHighStock from 'react-highcharts/ReactHighstock.src';
import {Form,Input,Button } from 'semantic-ui-react';
import CircularJSON from 'circular-json';
import axios from 'axios';
import { /*List,*/ Dimmer, Loader } from 'semantic-ui-react';

import './App.css';
import chartConfig from './chartConfig.js';
import InlineError from './messages/InlineError';
import { addSeries } from './utils/addSeries';

class App extends Component {
  state = {
    stockName: undefined,
    stockList: [],
    series: [],
    errors: '',
    loading:true
  }
  componentDidMount(){
    axios.get('/api/data/').then(res=>{
      // console.log(res.data.data);
      let stockList = res.data.data;
      const series = this.state.series;
      this.setState({ stockList, loading: true });
      stockList.forEach(stock => {
        axios.get('/api/data/'+ stock.code).then(response=>{
          let x= CircularJSON.parse(response.data.data);
          let stockData = x.data;
          addSeries(series, stockData)
          this.setState({series, loading: false });
        });
      }); //end stockList.forEach
    });// get-inital stocks

  };
  handleSubmit = () => {
    const { stockName } = this.state;
    if (typeof stockName !== 'undefined') {
    axios.post('/api/data/', { stockName }).then(res=> {
      console.log(res.data.err)
      if (res.data.err && res.data.err.message){
      this.setState({errors: res.data.err.message})        
      } else if (res.data.err){
        console.log(typeof res.data.err);
        this.setState({errors: res.data.err});        
      } else {
        //insert
        console.log('asd')
        this.setState({errors: ''});        
      }
    });
    };
  };
  handleChange = e => {this.setState({stockName: e.target.value});}
  render() {
    const { series, errors, loading } = this.state;
    chartConfig.series = series;
    console.log('errors:',errors)
    return (
      <div>
        <div>
          <ReactHighStock config={chartConfig} />
          {/* <Dimmer active={loading}>
                <Loader />
              </Dimmer> */}             
        </div>
        <Form onSubmit={this.handleSubmit}>
          <Input onChange={this.handleChange} 
          type="text"
          placeholder="VIEW STOCK"
          autoFocus />
          <Button type="submit">VIEW STOCK</Button>
          <br/>
          {errors && <InlineError text={errors} /> }
        </Form>
      </div>

    );
  }
}

export default App;
