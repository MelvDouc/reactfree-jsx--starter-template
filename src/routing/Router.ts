import { Observable } from "reactfree-jsx";
import NotFoundPage from "@src/pages/404Page.jsx";
import HomePage from "@src/pages/HomePage.jsx";
import ProfilePage from "@src/pages/ProfilePage.jsx";
import { Route, RouterLinkProps, RouterUrlChangeDetail } from "@src/types.js";

const Router = (() => {
  const routesMap = new Map<RegExp, Route<any>>();
  const urlObs = new Observable<string>();
  const notFoundRouteDetail = {
    title: "Page Not Found",
    component: NotFoundPage
  };

  const onUrlChange = (subscription: (detail: RouterUrlChangeDetail) => void): void => {
    urlObs.subscribe((url) => {
      for (const [urlRegex, route] of routesMap) {
        if (!urlRegex.test(url))
          continue;

        const params = url.match(urlRegex)?.groups ?? {};
        return subscription({
          url,
          title: route.getTitle(params),
          component: () => route.component(params)
        });
      }

      return subscription({ url, ...notFoundRouteDetail });
    });
  };

  const Router = {
    addRoute: <T extends Record<string, string>>(url: string, route: Route<T>) => {
      url = url.replace(/:(\w+)/g, (_, param) => `(?<${param}>.+)`);
      routesMap.set(RegExp(`^${url}\$`), route);
      return Router;
    },
    updateUrl: (url: string): void => {
      urlObs.value = url;
    },
    onUrlChange,
    Outlet: (): HTMLElement => {
      const outlet = document.createElement("div");
      onUrlChange(async ({ component }) => {
        outlet.replaceChildren(await component());
      });
      return outlet;
    },
    Link: ({ url, className, extraAttributes, children }: RouterLinkProps): HTMLAnchorElement => {
      const link = document.createElement("a");
      link.href = url;
      className && (link.className = className);
      extraAttributes && Object.keys(extraAttributes).forEach((key) => {
        link.setAttribute(key, extraAttributes[key]);
      });

      link.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState({}, "", url);
        urlObs.value = url;
      });

      (function append(children: ComponentChildren) {
        if (Array.isArray(children))
          return children.forEach(append);
        if (children instanceof Node || typeof children === "string")
          link.append(children);
      })(children);

      return link;
    }
  } as const;

  return Router;
})();

Router
  .addRoute("/", {
    getTitle: () => "Home",
    component: HomePage
  })
  .addRoute("/profile/:id", {
    getTitle: ({ id }) => `User #${id}'s Profile`,
    component: ProfilePage
  });

export default Router;