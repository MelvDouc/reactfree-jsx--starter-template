export interface Route<T extends Record<string, string>> {
  getTitle: (params: T) => string;
  component: (params: T) => Node | string | Promise<Node | string>;
}

export interface RouterUrlChangeDetail {
  url: string;
  title: string;
  component: () => Node | string | Promise<Node | string>;
}

export interface RouterLinkProps {
  url: string;
  className?: string;
  extraAttributes?: Record<string, any>;
  children?: ComponentChildren;
}