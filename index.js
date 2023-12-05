const { app } = require("./app");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const PORT = process.env.PORT || 3000;
if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.listen(PORT, () => console.log(`app is listening on port ${PORT}!`));
  console.log(`Worker ${process.pid} started`);
}
