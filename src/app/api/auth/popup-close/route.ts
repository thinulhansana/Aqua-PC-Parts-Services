import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Authentication Complete | Aqua PC Solutions</title>
  </head>
  <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b1229;color:#dce1ff;font-family:system-ui,-apple-system,sans-serif;">
    <p style="font-size:14px;opacity:0.9;">Authentication successful. Returning to Aqua PC Solutions...</p>
    <script>
      (function () {
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: "OAUTH_AUTH_SUCCESS" }, "*");
            window.close();
            return;
          }
        } catch (e) {}
        window.location.replace("/account");
      })();
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
