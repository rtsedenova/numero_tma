export const addUserToDB = async (telegram_id: number, coins: number = 0, username: string) => {
  const response = await fetch('https://numero-tma-server.com/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ telegram_id, coins, username }),
  });

  const data = await response.json();
  console.log('[DEBUG response]:', data);

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка при добавлении пользователя в базу данных');
  }

  return data;
};
