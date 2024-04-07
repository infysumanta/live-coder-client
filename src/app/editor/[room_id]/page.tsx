"use client";
import UserAvatar from "@/app/components/user-avatar";
import { EVENTS } from "@/app/lib/constant";
import { initSocket } from "@/app/lib/socket";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

type Props = {};

function EditorPage({}: Props) {
  const socketRef = useRef<Socket | null>(null);
  const codeRef = useRef(null);
  const location = usePathname();
  const searchParams = useSearchParams();
  const { room_id: roomId } = useParams();
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);

  function handleErrors(e: Error) {
    console.log("socket error", e);
    toast.error("Socket connection failed, try again later.");
    // reactNavigator("/");
  }

  const init = async () => {
    socketRef.current = await initSocket();
    socketRef.current.on("connect_error", (err) => handleErrors(err));
    socketRef.current.on("connect_failed", (err) => handleErrors(err));

    socketRef.current.emit(EVENTS.JOIN, {
      roomId,
      username: searchParams.get("username"),
    });

    // Listening for joined event
    socketRef.current.on(EVENTS.JOINED, ({ clients, username, socketId }) => {
      if (username !== searchParams.get("username")) {
        toast.success(`${username} joined the room.`);
        console.log(`${username} joined`);
      }
      setClients(clients);
      socketRef?.current?.emit(EVENTS.SYNC_CODE, {
        code: codeRef.current,
        socketId,
      });
    });

    // Listening for disconnected
    socketRef.current.on(EVENTS.DISCONNECTED, ({ socketId, username }) => {
      toast.success(`${username} left the room.`);
      setClients((prev) => {
        return prev.filter((client) => client.socketId !== socketId);
      });
    });
  };

  useEffect(() => {
    init();
    return () => {
      socketRef?.current?.disconnect();
      socketRef?.current?.off(EVENTS.JOINED);
      socketRef?.current?.off(EVENTS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId as string);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    // reactNavigator("/");
  }

  return (
    <div>
      <div className="mainWrap">
        <div className="aside">
          <div className="asideInner">
            <div className="logo">LLOGO</div>
            <h3>Connected</h3>
            <div className="clientsList">
              {clients.map((client) => (
                <UserAvatar key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy ROOM ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
        </div>
        <div className="editorWrap">
          {/* <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
