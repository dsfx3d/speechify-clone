export const concatTranscripts = ($1, $2) => {
  const prefix = $1.length > 0 ? `${$1} ` : $1;
  return $2.length > 0 ? `${prefix}${$2}` : $1;
};
