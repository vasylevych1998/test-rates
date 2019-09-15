import axios from 'axios';

export default {
  fetchRates: () => axios({ method: 'get', url: '/data.json' }).then(response => response.data.rates)
};

