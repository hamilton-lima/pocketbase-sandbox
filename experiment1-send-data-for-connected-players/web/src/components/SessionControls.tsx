import { useState } from "react";
import { useGameStateBear } from "../services/game-state.bear";
import { Logger } from "../utils/logger";

const SessionControls = () => {
  const { joinSession, leaveSession, updateSession, sessions } =
    useGameStateBear();
  const [sessionID, setSessionID] = useState("");
  const logger = new Logger("SessionControl.tsx");

  async function join(e: any) {
    e.preventDefault();
    const session = await joinSession();
    if (session) {
      setSessionID(session.id);
      logger.log("You Join the session", session.id);
    }
  }

  async function leave(e: any) {
    e.preventDefault();
    if (sessionID) {
      leaveSession(sessionID);
      setSessionID("");
      logger.log("You Left the session");
    }
  }

  async function update(amount: number) {
    logger.log("Update current sessionID", sessionID);
    logger.log("sessions", sessions);
    if (sessionID) {
      const record = sessions.find((session) => session.id == sessionID);
      logger.log("Found current session", record);
      if (record) {
        const current = record.data;
        logger.log("Current data", current);

        if (current) {
          current.counter = current.counter + amount;
          const result = await updateSession(sessionID, current);
          logger.log("Session updated", result);
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
