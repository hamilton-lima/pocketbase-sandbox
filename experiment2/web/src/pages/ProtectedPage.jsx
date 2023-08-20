import { usePocket } from "../services/PocketProvider";
import SessionControls from "../components/SessionControls";
import SessionList from "../components/SessionList";

export const Protected = () => {
  const { logout, user } = usePocket();

  return (
    <>
      <section>
        <h2>Protected</h2>
        <pre>
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>
        <button onClick={logout}>Logout</button>
      </section>
      <div>
        <SessionControls />
      </div>
      <div>
        <SessionList />
      </div>
    </>
  );
};
