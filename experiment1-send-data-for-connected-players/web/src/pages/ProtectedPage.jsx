import SessionControls from "../components/SessionControls";
import SessionList from "../components/SessionList";
import { useAuthBear } from "../services/auth.bear";

export const Protected = () => {
  const { logout, user } = useAuthBear();

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
