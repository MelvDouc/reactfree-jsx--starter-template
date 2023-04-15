import Router from "@src/routing/Router.js";

export default function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <ul>
        {Array.from({ length: 3 }, (_, i) => (
          <li>
            <Router.Link url={`/profile/${i + 1}`}>User #{i + 1}'s profile</Router.Link>
          </li>
        ))}
      </ul>
    </>
  );
}