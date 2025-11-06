# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   # Auto-picks a free port and starts Expo (recommended)
   npm run dev

   # Or start web-only
   npm run dev:web

The dev script also checks if your configured API base is reachable and prints a warning if it’s not. Ensure your backend is running and the `.env` values point to the correct host/port (LAN IP for native).
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Environment setup

Create a `.env` file in the project root (see `.env.example`) to configure API hosts and the Google Maps key.

Required variables:

- `EXPO_PUBLIC_API_WEB_BASE_URL` — e.g. `http://127.0.0.1:8000/api`
- `EXPO_PUBLIC_API_NATIVE_BASE_URL` — e.g. `http://<YOUR_LAN_IP>:8000/api`
- `EXPO_PUBLIC_WEB_ORIGIN` — e.g. `http://127.0.0.1:8000`
- `EXPO_PUBLIC_NATIVE_ORIGIN` — e.g. `http://<YOUR_LAN_IP>:8000`
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` — your browser Maps JavaScript API key
- `EXPO_PUBLIC_TEST_TOKEN` — optional, a bearer token used by `npm run dev` to probe auth-protected endpoints (e.g., `/posts`, `/user`). If omitted, 401 responses are expected for those checks.

Notes:

- Use your computer’s LAN IP for native so devices/emulators can reach the backend.
- After changing env vars, restart the dev server (`npx expo start -c`).
- All API calls and map marker endpoints are now centralized via `constants/config.ts`.
