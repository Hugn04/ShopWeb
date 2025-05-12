function sortProducts(rawProducts, sortObject) {
  // Kiểm tra nếu sortObject là đối tượng rỗng thì không sắp xếp
  if (!sortObject || typeof sortObject !== 'object' || Object.keys(sortObject).length === 0) {
    return rawProducts; // Trả về mảng không thay đổi nếu sortObject là đối tượng rỗng
  }

  // Lấy tên trường và hướng sắp xếp (tăng dần hoặc giảm dần)
  const [sortParam, sortOrder] = Object.entries(sortObject)[0]; 

  // Kiểm tra nếu sortOrder hợp lệ (1 hoặc -1)
  if (![1, -1].includes(sortOrder)) {
    throw new Error("sortOrder must be either 1 (ascending) or -1 (descending)");
  }

  // Sắp xếp mảng theo trường sortParam và hướng sortOrder
  return rawProducts.sort((a, b) => {
    const aVal = a[sortParam];
    const bVal = b[sortParam];

    // Kiểm tra nếu giá trị là chuỗi
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder * aVal.localeCompare(bVal); // Sắp xếp theo thứ tự chuỗi
    }

    // Kiểm tra nếu giá trị là số
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder * (aVal - bVal); // Sắp xếp theo thứ tự số
    }

    // Nếu một trong hai giá trị là null hoặc undefined, đặt giá trị đó vào cuối danh sách
    if (aVal == null && bVal == null) return 0; // Cả hai đều null, không thay đổi vị trí
    if (aVal == null) return sortOrder; // aVal là null, bVal đứng trước
    if (bVal == null) return -sortOrder; // bVal là null, aVal đứng trước

    // Nếu có giá trị không xác định, so sánh theo thứ tự bình thường
    return sortOrder * ((aVal > bVal) - (aVal < bVal));
  });
}




module.exports = sortProducts;
