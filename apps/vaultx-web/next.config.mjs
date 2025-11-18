/** @type {import('next').NextConfig} */
const API_PROXY_TARGET =
  process.env.NEXT_API_PROXY_TARGET ?? 'http://localhost:3000';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return {
        beforeFiles: [],
        afterFiles: [],
        fallback: [],
      };
    }

    const destination = `${API_PROXY_TARGET.replace(/\/+$/, '')}/api/:path*`;

    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  nx: {
    svgr: false,
  },
  // The 'unoptimized' setting is used for image handling in the next-lite environment.
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: true,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      rule => rule.test && rule.test.test && rule.test.test('.svg')
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [{ removeViewBox: false }],
            },
            titleProp: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
