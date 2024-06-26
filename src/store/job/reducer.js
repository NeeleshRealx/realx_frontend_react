import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_APPLICATION_LIST,
  GET_JOB_DETAILS
} from "./actionType";

const INIT_STATE = {
  appList: [],
  jobList:[]
};

const Jobs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_APPLICATION_LIST:
          return {
            ...state,
            appList: action.payload.data,
          };
          case GET_JOB_DETAILS:
          return {
            ...state,
            appList: action.payload.data,
          };
        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_APPLICATION_LIST:
          return {
            ...state,
            error: action.payload.error,
          };

        default:
          return { ...state };
      }

    case GET_APPLICATION_LIST: {
      return {
        ...state,
      };
    }

    case GET_JOB_DETAILS: {
      return {
        ...state,
      };
    }

    default:
      return { ...state };
  }
};

export default Jobs;
