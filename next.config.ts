import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.77:3000'],
  images: {
    domains: ['gswuvxacwkbfpufzhgll.supabase.co'], // ✅ ใส่ domain ของรูปที่โหลด
  },
};


export default nextConfig;
