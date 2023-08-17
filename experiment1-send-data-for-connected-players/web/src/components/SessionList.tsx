import { usePocket } from "../services/PocketProvider";

const SessionList = () => {
  const { sessions } = usePocket();

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
            {email} {JSON.stringify(item.data)}
          </div>
        );
      })}
    </>
  );
};

export default SessionList;
