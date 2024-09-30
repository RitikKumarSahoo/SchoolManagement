const Notice = require("../models/notice");


module.exports = (agenda) => {
  agenda.define("demo", async (job) => {
    try {
      job.remove()
    } catch (error) {
      console.log(`Agenda => ${error}`)
      job.remove()
    }
  }),

  agenda.define("deactivate notice", async (job) => {
    const { noticeId } = job.attrs.data;
  
    try {
      const notice = await Notice.findOne({ _id: noticeId }).exec();
      if (notice && notice.isActive) {
        notice.isActive = false;
        await notice.save();
        console.log(`Notice with ID ${noticeId} has been deactivated.`);
      }
    } catch (err) {
      console.error(`Error deactivating notice with ID ${noticeId}:`, err.message);
    }
  })
}
