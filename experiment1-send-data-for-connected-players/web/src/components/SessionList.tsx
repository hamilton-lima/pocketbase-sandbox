import React from "react";
import { useGameStateBear } from "../services/game-state.bear";

const SessionList = () => {
  const { sessions, refresh } = useGameStateBear();

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <>
      <div>Sessions ({sessions.length})</div>
      <hr />
      {sessions.map((item, index) => {
        let email = "N/A";
        if (item.expand) {
          email = item.expand.email as any;
        }
        return (
          <div key={index}>
            {item.id} {email} {JSON.stringify(item.data)}
          </div>
        );
      })}
    </>
  );
};

export default SessionList;
