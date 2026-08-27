import axios from "axios"


export function getDetails({id}){
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })
}