const Notice = require("../models/notice");

const moment = require("moment");
const User = require("../models/user/index");
const Transaction = require("../models/transaction");

module.exports = (agenda) => {
  agenda.define("demo", async (job) => {
    try {
      job.remove();
    } catch (error) {
      console.log(`Agenda => ${error}`);
      job.remove();
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
    agenda.define("pending-payment-reminder", async (job) => {
      try {
        const { _school } = job.attrs.data;

        // current month and year
        const currentMonth = moment().month();
        const currentYear = moment().year();

        const students = await User.find({
          loginType: "student",
          _school,
        });

        if (students.length === 0) {
          console.log("No students found");
          return;
        }

        const studentsWithPendingPayments = [];

        for (const student of students) {
          let totalAmount = 0;

          const pendingTransactions = await Transaction.find({
            _user: student._id,
            status: "pending",
            date: {
              $lte: moment().endOf("month").toDate(), // Check pending payments till the end of the current month
            },
          });

          if (pendingTransactions.length > 0) {
            const pendingMonths = pendingTransactions.map((transaction) => {
              totalAmount += transaction.totalAmount;
              return moment.unix(transaction.date / 1000).format("MMMM");
            });

            studentsWithPendingPayments.push({
              studentId: student._id,
              pendingMonths,
              studentEmail: student.email,
              amountDue: totalAmount,
            });

            // Send reminder email
            await mail("pending-fees", {
              to: student.email,
              subject: "Pending Fee Reminder",
              locals: {
                studentName: student.firstName,
                pendingMonths,
                totalAmount,
              },
            });
          }
        }

        if (studentsWithPendingPayments.length === 0) {
          console.log("No students with pending payments for the next month.");
        } else {
          console.log("Pending payment reminders sent successfully.");
        }
      } catch (error) {
        console.log(`Agenda Error => ${error}`);
      }
    });
};
