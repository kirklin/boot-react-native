import axios from "axios";
import { Env } from "~env";

export const client = axios.create({
  baseURL: Env.API_URL,
});
