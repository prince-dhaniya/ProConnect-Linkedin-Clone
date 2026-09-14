import axios from "axios";

export const BASE_URL = "https://proconnect-linkedin-clone-2.onrender.com";

export const clientServer = axios.create({
    baseURL: BASE_URL,
});