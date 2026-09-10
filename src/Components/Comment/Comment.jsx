import dayjs from "dayjs";
import React from "react";
import relativeTime from "dayjs/plugin/relativeTime"

export default function Comment({ comment:{content, commentCreator:{name ,photo}, createdAt} ,image }) {
    dayjs.extend(relativeTime);
 
 
    return (
    <>
      <div className="flex gap-3 items-center border-2 border-gray-200 rounded-md p-2">
        <div className={image ? "w-[12%]":""}>
          <img className="w-10 rounded-full h-10" src={photo} />
        </div>
        <div className="">
          <h3 className="font-medium">{name}</h3>
          <h4 className="">{dayjs(createdAt).fromNow()}</h4>
          <h5>{content}</h5>
          {image && <img src={image}  className="w-[20%] p-2"/>}
        </div>

      </div>
    </>
  );
}
