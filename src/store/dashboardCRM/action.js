import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_BALANCEOVERVIEW_CHARTS_DATA,
  GET_DIALTYPE_CHARTS_DATA,
  GET_SALESFORECAST_CHARTS_DATA
} from "./actionType";

// common success
export const dashboardCrmApiSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const dashboardCrmApiError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Balance Overview charts data
export const getBalanceOverviewChartsData = (balanceOverviewData) => ({
  type: GET_BALANCEOVERVIEW_CHARTS_DATA,
  payload: balanceOverviewData
});

// Dial Type charts data
export const getDialTypeChartsData = (dialTypeData) => ({
  type: GET_DIALTYPE_CHARTS_DATA,
  payload: dialTypeData
});

// Leads source charts data
export const getLeadSourceChartsData = (salesForecastData) => ({
  type: GET_SALESFORECAST_CHARTS_DATA,
  payload: salesForecastData
});

// Leads Revenue charts data
export const getLeadsRevenueChartsData = (salesForecastData) => ({
  type: GET_SALESFORECAST_CHARTS_DATA,
  payload: salesForecastData
});

// Leads Average

export const getLeadsAverageChartsData = (salesForecastData) => ({
  type: GET_SALESFORECAST_CHARTS_DATA,
  payload: salesForecastData
});

// Monthly Sales employee
export const getEmployeeSalesChartsData = (salesForecastData) => ({
  type: GET_SALESFORECAST_CHARTS_DATA,
  payload: salesForecastData
});
