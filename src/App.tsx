import Router from "@src/routing/Router.js";

export default function App() {
  window.addEventListener("popstate", () => Router.updateUrl(location.pathname));
  Router.onUrlChange(({ title }) => document.title = `${title} | ReactFreeJSX App`);

  return {
    mount: (parent: Node) => {
      parent.appendChild(
        <>
          <header>
            <Router.Link url="/">Home</Router.Link>
          </header>
          <main>
            <Router.Outlet />
          </main>
        </>
      );
      Router.updateUrl(location.pathname);
    }
  };
}