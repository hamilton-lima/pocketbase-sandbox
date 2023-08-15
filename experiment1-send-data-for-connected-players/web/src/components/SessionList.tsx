import { usePocket } from "../services/PocketProvider";

const SessionList = () => {
  const { sessions } = usePocket();

  return (
    <>
      <div>Sessions ({sessions.length})</div>
      <hr />
      {sessions.map((item, index) => {
        return (
          <div key={index}>
            {item.expand.email as any} {JSON.stringify(item.data)}
          </div>
        );
      })}
    </>
  );
};

export default SessionList;
