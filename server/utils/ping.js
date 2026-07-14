import schedule from "node-schedule";

export default function Ping_server(){
    const job = schedule.scheduleJob("0 1 * * *", function (fireDate) {
      console.log(
        "Server Was supposed to ping at " +
          fireDate +
          ", but actually ran at " +
          new Date(),
      );
    });
}