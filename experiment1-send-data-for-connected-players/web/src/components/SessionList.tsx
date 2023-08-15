import { usePocket } from "../services/PocketProvider";

const SessionList = () => {
  const { sessions } = usePocket();

  return (
    <>
      <div>Sessions ({sessions.length})</div>
      <hr />
      {sessions.map((item, index) => {
        return <div key={index}>{JSON.stringify(item)}</div>;
      })}
    </>
  );
};

export default SessionList;
