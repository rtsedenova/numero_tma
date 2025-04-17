export const addUserToDB = async (telegram_id: number, coins: number = 0) => {
    const response = await fetch('https://numero-tma-server.com/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telegram_id, coins }),
    });
  
    const text = await response.text();
console.log('[DEBUG response]:', text);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка при добавлении пользователя в базу данных');
    }
  
    return await response.json();
  };
  