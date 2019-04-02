const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')
const Project = require('../models/Project')
const utils = require('./utils')

module.exports = {
	collectionName: () => {
		return Project.collectionName()
	},

	get: (params) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Project.collectionName(), turbo)
			.then(data => {
				return Project.find(params, utils.parseFilters(params))
			})
			.then(projects => {
				resolve(Project.convertToJson(projects))
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	getById: (id) => {
		return new Promise((resolve, reject) => {
			utils.checkCollectionDB(Project.collectionName(), turbo)
			.then(data => {
				return Project.findById(id)
			})
			.then(project => {
				if (project == null){
					throw new Error(Project.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(project.summary())
			})
			.catch(err => {
				reject(new Error(Project.resourceName + ' ' + id + ' not found.'))
			})
		})
	},

	post: (body) => {
		return new Promise((resolve, reject) => {
			let payload = null
			body['dateString'] = utils.formattedDate('MMMM Do, YYYY')

			if (body.name != null)
				body['slug'] = utils.slugVersion(body.name, 6)

			Project.create(body)
			.then(project => {
				payload = project.summary()
				return utils.syncCollection(Project.collectionName(), turbo)
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
			Project.findByIdAndUpdate(id, params, {new:true})
			.then(project => {
				payload = project.summary()
				return utils.syncCollection(Project.collectionName(), turbo)
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
			Project.findByIdAndRemove(id)
			.then(() => {
				return utils.syncCollection(Project.collectionName(), turbo)
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
