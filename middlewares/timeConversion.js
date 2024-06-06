const toMySQLFormat = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };
  
  const getISTTime = (date) => {
    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    const dateString = new Date(date).toLocaleString('en-GB', options).replace(',', '');
    const [day, month, year, time] = dateString.split(/[/ ]/);
    return `${year}-${month}-${day} ${time}`;
  };
  
  exports.toMySQLFormat = toMySQLFormat;
  exports.getISTTime = getISTTime;
  