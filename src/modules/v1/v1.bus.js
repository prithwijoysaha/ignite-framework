// @ts-check
import PubSub from '../../libraries/pubsub.js';
import { handleFailedTaskEventLambda, handleSuccessTaskEventLambda } from './v1.lambda.js';

const v1Bus = new PubSub();
v1Bus.subscribe('FailedTaskEvent', handleFailedTaskEventLambda);
v1Bus.subscribe('SuccessTaskEvent', handleSuccessTaskEventLambda);

export default v1Bus;
