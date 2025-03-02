import { interval, from } from "rxjs";
import { switchMap, retryWhen, delay, throttleTime } from "rxjs/operators";

// API URL
const API_URL = "http://147.93.108.7:5000/api/data";

// Poll API every 2 seconds
export const sensorDataStream = interval(2000).pipe(
  switchMap(() => from(fetch(API_URL).then(res => res.json()))), // Fetch API data
  retryWhen(errors => errors.pipe(delay(5000))), // Retry if API fails
  throttleTime(2000) // Ensure UI updates are not too frequent
);
