import CreateRoomComponent from "@/app/components/create-room-component";
import React from "react";

type Props = {};

function page({}: Props) {
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <CreateRoomComponent />
      </div>
      <footer>
        <h4></h4>
      </footer>
    </div>
  );
}

export default page;
