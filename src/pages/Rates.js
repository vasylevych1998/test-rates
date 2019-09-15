import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Spinner, Table, Form, Col, Button, Card} from 'react-bootstrap';
import classNames from 'classnames'

import { onRatesFetch, onUpdateResult } from '../reducers/ratesReducer';
import { calculateResult, convertDuration } from '../helpers';

import './Rates.scss'

class Rates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredRates: [],
      selectedRate: localStorage.getItem('selectedRate') ? JSON.parse(localStorage.getItem('selectedRate')) : {},
      amount: localStorage.getItem('amount') || '',
      currency: localStorage.getItem('currency') || '',
      duration: localStorage.getItem('duration') || '',
      durationRange: [],
      uniqCurrencies: []
    }
  }

  componentDidMount() {
    this.props.loadRates();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.rates.length) {
      this.updateFilteredRates(nextProps.rates);
      this.updateUniqCurrencies(nextProps.rates);
      this.updateDurationRange(nextProps.rates);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { amount, currency, duration, selectedRate } = this.state;
    this.props.updateResult({
      resultAmount: amount,
      resultCurrency: currency,
      resultDuration: duration,
      resultRate: selectedRate
    });
    this.props.history.push('/result');
  };

  handleChange = ({ target: { name, value } }) => {
    localStorage.setItem(name, value);
    this.setState({ [name]: value });
    this.updateFilteredRates(this.props.rates, name, value);
  };

  updateFilteredRates = (rates, name, value) => {
    const { amount, currency, duration, selectedRate } = this.state;
    const filters = { amount, currency, duration };
    if (name) {
      filters[name] = value;
    }

    const filteredRates = rates.filter(rate =>
      this.checkField(filters.amount, (filters.amount >= rate.minAmount && filters.amount <= rate.maxAmount))
      && this.checkField(filters.currency, (filters.currency === rate.currency))
      && this.checkField(filters.duration, (filters.duration >= rate.minDurationInMonths && filters.duration <= rate.maxDurationInMonths))
    );

    const isRateIncluded = filteredRates.find(rate => rate.id === selectedRate.id);

    localStorage.setItem('selectedRate', JSON.stringify(selectedRate));
    this.setState({ filteredRates, selectedRate: isRateIncluded ? selectedRate : {} });
  };

  checkField = (fieldValue, condition) => fieldValue ? condition : true;

  updateDurationRange = rates => {
    let min = rates[0].minDurationInMonths;
    let max = rates[0].maxDurationInMonths;

    for (let i = 1; i < rates.length; i++) {
      if (rates[i].maxDurationInMonths > max) {
        max = rates[i].maxDurationInMonths;
      }
      if (rates[i].minDurationInMonths < min) {
        min = rates[i].minDurationInMonths;
      }
    }

    const durationRange = [];
    for (let i = min; i <= max; i++) {
      if (i % 3 === 0) {
        durationRange.push(i);
      }
    }

    this.setState({ durationRange });
  };

  updateUniqCurrencies = rates => {
    const uniqCurrencies = [];
    rates.forEach(rate => {
      const isAdded = uniqCurrencies.find(currency => currency === rate.currency);
      if (!isAdded) {
        uniqCurrencies.push(rate.currency)
      }
    });
    this.setState({ uniqCurrencies })
  };

  chooseRate = rate => {
    localStorage.setItem('selectedRate', JSON.stringify(rate));
    this.setState({ selectedRate: rate });
  };

  render() {
    const { loading, error } = this.props;
    const { filteredRates, selectedRate, amount, currency, duration, durationRange, uniqCurrencies } = this.state;

    if (error) {
      return <div>{ error }</div>;
    }

    let result;
    if (amount && duration && selectedRate.id) {
      result = calculateResult(amount, duration, selectedRate);
    }

    return (
      <div className="home">
        {loading && <div className="spinner"><Spinner animation="border" variant="primary" /></div>}
        {!loading && (
          <Form onSubmit={this.handleSubmit}>
            <Form.Row>
              <Col md={6} className="mt-4 mb-5">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Сумма</Form.Label>
                  <Form.Control type="number" placeholder="Введите сумму" name="amount" value={amount} onChange={this.handleChange} />
                </Form.Group>
                <Form.Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Валюта</Form.Label>
                    <Form.Control defaultValue={currency} as="select" name="currency" onChange={this.handleChange}>
                      <option value="">Выберите валюту</option>
                      {uniqCurrencies.map(currencyItem =>
                        <option key={currencyItem} value={currencyItem}>{currencyItem}</option>
                      )}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Срок</Form.Label>
                    <Form.Control defaultValue={duration} as="select" name="duration" onChange={this.handleChange}>
                      <option value="">Выберите срок</option>
                      {durationRange.map(durationItem =>
                        <option key={durationItem} value={durationItem}>{convertDuration(durationItem)}</option>
                      )}
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
              </Col>
              <Col md={6}>
                {result && (
                  <Card className="text-center mt-2">
                    <Card.Body>
                      <Card.Title>Результаты расчетов</Card.Title>
                      <Card.Text>
                        Ставка по кредиту: {selectedRate.percentRate} %
                      </Card.Text>
                      <Card.Text>
                        Полная сумма к выплате: {result.fullAmountForPayment}
                      </Card.Text>
                      <Card.Text>
                        Ежемесячный платеж: {result.monthlyPayment}
                      </Card.Text>
                      <Card.Text>
                        Переплата: {result.overPayment}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Form.Row>
            <Form.Row>
              <p>Выберите ставку из списка</p>
              <Table hover>
                <thead>
                <tr>
                  <th>Размер ставки</th>
                  <th>Валюта</th>
                  <th>Сумма от, до</th>
                  <th>Срок от, до</th>
                </tr>
                </thead>
                <tbody>
                {filteredRates.map((rate) => (
                  <tr key={rate.id} className={classNames('table-item', {
                    selected: selectedRate.id === rate.id
                  })} onClick={() => this.chooseRate(rate)}>
                    <td>{rate.percentRate}</td>
                    <td>{rate.currency}</td>
                    <td>{rate.minAmount} - {rate.maxAmount}</td>
                    <td>{convertDuration(rate.minDurationInMonths)} - {convertDuration(rate.maxDurationInMonths)}</td>
                  </tr>
                ))}
                </tbody>
              </Table>

              <Button type="submit" variant="primary" disabled={!selectedRate.id || !amount || !currency || !duration}>Оформить</Button>

            </Form.Row>
          </Form>
        )}
      </div>
    );
  }
}

export default connect(
  ({
     ratesReducer: {
        rates,
        loading,
        error
     }
  }) => ({
    rates,
    loading,
    error,
  }),
  dispatch => ({
    loadRates: () => dispatch(onRatesFetch()),
    updateResult: (result) => dispatch(onUpdateResult(result))
  })
)(Rates);
