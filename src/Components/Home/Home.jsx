import React, { useState } from "react";
import { useEffect } from "react";
import { getAllPosts } from "../../Api/getAllPosts.api";
import CardPost from "../CardPost/CardPost";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../PostCreation/PostCreation";

export default function Home() {
  const [allPostsList, setAllPostsList] = useState([]);
  const [apiError, setApiError] = useState("");

  const { data, isError, isLoading, isFetching, error } = useQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPosts,
  });

  if (isError) {
    return (
      <div className=" min-h-screen ">
        <div
          role="alert"
          className="alert alert-error flex items-center justify-center"
        >
          <span>{apiError}</span>
        </div>
      </div>
    );
  }
  return (
    <>
      <PostCreation />
      <div className="container w-[80%] m-auto">
        {isLoading ? (
          <Loader />
        ) : (
          data?.map((post) => (
            <div key={post.id} className="flex flex-col items-center">
              <CardPost post={post} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
