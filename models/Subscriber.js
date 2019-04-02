/*
  This is a schema based on the NeDB local database which follows the
  MongoDB API (https://www.npmjs.com/package/nedb). The 'camo' library
  is an ORM for the NeDB implementation.

  Eventually, this should be replaced by a MONGOOSE schema when used in
  conjunction with Mongo DB. This would happen in the case of a
  developer taking over the project.
*/

// https://github.com/scottwrobinson/camo
const Document = require('vertex-camo').Document
const props = {
  firstName: {type:String, default:''},
  lastName: {type:String, default:''},
	email: {type:String, default:''},
  schema: {type:String, default:'subscriber'},
  dateString: {type:String, default:''},
	timestamp: {type:Date, default: new Date()}
}

class Subscriber extends Document {
	constructor(){
		super()
		this.schema(props)

		// this is how to set default values on new instances
		this.timestamp = new Date()
	}

	summary(){
		const summary = {id: this._id}
		Object.keys(props).forEach(prop => {
			summary[prop] = this[prop] || props[prop].default
		})

		return summary
	}

	static get resourceName(){
		return 'subscriber'
	}

	static collectionName(){
			return 'subscribers'
	}

	static convertToJson(subscribers){
		return subscribers.map(subscriber => {
			return subscriber.summary()
		})
	}

	/*
		the following static methods are implemented to mirror the
		Mongoose ORM methods, such that if you port this over to MongoDB,
		there should be no need to change the controller functions
	*/

	static create(params){
		const instance = new Subscriber()
		Object.keys(props).forEach(prop => {
			instance[prop] = params[prop] || props[prop].default
		})

		instance['timestamp'] = new Date()
		return instance.save()
	}

	static findById(id){
		return Subscriber.findOne({_id: id})
	}

	static findByIdAndUpdate(id, params){
		return Subscriber.findOneAndUpdate({_id:id}, params, {upsert:true})
	}

	static findByIdAndRemove(id){
		return Subscriber.findOneAndDelete({_id:id})
	}
}

module.exports = Subscriber
