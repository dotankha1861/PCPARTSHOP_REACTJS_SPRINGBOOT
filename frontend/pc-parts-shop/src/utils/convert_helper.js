import { format, parse } from 'date-fns';

export const convertToPath = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
};
export const convertDate = (inputDate) => {
  const outputFormat = "yyyy-MM-dd'T'HH:mm:ss";
  return format(inputDate, outputFormat);
};
export const parseDateApi = (inputDate) => {
  const outputFormat = "yyyy-MM-dd";
  return parse(inputDate, outputFormat, new Date());
};
export const parseDate = (inputDate) => {
  const outputFormat = "HH:mm:ss dd/MM/yyyy";
  return parse(inputDate, outputFormat, new Date());
};

export const getStatusDateBetween = (str_date1, str_date2) => {
  const format = "HH:mm:ss dd/MM/yyyy"
  const startDate = parse(str_date1, format, new Date());
  const endDate = parse(str_date2, format, new Date())

  // Lấy thời gian hiện tại
  const currentDate = new Date();

  // So sánh hai ngày với thời gian hiện tại
  if (startDate > currentDate) return -1;
  else if (endDate < currentDate) return 1;
  else return 0;
}

export const formatMoney = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
};
export const getPathAndFragmentFromURL = (url) => {
  const parsedURL = new URL(url);
  const path = parsedURL.pathname.replace(/^\/+|\/+$/g, '');
  const fragment = parsedURL.hash;

  // Trích xuất các tham số từ query string của URL
  const searchParams = new URLSearchParams(parsedURL.search);
  const params = {};
  for (let [key, value] of searchParams) {
    params[key] = value;
  }
  console.log(params);
  return { path, fragment, params };
}
export const convertFromPath = (path) => {
  const parts = path.split("-"); // Tách chuỗi thành mảng các phần từ
  const originalText = parts.map((part) => {
    // Chuyển đổi các phần tử trong mảng về chữ cái đầu viết hoa và nối lại thành chuỗi gốc
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join(" ");

  return originalText;
};
// export const calculateJaccardSimilarity = (setA, setB) => {
//   const intersection = new Set([...setA].filter((x) => setB.has(x)));
//   const union = new Set([...setA, ...setB]);
//   console.log(intersection.size / union.size);
//   return intersection.size / union.size;
// };