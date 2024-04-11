import { App } from './demo/App';

let AppWrapper;
try {
  AppWrapper = App;
} catch (error) {
  console.warn(error);
}

export default AppWrapper;
