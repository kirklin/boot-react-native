import type { AxiosError } from "axios";
import type { Post } from "~/api";

import { createMutation } from "react-query-kit";
import { client } from "~/api";

interface Variables {
  title: string;
  body: string;
  userId: number;
}
type Response = Post;

export const useAddPost = createMutation<Response, Variables, AxiosError>({
  mutationFn: async variables =>
    client({
      url: "posts/add",
      method: "POST",
      data: variables,
    }).then(response => response.data),
});
