import dayjs from "dayjs";
import React, { useState } from "react";
import {
  FaBookmark,
  FaImage,
  FaRegBookmark,
  FaRegCommentAlt,
} from "react-icons/fa";
import { GrLike, GrLikeFill } from "react-icons/gr";
import { LuShare2 } from "react-icons/lu";
import relativeTime from "dayjs/plugin/relativeTime";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Button,
  Dropdown,
  Label,
  Avatar,
  Modal,
  TextField,
  InputGroup,
} from "@heroui/react";

import { MdEdit, MdOutlineDeleteForever } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import { VscLoadingCompact } from "react-icons/vsc";

export default function CardPost({ post }) {
  const userId = localStorage.getItem("userId");
  const userToken = localStorage.getItem("userToken");
  const [isOpen, setisOpen] = useState(false);
  const [isComment, setisComment] = useState(false);

  dayjs.extend(relativeTime);

console.log(post)


  function likePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post.id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  }
  function checkLikedPost() {
    post.likes.find((like) => {
      if (like === post.user._id) {
        return true;
      } else {
        return false;
      }
    });
  }
  function bookMark() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post.id}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  }
  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post.id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  }

  const queryClient = useQueryClient();
  const { data, isPending, mutate } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
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
    mutationKey: ["postBookMark"],
    mutationFn: bookMark,
    onSuccess: () => {
      toast.success("Post BookMarked");
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getPostDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarkedPosts"],
      });
    },
    onError: () => {
      toast.error("Post Not BookMarked");
    },
  });

  const {
    data: deleteData,
    isPending: deletePending,
    mutate: deleteMutate,
  } = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post Deleted");
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getPostDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["userPosts", userId],
      });
    },
    onError: () => {
      toast.error("Post Not Deleted");
    },
  });

  const [body, setbody] = useState("");
  const [image, setimage] = useState(null);
  const [isUploaded, setisUploaded] = useState(false);

  function EditPost() {
    setisOpen(true);

    setbody(post.body || "");
    setimage(post.image || null);
    if (post.image) {
      setisUploaded(post.image);
    }
  }
  function updatePost(formData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  }
  const {
    data: editPostData,
    isPending: editPending,
    mutate: editPostMutate,
  } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Post Updated");
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      setisUploaded(false);
      setisOpen(false);
    },
    onError: () => {
      toast.error("Post Not Updated");
    },
  });

  function preparedData() {
    const formData = new FormData();
    if (body) {
      formData.append("body", body);
    }
    if (image) {
      formData.append("image", image);
    }
    editPostMutate(formData);
  }
  const form = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });
  const { register, handleSubmit, reset, watch } = form;
  const commentValues = watch("content");
  function createComment() {
    axios.post(
      `https://route-posts.routemisr.com/posts/${post.id}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const formData = new FormData();
  function handleComment(values) {
    if (values.content) {
      formData.append("content", values.content);
    }
    if (values.image) {
      formData.append("image", values.image[0]);
    }
    mutateComment();
  }

  const {
    data: comment,
    isPending: pendingComment,
    mutate: mutateComment,
  } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getPostComments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getPostDetails"],
      });
      reset();
    },
    onError: () => {
      console.log("error");
    },
    onSettled: () => {
      console.log("ok");
    },
  });

  return (
    <>
      <div className="w-[80%]">
        <div className="card bg-base-100 w-[80%] mx-auto shadow-sm border-4 border-gray-200 mt-5">
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
            <Dropdown>
              <Button
                className="cursor-pointer text-2xl"
                aria-label="Menu"
                variant="secondary"
              >
                <BsThreeDotsVertical />
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Item id="bookmark" textValue="New file">
                    <div
                      onClick={() => {
                        bo2();
                      }}
                      className=" w-full flex items-center justify-between text-black"
                    >
                      <Label>Bookmark Post </Label>
                      {post.bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>

                {userId === post.user._id && (
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => EditPost()}
                      id="editPost"
                      textValue="Edit Post"
                    >
                      <div className=" w-full flex items-center justify-between">
                        <Label>Edit Post </Label>
                        <MdEdit className="text-black text-2xl" />
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                )}

                {userId === post.user._id && (
                  <Dropdown.Menu>
                    <Dropdown.Item id="deletePost" textValue="Delete Post">
                      <div
                        className=" w-full flex items-center justify-between"
                        onClick={() => {
                          deleteMutate();
                        }}
                      >
                        <Label className="text-red-400">Delete Post </Label>
                        <MdOutlineDeleteForever className="text-red-400 text-2xl" />
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                )}
              </Dropdown.Popover>
            </Dropdown>
          </div>

          <Link to={`/postDetails/${post?.id}`}>
            <div className="card-body">
              <h2 className="card-title">
                {post.body}
                <div className="badge badge-secondary">{post.privacy}</div>
              </h2>
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
              {post.likes.length > 0 && checkLikedPost() ? (
                <GrLikeFill className="text-blue-500 " />
              ) : (
                <GrLike />
              )}
              <p>{post.likesCount}</p>
            </div>

            <div
              className="flex gap-2 items-center  transition-all p-3 rounded-md cursor-pointer"
              onClick={() => {
                setisComment(true);
              }}
            >
              <FaRegCommentAlt />
              <p>{post.commentsCount}</p>
            </div>
            <div className="flex gap-2 items-center  transition-all p-3 rounded-md cursor-pointer">
              <LuShare2 />
              <p>{post.sharesCount}</p>
            </div>
          </div>

          <div className="modal ">
            <Modal isOpen={isOpen} onOpenChange={setisOpen}>
              {/* <Button variant="secondary">Open Modal</Button> */}
              <Modal.Backdrop>
                <Modal.Container>
                  <Modal.Dialog className="sm:max-w-[90] bg-slate-500">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                      <Modal.Heading>Edit Your Post</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                      <textarea
                        className="w-full bg-slate-200 p-4 rounded-2xl"
                        placeholder="Edit Your Post"
                        value={body}
                        onChange={(e) => setbody(e.target.value)}
                      ></textarea>
                      {isUploaded && (
                        <div className="relative">
                          <img
                            alt="Cherries"
                            className="pointer-events-none "
                            loading="lazy"
                            src={isUploaded}
                          />
                          <IoIosCloseCircle
                            onClick={() => {
                              setisUploaded(false);
                              image.current.value = "";
                            }}
                            className="absolute inset-2 text-3xl cursor-pointer"
                          />
                        </div>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <label>
                        <FaImage className="text-4xl cursor-pointer me-4" />
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            setimage(e.target.files[0]);
                            setisUploaded(
                              URL.createObjectURL(e.target.files[0]),
                            );
                          }}
                        />
                      </label>
                      <Button
                        className=""
                        isDisabled={isPending}
                        onClick={() => {
                          preparedData();
                        }}
                      >
                        {isPending ? "Editing..." : "Edit Post"}
                      </Button>
                    </Modal.Footer>
                  </Modal.Dialog>
                </Modal.Container>
              </Modal.Backdrop>
            </Modal>
          </div>

          {post.topComment && <Comment comment={post.topComment} />}

          {isComment && (
            <div className="flex gap-3 items-center border-2 border-gray-200 rounded-md p-2">
              <form className="w-full" onSubmit={handleSubmit(handleComment)}>
                <TextField className="w-full " name="text" aria-label="comment">
                  <InputGroup>
                    <InputGroup.Input
                      {...register("content")}
                      className="w-full"
                      placeholder="Write a comment"
                    />
                    <label htmlFor="image">
                      <FaImage className="size-4 top text-gray-600 mx-2 cursor-pointer" />
                    </label>
                    <input
                      {...register("image")}
                      id="image"
                      type="file"
                      hidden
                    />
                    <InputGroup.Suffix>
                      <button
                        type="submit"
                        disabled={!commentValues || pendingComment}
                        className={pendingComment ? "cursor-not-allowed" : ""}
                      >
                        {pendingComment ? (
                          <VscLoadingCompact className="animate-spin" />
                        ) : (
                          <IoSend
                            className={
                              !commentValues
                                ? "text-muted size-4 cursor-pointer"
                                : "size-4 text-blue-500 cursor-pointer"
                            }
                          />
                        )}
                      </button>
                    </InputGroup.Suffix>
                  </InputGroup>
                </TextField>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
