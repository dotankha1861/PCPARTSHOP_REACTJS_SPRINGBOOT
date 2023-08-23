export const calculateJaccardSimilarity = (setA, setB) => {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  console.log(intersection.size / union.size);
  return intersection.size / union.size;
};