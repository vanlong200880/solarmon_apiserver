import BaseEntity from './BaseEntity';

class DeviceControlCalendarEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.id_device = null;
		this.title = null;
		this.date_from = null;
		this.date_to = null;
	}
}
export default DeviceControlCalendarEntity;