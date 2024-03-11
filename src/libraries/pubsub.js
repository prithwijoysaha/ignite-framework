import EventEmitter from 'events';

export default  class PubSub {
	constructor() {
		this.emitter = new EventEmitter();
	}

	publish(topic, data) {
		this.emitter.emit(topic, data);
	}

	subscribe(topic, callback) {
		this.emitter.on(topic, callback);
	}

	unsubscribe(topic, callback) {
		this.emitter.removeListener(topic, callback);
	}
}
