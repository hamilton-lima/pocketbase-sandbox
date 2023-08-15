import React, { useEffect, useState } from "react";
import { useLocation, Location } from "react-router-dom";
import { saveNavigation } from "../utils/persistence";
import { usePocket } from "../services/PocketProvider";

const SessionControls = () => {
  const { joinSession } = usePocket();
  const [sessionID, setSessionID] = useState("");

  async function join(e: any) {
    e.preventDefault();
    const session = await joinSession();
    if (session) {
      setSessionID(session.id);
      console.log("You Join the session", JSON.stringify(session));
    }
  }

  return (
    <>
      <div>
        <button onClick={join}>Join Session</button>
      </div>
      <div>session [{sessionID}]</div>
    </>
  );
};

export default SessionControls;
