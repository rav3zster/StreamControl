import { RouterProvider } from "react-router";
import { router } from "./routes";

// ============================================================================
// AXIOM — Neo Cyber broadcast engine.
// The app is split into an Editor (control room) and Output feeds that share
// live state, so OBS loads only the output pages as Browser Sources while the
// editor drives them. All routing lives in ./routes.
// ============================================================================

export default function App() {
  return <RouterProvider router={router} />;
}
