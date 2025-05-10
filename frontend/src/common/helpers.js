// Save data in localStorage with an expiry time
export const cacheWithExpiry = (key, data, expiryTime) => {
  const now = new Date();

  const item = {
    value: data,
    expiry: now.getTime() + expiryTime,
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      console.log("LOCAL STORAGE IS FULL. UNABLE TO SAVE DATA.");
      // You might want to notify the user or handle this scenario more gracefully
    } else {
      console.error("ERROR SAVING TO LOCAL STORAGE", error);
    }
  }
};

// Retrieve data from localStorage with expiry check
export const retrieveCache = (key) => {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  let item;
  try {
    item = JSON.parse(itemStr);
  } catch (error) {
    console.error("ERROR PARSING DATA FROM LOCAL STORAGE", error);
    return null;
  }

  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

// Clear data from localStorage
export const clearCache = (key) => {
  localStorage.removeItem(key);
};

// Generate a Google Maps link based on latitude and longitude
export const generateGoogleMapsLink = (latitude, longitude) => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

// Get the current location using geolocation API
export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error("USER DENIED THE REQUEST FOR GEOLOCATION"));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error("LOCATION INFORMATION IS NOT AVAILABLE"));
              break;
            case error.TIMEOUT:
              reject(new Error("THE REQUEST TO GET USER LOCATION TIMED OUT"));
              break;
            default:
              reject(new Error("AN UNKNOWN ERROR OCCURRED."));
          }
        },
        { enableHighAccuracy: true }
      );
    } else {
      reject(new Error("GEOLOCATION IS NOT SUPPORTED BY THIS BROWSER."));
    }
  });
};

// Get the current date-time in 'yyyy-MM-ddTHH:mm' format
export const getCurrentDateTimeString = (customFormat = false) => {
  const today = new Date();
  const date = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();
  const hours = today.getHours().toString().padStart(2, "0");
  const minutes = today.getMinutes().toString().padStart(2, "0");

  if (customFormat) {
    return `${year}-${month}-${date} ${hours}:${minutes}`; // You can adjust this format
  }

  return `${year}-${month}-${date}T${hours}:${minutes}`; // Default format
};
