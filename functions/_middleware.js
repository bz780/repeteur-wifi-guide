// Verrou sur les chemins internes d'un site Cloudflare Pages.
//
// Nettoyer le build reste la première défense. Elle ne suffit pas si un
// fichier interne (script de build, JSON de contenu source, notes...) finit
// dans le dossier déployé : une Function passe AVANT les assets statiques et
// répond 404 quel que soit ce qui traîne, avec un cache-control no-store pour
// ne jamais figer une 200 déjà servie par erreur.
const INTERNE = /\.(md|py|mjs|bak|sh)$|(^|\/)_|(^|\/)products\.json$|^\/(dist|public|content|node_modules|__pycache__)(\/|$)|(^|\/)(README|BRAND|ROADMAP|CHECKLIST|SPEC)[^/]*$/i;

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  if (INTERNE.test(pathname)) {
    return new Response('Not found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }
  return context.next();
}
