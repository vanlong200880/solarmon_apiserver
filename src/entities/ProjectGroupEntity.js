import BaseEntity from './BaseEntity';

class ProjectGroupEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.name = null;
		this.description = null;
		this.created_date = null;
		this.created_by = null;
		this.status = 1;
		this.updated_date = null;
		this.updated_by = null;
	}
}
export default ProjectGroupEntity;