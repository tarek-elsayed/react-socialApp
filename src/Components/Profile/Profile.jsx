import React from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaBirthdayCake,
  FaImage,
  FaGenderless,
} from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import CardPost from "../CardPost/CardPost";

const API_URL = "https://route-posts.routemisr.com";

function getImageUrl(image) {
  if (!image) return null;

  if (Array.isArray(image)) {
    return getImageUrl(image[0]);
  }

  if (typeof image === "object") {
    return getImageUrl(image.url || image.path || image.secure_url);
  }

  if (image.startsWith("http")) return image;

  return `${API_URL}/${image.replace(/^\/+/, "")}`;
}

async function getProfileData() {
  return await axios.get(`${API_URL}/users/profile-data`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export default function Profile() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["profileData"],
    queryFn:getProfileData,
    select: (data) => data?.data?.data.user,
    
    
  });
  console.log(data);
  const user = data || {};
  console.log(user);
  


const fullName =
  user.name ||
  user.username ||
  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
  "User";

const profileImage = getImageUrl(
  user.photo || user.avatar || user.profilePhoto || user.image,
);

const coverImage = getImageUrl(
  user.coverPhoto || user.coverImage || user.cover,
);

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
  async function getUserPosts() {
    debugger;
    return await axios.get(`${API_URL}/users/${user.id}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const {
    data: userPosts,
    isPending: userPostsPending,
    isError: userPostsError,
  } = useQuery({
    queryFn: getUserPosts,
    select: (userPosts) => userPosts?.data?.data?.posts,
  });

  console.log(userPosts);


  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <VscLoading className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto mt-8 max-w-3xl rounded-lg bg-red-50 p-5 text-center text-red-600">
        Failed to load profile data.
      </div>
    );
  }

  return (
    <main className="min-h-screen  pb-10">
      <section className="mx-auto max-w-6xl">
        {/* Cover and profile header */}
        <div className="overflow-hidden rounded-b-xl bg-white shadow-sm">
          <div className="relative h-56 bg-gradient-to-r from-blue-500 to-indigo-600 md:h-80">
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            )}

            <button
              type="button"
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow"
            >
              <FaCamera />
              Edit cover photo
            </button>
          </div>

          <div className="relative px-5 pb-5 md:px-8">
            <div className="-mt-16 flex flex-col items-center gap-4 md:-mt-20 md:flex-row md:items-end">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow md:h-40 md:w-40">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl font-bold text-gray-400">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {fullName}
                </h1>

                {user?.username && (
                  <p className="mt-1 text-gray-500">@{user?.username}</p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <p className="mt-2 text-gray-500">
                    {userPosts?.length} {userPosts?.length === 1 ? "post" : "posts"}
                  </p>
                  <p className="mt-2 text-gray-500">
                    {user?.followersCount}{" "}
                    {user?.followersCount.length === 1
                      ? "follower"
                      : "followers"}
                  </p>
                  <p className="mt-2 text-gray-500">
                    {user?.followingCount}{" "}
                    {user?.followingCount.length === 1
                      ? "following"
                      : "following"}
                  </p>
                  <p className="mt-2 text-gray-500">
                    {user?.bookmarksCount}{" "}
                    {user?.bookmarksCount.length === 1
                      ? "bookmark"
                      : "bookmarks"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
              >
                Edit profile
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* About section */}
          <aside className="h-fit rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">InFo</h2>

            {user.bio && (
              <p className="mb-5 text-center text-gray-600">{user.bio}</p>
            )}

            <div className="space-y-4 text-gray-600">
              {(user.work || user.job || user.company) && (
                <div className="flex items-center gap-3">
                  <FaBriefcase className="text-gray-400" />
                  <span>
                    Works at{" "}
                    <strong className="text-gray-800">
                      {user.work || user.job || user.company}
                    </strong>
                  </span>
                </div>
              )}

              {(user.education || user.school) && (
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-gray-400" />
                  <span>
                    Studied at{" "}
                    <strong className="text-gray-800">
                      {user.education || user.school}
                    </strong>
                  </span>
                </div>
              )}

              {user.location && (
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>
                    Lives in{" "}
                    <strong className="text-gray-800">
                      {typeof user.location === "object"
                        ? user.location.name
                        : user.location}
                    </strong>
                  </span>
                </div>
              )}

              {user.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <FaBirthdayCake className="text-gray-400" />
                  <span>{formatDate(user.dateOfBirth)}</span>
                </div>
              )}
              {user.gender && (
                <div className="flex items-center gap-3">
                  <FaGenderless className="text-gray-400" />
                  <span>{user.gender.toUpperCase()}</span>
                </div>
              )}
            </div>
          </aside>

          {/* Posts section */}
          <section className="space-y-5 lg:col-span-2">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Posts</h2>
            </div>

            {userPosts?.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                No posts yet.
              </div>
            ) : (
              userPosts?.map((post) => {
                return <CardPost post={post} />;
              })
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
