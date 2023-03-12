import BaseEntity from './BaseEntity';

class ProjectEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.id_project_group = null;
		this.hash_id = null;
		this.thumbnail = null;
		this.address = null;
		this.lat = null;
		this.lng = null;
		this.installed_power = null;
		this.installed_power_client = null;
		this.commisioning_date = null;
		this.installed_date = null;
		this.last_updated = null;
		this.status = 1;
		this.created_date = null;
		this.created_by = null;
		this.updated_date = null;
		this.updated_by = null;
		this.total_year = 0;
		this.year = null;
		this.config_revenue = 0;
		this.start_date = null;
		this.end_date = null;
		this.jan = null;
		this.feb = null;
		this.mar = null;
		this.apr = null;
		this.may = null;
		this.jun = null;
		this.jul = null;
		this.aug = null;
		this.sep = null;
		this.oct = null;
		this.nov = null;
		this.dec = null;
		this.yearly_egrade_default = null;
		this.yearly_egrade_two = null;
		this.config_yi = 0;
		this.config_po = 0;
		this.total_loss_factor = 1;
		this.config_yi1 = 0;
		this.config_po1 = 0;
		this.total_loss_factor1 = 1;
		this.menu_order = 1;
	}
}
export default ProjectEntity;