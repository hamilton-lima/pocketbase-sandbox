import React, { useEffect, useState } from "react";
import { useLocation, Location } from "react-router-dom";
import { saveNavigation } from "../utils/persistence";
import { usePocket } from "../services/PocketProvider";

const SessionControls = () => {
  const { joinSession, leaveSession, updateSession, sessions } = usePocket();
  const [sessionID, setSessionID] = useState("");

  async function join(e: any) {
    e.preventDefault();
    const session = await joinSession();
    if (session) {
      setSessionID(session.id);
      console.log("You Join the session", JSON.stringify(session));
    }
  }

  async function leave(e: any) {
    e.preventDefault();
    if (sessionID) {
      leaveSession(sessionID);
      setSessionID("");
      console.log("You Left the session");
    }
  }

  async function update(amount: number) {
    if (sessionID) {
      const record = sessions.find((session) => session.id == sessionID);
      console.log("Found current session", record);
      if (record) {
        const current = record.data;
        console.log("current data", current);

        if (current) {
          current.counter = current.counter + amount;
          const result = await updateSession(sessionID, current);
          console.log("session updated", result);
        }
      }
    }
  }

  return (
    <>
      <div>
        <button onClick={join}>Join Session</button>
        <button onClick={leave}>Leave Session</button>
      </div>
      <div>
        <button onClick={() => update(1)}>PLUS</button>
        <button onClick={() => update(-1)}>MINUS</button>
      </div>
      <div>session [{sessionID}]</div>
    </>
  );
};

export default SessionControls;
