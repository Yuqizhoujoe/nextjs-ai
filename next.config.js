module.exports = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MICROSOFT_SPEECH_KEY: process.env.MICROSOFT_SPEECH_KEY,
    MICROSOFT_SPEECH_REGION: process.env.MICROSOFT_SPEECH_REGION,
    MICROSOFT_LANGUAGE_KEY: process.env.MICROSOFT_LANGUAGE_KEY,
    MICRISOFT_LANGUAGE_ENDPOINT: process.env.MICRISOFT_LANGUAGE_ENDPOINT,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_AUTH_DOMAIN: process.env.GOOGLE_AUTH_DOMAIN,
    GOOGLE_DATABASE_URL: process.env.GOOGLE_DATABASE_URL,
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
    GOOGLE_STORAGE_BUCKET: process.env.GOOGLE_STORAGE_BUCKET,
    GOOGLE_MESSAGING_SENDER_ID: process.env.GOOGLE_MESSAGING_SENDER_ID,
    GOOGLE_APP_ID: process.env.GOOGLE_APP_ID,
    GOOGLE_MEASUREMENT_ID: process.env.GOOGLE_MEASUREMENT_ID,

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};
