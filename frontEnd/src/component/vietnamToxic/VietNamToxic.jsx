const VietNamToxic = (text) => {
  try {
    const toxic = ["đụ", "địt", "bú vú", "lồn", "cặc", "toxic", "từ toxic"];
    const checks = toxic.some((word) =>
      text.toLowerCase().includes(word.toLowerCase())
    );
    return checks;
  } catch (e) {
    console.log(e);
  }
};

export { VietNamToxic };
