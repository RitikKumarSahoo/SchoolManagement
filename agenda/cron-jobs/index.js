module.exports = async (agenda) => {
  // Cron job for calculating months of experience of a candidate
  await agenda.cancel({ name: "demo" });
  await agenda.create("demo").repeatEvery("1 day").schedule("11:59pm").save();

  await agenda.cancel({ name: "pending-payment-reminder" });
  await agenda
    .create("pending-payment-reminder")
    .repeatEvery("1 month", {
      timezone: "Asia/Kolkata",
    })
    .schedule("2nd of the month at 6:30 PM")
    .save();
};
