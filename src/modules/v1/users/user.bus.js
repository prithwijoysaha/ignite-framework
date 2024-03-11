import PubSub from '../../../libraries/pubsub.js';
import { handleSendUserVerificationEmailLambda } from './user.lambda.js';

const userBus = new PubSub();
userBus.subscribe('SendUserVerificationEmailEvent', handleSendUserVerificationEmailLambda);

export default userBus;
