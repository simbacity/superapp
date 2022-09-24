import { MessageResponse } from "@app-store/apps/town-square/api-contracts/message.schema";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

interface MessageParam {
  values: MessageResponse & { replyCount: number };
}

export default function Message({ values }: MessageParam) {
  const [deleteButton, showDeleteButton] = useState<boolean>(false);

  return (
    <Link href={"/apps/town-square"}>
      <a
        key={values.id}
        className="group flex sm:w-full md:w-3/4 my-2 p-2 hover:bg-gray-700"
        onMouseLeave={() => showDeleteButton(false)}>
        <img
          src={values.user.image || `/default.png`}
          className="w-8 h-8 rounded-[16px] border border-white m-1"
        />
        <div className="w-full">
          <div className="flex mt-1 justify-between">
            <div className="flex items-end">
              <p className="text-white text-xs font-bold">{values.user.name}</p>
              <p className="text-[10px] text-gray-400 ml-2">{dayjs(values.createdAt).format("DD-MM-YYYY")}</p>
            </div>
            <div className="relative">
              <DotsHorizontalIcon
                className="w-4 h-4 text-white hidden group-hover:block hover:bg-gray-200 hover:text-black group"
                onClick={() => showDeleteButton(true)}
              />
              {deleteButton && (
                <div className="bg-white text-[12px] absolute top-4 right-0  px-3">Delete</div>
              )}
            </div>
          </div>
          <p className="text-white text-sm mt-1">{values.content}</p>
          {!!values.replyCount && <p className="text-[10px] text-blue-300">{values.replyCount} Replies</p>}
        </div>
      </a>
    </Link>
  );
}
