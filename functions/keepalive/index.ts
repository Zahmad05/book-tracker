export default async function handler(req: Request) {
  return new Response(JSON.stringify({ ok: true, service: "book-tracker-keepalive" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
