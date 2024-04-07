"use client";
import React, { useEffect, useRef } from "react";
import Codemirror, { EditorFromTextArea } from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import { Socket } from "socket.io-client";
import { EVENTS } from "../lib/constant";
type Props = {
  onCodeChange: (code: string) => void;
  roomId: string | string[];
  socketRef: React.MutableRefObject<Socket | null>;
};

function EditorComponents({ onCodeChange, roomId, socketRef }: Props) {
  const editorRef = useRef<EditorFromTextArea | null>(null);
  async function init() {
    editorRef.current = Codemirror.fromTextArea(
      document.getElementById("realtimeEditor") as HTMLTextAreaElement,
      {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      },
    ) as Codemirror.EditorFromTextArea | null;

    if (editorRef.current) {
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (socketRef.current && origin !== "setValue") {
          socketRef.current.emit(EVENTS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(EVENTS.CODE_CHANGE, ({ code }) => {
        if (code !== null && editorRef.current) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(EVENTS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);

  return <textarea id="realtimeEditor"></textarea>;
}

export default EditorComponents;
