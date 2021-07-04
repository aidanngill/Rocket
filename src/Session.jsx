import axios from "axios";

import Config from "./Config";

const Instance = axios.create({
  baseURL: Config.apiUrl
});

export default Instance;