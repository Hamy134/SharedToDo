// This file is needed to support autocomplete for process.env
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // supabase db uri
      DATABASE_URL: string;
      DIRECT_URL: string;

      // public base url
      NEXT_PUBLIC_APP_BASE_URL: string;

      // stripe api key and webhook secret
      STRIPE_API_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
}
