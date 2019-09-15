export const calculateResult = (resultAmount, resultDuration, resultRate) => {
  const { percentRate } = resultRate;
  const duration = resultDuration;
  const koef = percentRate / 100 / 12;

  const fullAmountForPayment = resultAmount
    * koef
    * Math.pow((1 + koef), duration)
    / (Math.pow((1 + koef), duration) - 1)
    * duration;
  const monthlyPayment = fullAmountForPayment / duration;
  const overPayment = fullAmountForPayment - resultAmount;

  return {
    fullAmountForPayment: fullAmountForPayment.toFixed(2),
    monthlyPayment: monthlyPayment.toFixed(2),
    overPayment: overPayment.toFixed(2)
  };
};

export const convertDuration = months => months >= 12
  ? `${Math.floor(months / 12)} г. ${months % 12} мес.`
  : `${months} мес.`;
