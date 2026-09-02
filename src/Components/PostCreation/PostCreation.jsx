import { Avatar, Modal, Button } from "@heroui/react";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { UserContext } from "../../Context/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function PostCreation() {
  const [isOpen, setisOpen] = useState(false);
  const [isUploaded, setisUploaded] = useState(false);
  const { userToken } = useContext(UserContext);

  const body = useRef(null);
  const image = useRef(null);

  function preparedData() {
    const formData = new FormData();
    if(body?.current?.value){
      formData.append("body", body?.current.value);
    }
    if(image?.current?.files[0]){
      formData.append("image", image?.current?.files[0]);
    }
    console.log(body?.current.value);
    console.log(image?.current?.files[0]);
    console.log(formData);
    console.log(formData)
    mutate(formData);
  }
  function handleImage(e) {
    const imgPath = URL.createObjectURL(e?.target?.files[0]);
    setisUploaded(imgPath);
  }

  const queryClient = useQueryClient();

  function createPost(formData) {
    console.log(userToken)
    return axios.post(
      `https://route-posts.routemisr.com/posts`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  }

  const { data, isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
      toast.success("Post Created");

        body.current.value = "";
        image.current.value = "";
        setisUploaded(false)
        setisOpen(false);
    },
    onError: () => {
      toast.error("Post Not Created");
    },
  });
  return (
    <>
      <div className="bg-slate-700 w-140 mx-auto p-4 rounded-2xl bg">
        <div className="flex gap-2 items-center p-4 ">
          <Avatar>
            <Avatar.Image
              alt="John Doe"
              src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
            />
            <Avatar.Fallback>JD</Avatar.Fallback>
          </Avatar>

          <input
            readOnly
            type="text"
            className="w-full p-4 cursor-pointer"
            placeholder="what's on your mind.. ?"
            onClick={() => {
              setisOpen(true);
            }}
          />
        </div>
        <div className="modal ">
          <Modal isOpen={isOpen} onOpenChange={setisOpen}>
            {/* <Button variant="secondary">Open Modal</Button> */}
            <Modal.Backdrop>
              <Modal.Container>
                <Modal.Dialog className="sm:max-w-[90] bg-slate-500">
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <Modal.Heading>Create Your Post</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <textarea
                      ref={body}
                      className="w-full bg-slate-200 p-4 rounded-2xl"
                      placeholder="Create Post"
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
                        ref={image}
                        type="file"
                        hidden
                        onChange={handleImage}
                      />
                    </label>
                    <Button
                      className=""
                      isDisabled={isPending}
                      onClick={() => {
                        preparedData();
                        console.log("first");
                      }}
                    >
                      {isPending ? "Posting..." : "Post"}
                    </Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        </div>
      </div>
    </>
  );
}
