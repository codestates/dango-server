import app from '../index';
import config from '../config/index';

const port = config.port;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});