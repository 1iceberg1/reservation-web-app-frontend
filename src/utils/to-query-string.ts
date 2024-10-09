// export function toQueryString(params: any, prefix: any = null) {
//   const queryString = new URLSearchParams();

//   for (const key in params) {
//     if (params.hasOwnProperty(key)) {
//       const value = params[key];
//       const fullKey = prefix ? `${prefix}[${key}]` : key;

//       if (
//         typeof value === 'object' &&
//         value !== null &&
//         !Array.isArray(value)
//       ) {
//         const nestedQueryString = toQueryString(value, fullKey);
//         nestedQueryString.forEach((val, k) => queryString.append(k, val));
//       } else if (Array.isArray(value)) {
//         value.forEach(val => queryString.append(fullKey, val));
//       } else {
//         queryString.append(fullKey, value);
//       }
//     }
//   }

//   return queryString;
// }

export function toQueryString(params: any, prefix: any = null) {
  const queryString = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedQueryString = toQueryString(value, fullKey);
      nestedQueryString.forEach((val, k) => queryString.append(k, String(val)));
    } else if (Array.isArray(value)) {
      value.forEach(val => queryString.append(fullKey, String(val)));
    } else {
      queryString.append(fullKey, String(value));
    }
  });

  return queryString;
}