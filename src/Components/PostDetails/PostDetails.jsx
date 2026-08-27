import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getDetails } from "../../Api/getPostDetails.api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GrLike } from "react-icons/gr";
import { FaRegCommentAlt } from "react-icons/fa";
import { LuShare2 } from "react-icons/lu";
import Loader from "../Loader/Loader";
import { getComments } from "../../Api/getPostComments.api";
import Comment from "../Comment/Comment";
import CommentCeartion from "../CommentCeartion/CommentCeartion";

export default function PostDetails() {
  const { id } = useParams();
  dayjs.extend(relativeTime);

  const { data, isError, isLoading, error, isFetching } = useQuery({
    queryKey: ["getPostDetails", id],
    queryFn: () => getDetails({ id }),
    select: (data) => data?.data?.data?.post,
  });

  const {
    data: comments,
    isError: comments1,
    isLoading: comments2,
    error: comments3,
    isFetching: comments4,
  } = useQuery({
    queryKey: ["getPostComments", id],
    queryFn: () => getComments({ id }),
    select: (comments) => comments?.data?.data?.comments,
  });

  if (isLoading) return <Loader />;
  return (
    <>
      <div className="card bg-base-100 w-[80%] mx-auto shadow-sm border-4 border-gray-200 mt-2.5">
        <div className="flex gap-3 items-center">
          <div className="">
            <img className="w-10 rounded-full h-10" src={data?.user?.photo} />
          </div>
          <div className="">
            <h3 className="font-medium">{data?.user?.name}</h3>
            <h4>{dayjs(data?.createdAt).fromNow()}</h4>
          </div>
        </div>
        <div className="card-body">
          <h2 className="card-title">
            {data?.body}
            <div className="badge badge-secondary">{data?.privacy}</div>
          </h2>
          <p>
            A card component has a figure, a body part, and inside body there
            are title and actions parts
          </p>
          {data?.image && (
            <figure>
              <img className="w-[60%] h-60" src={data?.image} />
            </figure>
          )}
        </div>

        <div className=" flex flex-wrap items-center justify-between">
          <div className="flex gap-2 items-center hover:bg-gray-100 transition-all p-3 rounded-md cursor-pointer">
            <GrLike />
            <p>{data?.likesCount}</p>
          </div>

          <div className="flex gap-2 items-center hover:bg-gray-100 transition-all p-3 rounded-md cursor-pointer">
            <FaRegCommentAlt />
            <p>{data?.commentsCount}</p>
          </div>
          <div className="flex gap-2 items-center hover:bg-gray-100 transition-all p-3 rounded-md cursor-pointer">
            <LuShare2 />
            <p>{data?.sharesCount}</p>
          </div>
        </div>

        <CommentCeartion id={data?.id} /> 

        {comments?.map((comment) => (
          <Comment key={comment?._id} comment={comment} />
        ))}

        {/* {data?.topComment && <Comment comment={data?.topComment} />} */}

      </div>
    </>
  );
}
