import axios from "axios";

 export const getAllPosts = async () => {
  try {
    const {data} = await axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });

    // console.log(data.data.posts);
    return data.data.posts
  } catch (error) {
    console.log(error);
    
  }
};
