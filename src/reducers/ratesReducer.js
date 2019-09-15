import { takeLatest, put, call } from 'redux-saga/effects';

import api from '../api';

const LOAD_RATES = 'LOAD_RATES';
const LOAD_RATES_SUCCESS = 'LOAD_RATES_SUCCESS';
const LOAD_RATES_FAILURE = 'LOAD_RATES_FAILURE';

const UPDATE_RESULT = 'UPDATE_RESULT';

const initialState = {
  rates: [],
  error: null,
  loading: false,
  resultAmount: null,
  resultCurrency: null,
  resultDuration: null,
  resultRate: {}
};

export function ratesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_RATES:
      return {
        ...state,
        loading: true,
        error: null
      };

    case LOAD_RATES_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      };

    case LOAD_RATES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case UPDATE_RESULT:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

export function* fetchRates() {
  const result = yield call(api.fetchRates);
  if (result) {
    yield put({ type: LOAD_RATES_SUCCESS, payload: { rates: result } })
  } else {
    yield put({ type: LOAD_RATES_FAILURE, payload: { error: 'Failed to load rates' } })
  }
}

export function* watchRequest() {
  yield takeLatest(LOAD_RATES, fetchRates);
}

export function onRatesFetch() {
  return {
    type: LOAD_RATES
  };
}

export function onUpdateResult(result) {
  return {
    type: UPDATE_RESULT,
    payload: result
  };
}
