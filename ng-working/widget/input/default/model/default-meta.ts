import { DefaultType }	from './default-type';

export class DefaultMeta {

	private defaultType:DefaultType;

	constructor(
	    public title:string,
	    public placeholder:string,
	    public eventKey:string,
	    public checkerKey:string,
	    public type:string
	) {

		this.defaultType = new DefaultType();

	}

	public isOK() :boolean {

		if(this.hasNoTitle()) {
			return false;
		}
		if(this.hasNoPlaceholder()) {
			return false;
		}
		if(this.hasNoEventKey()) {
			return false;
		}
		if(this.hasNoCheckerKey()) {
			return false;
		}

		return true;
	}

	public hasNoTitle() :boolean {
		return !this.hasTitle();
	}
	public hasTitle() :boolean {
		if(null == this.title || "" === this.title) {
			return false;
		}
		return true;
	}

	public hasNoPlaceholder() :boolean {
		return !this.hasPlaceholder();
	}
	public hasPlaceholder() :boolean {
		if(null == this.placeholder || "" === this.placeholder) {
			return false;
		}
		return true;
	}	

	public hasNoEventKey() :boolean {
		return !this.hasEventKey();
	}
	public hasEventKey() :boolean {
		if(null == this.eventKey || "" === this.eventKey) {
			return false;
		}
		return true;
	}	

	public hasNoCheckerKey() :boolean {
		return !this.hasCheckerKey();
	}
	public hasCheckerKey() :boolean {
		if(null == this.checkerKey || "" === this.checkerKey) {
			return false;
		}
		return true;
	}		
}