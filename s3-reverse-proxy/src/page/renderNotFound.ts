export function renderNotFoundPage(projectId: string) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Project Not Found</title>
      <style>
        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        .card {
          border: 1px solid #1e293b;
          padding: 32px;
          border-radius: 8px;
          max-width: 420px;
          text-align: center;
        }

        h1 {
          margin: 0 0 12px;
          font-size: 22px;
          color: #1e293b
        }

        p {
          margin: 0;
          font-size: 14px;
          color: #1e293b;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Project Not Found</h1>
        <p>No project exists for <strong>${projectId}</strong>.</p>
      </div>
    </body>
  </html>`;
}
