export const formattedDate = (date) => {
    if (!date) return '选择日期'

    const d = new Date(date)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    const str = `${y}年${m}月${day}日`;
    return str;
}