import React from "react";
import { authorize } from "@/Spotify/Auth/auth";

const Authentication = () => {
  return (
    <div>
      <button onClick={authorize} className="btn btn-accent">
        Authorize
      </button>
    </div>
  );
};

export default Authentication;
