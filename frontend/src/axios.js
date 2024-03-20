import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://" + process.env.REACT_APP_BACKEND_HOSTNAME + ":8000",
    headers: {
        "Content-Type": "application/json"
    },
    proxy: false
})

export { client }