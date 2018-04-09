import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http'
import MockAdapter from 'axios-mock-adapter';

const host = 'http://localhost';

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);


// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onGet('/api/todo/get').reply(200,
    [
        {
            "id": 50,
            "title": "asdas",
            "isCompleted": true,
            "end": "2018-04-04T23:30:59+00:00",
            "modify_date": "2018-04-08T21:06:35+00:00",
            "start": "2018-04-04T00:00:00+00:00"
        },
        {
            "id": 51,
            "title": "test1",
            "isCompleted": true,
            "end": "2018-04-04T02:30:00+00:00",
            "modify_date": "2018-04-08T21:06:59+00:00",
            "start": "2018-04-04T02:00:00+00:00"
        },
        {
            "id": 52,
            "title": "test2",
            "isCompleted": false,
            "end": "2018-04-08T00:00:00+00:00",
            "modify_date": "2018-04-08T21:08:14+00:00",
            "start": "2018-04-06T00:00:00+00:00"
        },
        {
            "id": 53,
            "title": "Test3",
            "isCompleted": false,
            "end": "2018-04-03T00:00:00+00:00",
            "modify_date": "2018-04-08T21:12:20+00:00",
            "start": "2018-04-02T00:00:00+00:00"
        },
        {
            "id": 54,
            "title": "Test4",
            "isCompleted": false,
            "end": "2018-04-05T07:00:00+00:00",
            "modify_date": "2018-04-08T21:15:22+00:00",
            "start": "2018-04-05T02:00:00+00:00"
        },
        {
            "id": 55,
            "title": "Test5",
            "isCompleted": false,
            "end": "2018-04-06T06:00:00+00:00",
            "modify_date": "2018-04-08T21:15:43+00:00",
            "start": "2018-04-06T01:00:00+00:00"
        },
        {
            "id": 56,
            "title": "Test6",
            "isCompleted": false,
            "end": "2018-04-07T06:00",
            "modify_date": "2018-04-08T21:18:13+00:00",
            "start": "2018-04-07T02:00"
        }
    ], {'Access-Control-Allow-Origin': '*'}
);

mock.onGet('/\\//api/todo/toggle/\\/\\d+/').reply(200, {}, {'Access-Control-Allow-Origin': '*'});


it('renders without crashing', () => {
    let ref;
    const div = document.createElement('div');
    let app = ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});


it('should get without error', function (done) {
     axios.get('/api/todo/get').then(res => {return done()})
});
