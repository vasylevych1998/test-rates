import React from 'react';
import { connect } from 'react-redux';
import { Card, Button } from 'react-bootstrap';

import { calculateResult, convertDuration } from '../helpers';

const Result = (props) => {
    const { resultAmount, resultCurrency, resultDuration, resultRate } = props;
    if (!resultRate.id || !resultAmount || !resultCurrency || !resultDuration) {
        props.history.push('/rates')
    }
    const result = calculateResult(resultAmount, resultDuration, resultRate);

    return (
      <React.Fragment>
          <Button className="mt-2" variant="primary" onClick={() => props.history.push('/rates')}>
              Назад к выбору параметров
          </Button>
          <Card className="text-center mt-2">
              <Card.Body>
                  <Card.Title>Выбранные параметры</Card.Title>
                  <Card.Text>
                      Сумма: {resultAmount}
                  </Card.Text>
                  <Card.Text>
                      Валюта: {resultCurrency}
                  </Card.Text>
                  <Card.Text>
                      Длительность: {convertDuration(resultDuration)}
                  </Card.Text>
              </Card.Body>
          </Card>
          <Card className="text-center mt-2">
              <Card.Body>
                  <Card.Title>Результаты расчетов</Card.Title>
                  <Card.Text>
                      Ставка по кредиту: {resultRate.percentRate} %
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
      </React.Fragment>
    );
};

export default connect(
    ({ ratesReducer: { resultAmount, resultCurrency, resultDuration, resultRate } }) => ({
        resultAmount,
        resultCurrency,
        resultDuration,
        resultRate
    })
)(Result);
