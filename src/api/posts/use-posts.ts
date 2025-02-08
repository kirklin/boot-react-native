import type { AxiosError } from "axios";
import type { Post } from "./types";

import { createQuery } from "react-query-kit";
import { client } from "../common";

type Response = Post[];
type Variables = void; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const usePosts = createQuery<Response, Variables, AxiosError>({
  queryKey: ["posts"],
  fetcher: async () => {
    const response = await client.get(`posts`);
    return response.data.posts;
  },
});
