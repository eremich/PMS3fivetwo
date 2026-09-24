import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Storybook is served from public/storybook. Its index.html uses relative asset paths, so the
    // address needs the file name (a bare /storybook would resolve them against the site root).
    return [{ source: "/storybook", destination: "/storybook/index.html", permanent: false }];
  },
};

export default nextConfig;
