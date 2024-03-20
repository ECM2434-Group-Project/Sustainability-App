import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "https://" + process.env.REACT_APP_BACKEND_HOSTNAME + "",
    headers: {
        "Content-Type": "application/json"
    },
    proxy: false
})

export { client }