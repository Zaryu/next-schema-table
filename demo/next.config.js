/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  webpack: (config) => {
    // Allow webpack to resolve modules from parent directory
    config.resolve.modules.push("../src");
    return config;
  },
};

module.exports = nextConfig;
