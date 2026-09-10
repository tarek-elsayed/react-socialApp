import axios from "axios";

const API_URL = "https://route-posts.routemisr.com";

export const getBookmarkedPosts = async () => {
  const { data } = await axios.get(`${API_URL}/users/bookmarks`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });

  return data?.data?.bookmarks || data?.data?.posts || data?.bookmarks || [];
};