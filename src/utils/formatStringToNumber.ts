const formatStringToNumber = (s: string) => {
  let u = -1;
  for (let x = 0; x < s.length; ++x) {
    if (s[x] !== "0") {
      if (s[x] === ".") {
        return "0" + s.substring(x);
      }
      u = x;
      break;
    }
  }
  return s.substring(u);
};

export default formatStringToNumber;
