import dayjs from "dayjs";
import React from "react";
import { FaRegCommentAlt } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { LuShare2 } from "react-icons/lu";
import relativeTime from "dayjs/plugin/relativeTime";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";

export default function CardPost({ post }) {
  dayjs.extend(relativeTime);
  return (
    <>
      <div className="">
        <div className="card bg-base-100 w-[80%] mx-auto shadow-sm border-4 border-gray-200 mt-2.5">
          <div className="flex gap-3 items-center">
            <div className="">
              <img className="w-10 rounded-full h-10" src={post.user.photo} />
            </div>
            <div className="">
              <h3 className="font-medium">{post.user.name}</h3>
              <h4>{dayjs(post.createdAt).fromNow()}</h4>
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
            <div className="flex gap-2 items-center hover:bg-gray-100 transition-all p-3 rounded-md cursor-pointer">
              <GrLike />
              <p>{post.likesCount}</p>
            </div>

            <div className="flex gap-2 items-center hover:bg-gray-100 transition-all p-3 rounded-md cursor-pointer">
              <FaRegCommentAlt />
              <p>{post.commentsCount}</p>
            </div>
            <div className="flex gap-2 items-center hover:bg-gray-100 transition-all p-3 rounded-md cursor-pointer">
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
