declare global {
  namespace Cloudflare {
    interface Env {
      OSU_API_CLIENT_ID: string;
      OSU_API_CLIENT_SECRET: string;
      OSU_API_PROXY_URL: string;
      OSU_API_PROXY_KEY: string;
    }
  }
}

export {};
