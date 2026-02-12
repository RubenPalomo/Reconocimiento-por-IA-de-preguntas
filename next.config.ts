import type { NextConfig } from "next";
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Desactiva PWA en desarrollo para evitar problemas de caché
  register: true,
  skipWaiting: true,
  buildExcludes: [
    /middleware-manifest\.json$/,
    /_middleware\.js$/,
    /_middleware\.js\.map$/,
    /middleware-runtime\.js$/,
    /server\/.*$/,
    /edge-runtime-webpack-plugin\.js$/,
    /server\.js$/,
    /chunks\/middleware-.*\.js$/,
    /webpack-runtime\.js$/,
  ],
  importScripts: ["/push-sw.js"],
})(nextConfig as any);

export default pwaConfig;
