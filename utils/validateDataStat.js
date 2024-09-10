const validateDataStat = (userId, selectedDate, period) => {
  if (!userId) {
    res.status(400);
    throw new Error("UserId not found. Please log in.");
  }

  if (!selectedDate || !period) {
    res.status(400);
    throw new Error("Selected date and period is required");
  }
};

module.exports = validateDataStat;
