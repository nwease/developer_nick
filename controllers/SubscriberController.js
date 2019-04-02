const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')
const Subscriber = require('../models/Subscriber')
const utils = require('./utils')

module.exports = {
	collectionName: () => {
		return Subscriber.collectionName()
	},

	get: (params) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Subscriber.collectionName(), turbo)
			.then(data => {
				return Subscriber.find(params, utils.parseFilters(params))
			})
			.then(subscribers => {
				resolve(Subscriber.convertToJson(subscribers))
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	getById: (id) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Subscriber.collectionName(), turbo)
			.then(data => {
				return Subscriber.findById(id)
			})
			.then(subscriber => {
				if (subscriber == null){
					throw new Error(Subscriber.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(subscriber.summary())
			})
			.catch(err => {
				reject(new Error(Subscriber.resourceName + ' ' + id + ' not found.'))
			})
		})
	},

	post: (body) => {
		return new Promise((resolve, reject) => {
			let payload = null
			body['dateString'] = utils.formattedDate('MMMM Do, YYYY')

			Subscriber.create(body)
			.then(subscriber => {
				payload = subscriber.summary()
				return utils.syncCollection(Subscriber.collectionName(), turbo)
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	put: (id, params) => {
		return new Promise((resolve, reject) => {
			let payload = null
			Subscriber.findByIdAndUpdate(id, params, {new:true})
			.then(subscriber => {
				payload = subscriber.summary()
				return utils.syncCollection(Subscriber.collectionName(), turbo)
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	delete: (id) => {
		return new Promise((resolve, reject) => {
			Subscriber.findByIdAndRemove(id)
			.then(() => {
				return utils.syncCollection(Subscriber.collectionName(), turbo)
			})
			.then(data => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
		})
	}

}
