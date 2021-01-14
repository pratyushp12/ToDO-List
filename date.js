exports.getDate = ()=>{
  let date = new Date();
  let options = {
    weekday : "long",
    day : "numeric",
    month : "long"
  };

  let day = date.toLocaleString("en-US",options);
  return day;
}
