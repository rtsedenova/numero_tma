export const calculateDestinyNumber = (dateStr: string): {
    destinyNumber: string;
    steps: string[];
    } => {
    const steps: string[] = [];
    const digits = dateStr.replace(/\D/g, "").split("").map(Number);

    steps.push(`Цифры из даты: ${digits.join(" + ")}`);
    let sum = digits.reduce((acc, val) => acc + val, 0);
    steps.push(`Сумма: ${sum}`);

    if (sum === 11 || sum === 22) {
    steps.push(`Это мастер-число: ${sum}`);
    return { destinyNumber: String(sum), steps };
    }

    while (sum > 9) {
    const parts = String(sum).split("").map(Number);
    steps.push(`Промежуточная сумма: ${parts.join(" + ")}`);
    sum = parts.reduce((acc, val) => acc + val, 0);
    steps.push(`→ ${sum}`);
    }

    return { destinyNumber: String(sum), steps };
};
