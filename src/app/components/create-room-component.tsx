"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidV4 } from "uuid";

type Props = {};

function CreateRoomComponent({}: Props) {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const createNewRoom = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }
    router.push(`/editor/${roomId}?username=${username}`);
  };
  return (
    <div className="inputGroup">
      <input
        type="text"
        className="inputBox"
        placeholder="ROOM ID"
        onChange={(e) => setRoomId(e.target.value)}
        value={roomId}
        onKeyUp={handleInputEnter}
      />
      <input
        type="text"
        className="inputBox"
        placeholder="USERNAME"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        onKeyUp={handleInputEnter}
      />
      <button className="btn joinBtn" onClick={joinRoom}>
        Join
      </button>
      <span className="createInfo">
        If you don&apos;t have an invite then create &nbsp;
        <button onClick={createNewRoom} className="createNewBtn">
          new room
        </button>
      </span>
    </div>
  );
}

export default CreateRoomComponent;
