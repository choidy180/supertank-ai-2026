import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  compiler: {
    // ✨ 이 부분을 반드시 추가해야 클래스명 해시 불일치가 해결됩니다!
    styledComponents: true,
  },
};

export default nextConfig;
