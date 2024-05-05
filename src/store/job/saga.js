import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Application Redux States
import { GET_APPLICATION_LIST, GET_JOB_DETAILS } from "./actionType";
import {
  ApplicationApiResponseSuccess,
  ApplicationApiResponseError,
} from "./action";
import axios from "axios";

//Include Both Helper File with needed methods
import { getJobApplicationList as getApplicationListApi } from "../../helpers/fakebackend_helper";

function* getApplicationList() {
  try {
    const response = yield call(getApplicationListApi);

    yield put(ApplicationApiResponseSuccess(GET_APPLICATION_LIST, response));
  } catch (error) {
    yield put(ApplicationApiResponseError(GET_APPLICATION_LIST, error));
  }
}

function* getJobDetails(data) {
  var data = data.payload.data
  try {
    const response = yield call(axios.post,'/api/list-jobs/'+data);
    //const response = "test";
    console.log(response);
    yield put(ApplicationApiResponseSuccess(GET_JOB_DETAILS, response));
  } catch (error) {
    yield put(ApplicationApiResponseError(GET_JOB_DETAILS, error));
  }
}

export function* watchGetApplicationList() {
  yield takeEvery(GET_APPLICATION_LIST, getApplicationList);
}

export function* watchJobDetails() {
  yield takeEvery(GET_JOB_DETAILS, getJobDetails);
}

function* ApplicationSaga() {
  yield all([fork(watchGetApplicationList),
  fork(watchJobDetails)]);

}

export default ApplicationSaga;
