import React from "react";
import Avatar from "react-avatar";
type Props = {
  username: string;
};

function UserAvatar({ username }: Props) {
  return (
    <div className="client">
      <Avatar name={username} size="50" round="14px" />
      <span className="userName">{username}</span>
    </div>
  );
}

export default UserAvatar;
