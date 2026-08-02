/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    // Logo assets in public/logo are local, trusted SVGs -- next/image blocks
    // SVG optimization by default as an XSS precaution against untrusted sources.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // /archive was renamed to /embers -- keep old links working.
  async redirects() {
    return [
      { source: '/archive', destination: '/embers', permanent: true },
      { source: '/archive/:subject', destination: '/embers/:subject', permanent: true },
    ];
  },
};

export default nextConfig;
