function formatDate(dateInput) {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, '0'); // đảm bảo 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
module.exports = formatDate;
