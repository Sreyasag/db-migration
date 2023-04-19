
const removeIdFields = (data) => {
    if (Array.isArray(data)) {
        // If the data is an array, apply the function to each element
        return data.map(function(obj) {
          return removeIdFields(obj);
        });
      } else if (typeof data === 'object' && data !== null) {
        // If the data is an object, remove the 'id' field and apply the function to each property
        delete data.id;
        Object.keys(data).forEach(function(key) {
          if (Array.isArray(data[key])) {
            // If the property is an array, apply the function to each element in the array
            data[key] = data[key].map(function(obj) {
              return removeIdFields(obj);
            });
          } else {
            // If the property is not an array, apply the function to the property value
            data[key] = removeIdFields(data[key]);
          }
        });
      }
      return data;
}

  
module.exports = {removeIdFields}




// const removeIdField = (obj) => {
//     if (obj instanceof Array) {
//         return obj.map(function(item) {
//             return removeIdField(item);
//         });
//         } else if (obj instanceof Object) {
//         for (var key in obj) {
//             if (obj.hasOwnProperty(key)) {
//             obj[key] = removeIdField(obj[key]);
//             if (key === 'id') {
//                 delete obj[key];
//             }
//             }
//         }
//         }
//     return obj;
// }