import dayjs from "dayjs";
import React from "react";
import { FaBookmark, FaRegBookmark, FaRegCommentAlt } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { LuShare2 } from "react-icons/lu";
import relativeTime from "dayjs/plugin/relativeTime";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function CardPost({ post }) {
  dayjs.extend(relativeTime);

  function likePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post.id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  function bookMark() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post.id}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const queryClient = useQueryClient();
  const { data, isPending, mutate } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      console.log("liked ");
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getPostDetails"],
      });
    },
  });

  const {
    data: bo,
    isPending: bo1,
    mutate: bo2,
  } = useMutation({
    mutationFn: ["postBookMark"],
    onSuccess: () => {
      toast.success("Post BookMarked");
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getPostDetails"],
      });
    },
    onError: () => {
      toast.error("Post Not BookMarked");
    },
  });

  return (
    <>
      <div className="">
        <div className="card bg-base-100 w-[80%] mx-auto shadow-sm border-4 border-gray-200 mt-2.5">
          <div className="flex gap-3 items-center justify-between">
            <div className="flex gap-3 items-center ">
              <div className="">
                <img className="w-10 rounded-full h-10" src={post.user.photo} />
              </div>
              <div className="">
                <h3 className="font-medium">{post.user.name}</h3>
                <h4>{dayjs(post.createdAt).fromNow()}</h4>
              </div>
            </div>
            <div
              className="text-3xl cursor-pointer"
              onClick={() => {
                bo2();
              }}
            >
              {post.bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </div>
          </div>

          <Link to={`/postDetails/${post?.id}`}>
            <div className="card-body">
              <h2 className="card-title">
                {post.body}
                <div className="badge badge-secondary">{post.privacy}</div>
              </h2>
              <p>
                A card component has a figure, a body part, and inside body
                there are title and actions parts
              </p>
              {/* <div className="card-actions justify-end">
              <div className="badge badge-outline">Fashion</div>
              <div className="badge badge-outline">Products</div>
            </div> */}
              {post.image && (
                <figure>
                  <img className="w-[60%] h-60" src={post.image} />
                </figure>
              )}
            </div>
          </Link>

          <div className=" flex flex-wrap items-center justify-between">
            <div
              onClick={() => {
                mutate();
              }}
              className="flex gap-2 items-center  transition-all p-3 rounded-md cursor-pointer"
            >
              <GrLike />
              <p>{post.likesCount}</p>
            </div>

            <div className="flex gap-2 items-center  transition-all p-3 rounded-md cursor-pointer">
              <FaRegCommentAlt />
              <p>{post.commentsCount}</p>
            </div>
            <div className="flex gap-2 items-center  transition-all p-3 rounded-md cursor-pointer">
              <LuShare2 />
              <p>{post.sharesCount}</p>
            </div>
          </div>

          {post.topComment && <Comment comment={post.topComment} />}
        </div>
      </div>
    </>
  );
}
