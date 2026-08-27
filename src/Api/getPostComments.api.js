import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";

export async function getComments({ id }) {
    
    // const { userToken, setUserToken } = useContext(UserContext);
    // console.log(userToken);
    
  return await axios.get(`https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  });
}
