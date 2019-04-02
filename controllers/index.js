const JobController = require('./JobController')
const SchoolController = require('./SchoolController')
const PostController = require('./PostController')
const ProjectController = require('./ProjectController')
const ReferenceController = require('./ReferenceController')
const SubscriberController = require('./SubscriberController')

module.exports = {

	job: JobController,
	school: SchoolController,
	post: PostController,
	reference: ReferenceController,
	project: ProjectController,
	subscriber: SubscriberController

}
