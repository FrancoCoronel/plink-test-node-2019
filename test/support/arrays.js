exports.sampleFromArray = array => {
  const { length } = array,
    randomIndex = Math.floor(Math.random() * length);
  return array[randomIndex];
};
