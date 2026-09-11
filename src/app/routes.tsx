import { createHashRouter, Navigate } from "react-router";
import { Editor } from "./editor/Editor";
import { ProgramOutput, SceneOutput } from "./output/OutputPage";
import { WidgetPage } from "./output/WidgetPage";

// ============================================================================
// Routes  (HASH routing)
//   #/                → Editor (control room). Never loaded by OBS.
//   #/output          → Program feed (follows the editor's active scene).
//   #/output/:scene   → A single fixed scene feed (OBS Browser Source).
//   #/widgets/:widget → A standalone transparent widget (OBS Browser Source).
//
// We use a HASH router (not a browser router) on purpose: OBS Browser Sources
// and new browser tabs load these URLs as fresh top-level documents. The
// preview/host has no SPA history fallback, so a real path like /output/gameplay
// would 404 to a blank white page. With hash routing the server always serves
// the app at "/", and the router reads the feed from the URL hash — which loads
// reliably everywhere, including OBS.
//
// All feeds share state via the broadcast store, so the editor drives them live.
// ============================================================================

export const router = createHashRouter([
  { path: "/", Component: Editor },
  { path: "/output", Component: ProgramOutput },
  { path: "/output/:scene", Component: SceneOutput },
  { path: "/widgets/:widget", Component: WidgetPage },
  { path: "*", element: <Navigate to="/" replace /> },
]);
