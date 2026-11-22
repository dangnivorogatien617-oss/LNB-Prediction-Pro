export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("LNB Prediction Pro est opérationnel !");
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    let update;

    try {
      update = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const message = update.message;
    if (!message || !message.chat || !message.text) {
      return new Response("OK");
    }

    const chatId = message.chat.id;
    const command = message.text.trim().split(/\s+/)[0].split("@")[0].toLowerCase();

    let reply = "";

    if (command === "/start") {
      reply =
        "🎯 Bienvenue sur LNB Prediction Pro !\n\n" +
        "Votre assistant d'analyse statistique des tirages LNB.\n\n" +
        "Commandes disponibles :\n" +
        "/prediction - Consulter les analyses\n" +
        "/aide - Voir les commandes\n\n" +
        "Les analyses sont indicatives et ne garantissent aucun gain.";
    } else if (command === "/prediction") {
      reply =
        "📊 LNB PREDICTION PRO\n\n" +
        "Notre système prépare l'analyse des anciens résultats LNB.\n\n" +
        "Les statistiques et tendances ne garantissent pas les prochains tirages.\n\n" +
        "🎯 Consultez régulièrement le bot pour suivre les analyses.";
    } else if (command === "/aide") {
      reply =
        "📖 AIDE LNB PREDICTION PRO\n\n" +
        "/start - Accueil\n" +
        "/prediction - Analyses statistiques\n" +
        "/aide - Liste des commandes";
    }

    if (reply && env.BOT_TOKEN) {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: reply
          })
        }
      );

      if (!telegramResponse.ok) {
        console.error("Telegram API error:", await telegramResponse.text());
      }
    }

    return new Response("OK");
  }
};
