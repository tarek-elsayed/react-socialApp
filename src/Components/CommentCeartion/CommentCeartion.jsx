import React from "react";
import { IoSend } from "react-icons/io5";
import { FaImage } from "react-icons/fa6";
import { InputGroup, Label, TextField } from "@heroui/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Register from "./../../Auth/Register/Register";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VscLoadingCompact } from "react-icons/vsc";
export default function CommentCeartion({ id }) {
  function createComment() {
    axios.post(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const queryClient = useQueryClient();

  const { data, isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getPostComments"],
      });
      queryClient.invalidateQueries({
        queryKey:['getPostDetails']
      })
      reset();
      
    },
    onError: () => {
      console.log("error");
    },
    onSettled: () => {
      console.log("ok");
    },
  });

  const form = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });
  const { register, handleSubmit, reset, watch } = form;
  const commentValues = watch("content");

  const formData = new FormData();
  function handleComment(values) {
    if (values.content) {
      formData.append("content", values.content);
    }
    if (values.image) {
      formData.append("image", values.image[0]);
    }
    mutate();
  }

  return (
    <>
      <div className="flex gap-3 items-center border-2 border-gray-200 rounded-md p-2">
        <form onSubmit={handleSubmit(handleComment)} className="w-full">
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
              <input {...register("image")} id="image" type="file" hidden />
              <InputGroup.Suffix>
                <button
                  type="submit"
                  disabled={!commentValues || isPending}
                  className={isPending ? "cursor-not-allowed" : '' }
                >
                  {isPending ? (
                    <VscLoadingCompact className="animate-spin" />
                  ) : (
                    <IoSend className={!commentValues ? 'text-muted size-4 cursor-pointer':'size-4 text-blue-500 cursor-pointer'} />
                  )}
                </button>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>
        </form>
      </div>
    </>
  );
}
