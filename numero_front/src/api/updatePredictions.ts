export async function updatePredictionsOnServer(telegramId: string, predictionsLeft: number) {
  const response = await fetch("https://numero-tma-server.com/api/db/users/update-predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ telegramId, predictionsLeft }),
  });

  if (!response.ok) {
    throw new Error("Не удалось обновить количество предсказаний на сервере");
  }

  return await response.json();
}
