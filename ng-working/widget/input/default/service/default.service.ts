import { Injectable,
		 QueryList }              from '@angular/core';

import { DefaultComponent }       from '../default.component';
import { DefaultMeta }            from '../model/default-meta';

@Injectable()
export class DefaultService {

	// @ Desc : DefaultComponent로 부터 원하는 input component를 가져옵니다.
	public getInput(inputComponentList: QueryList<DefaultComponent>, eventKey:string) :any {

		// let isDebug:boolean = true;
		let isDebug:boolean = false;
		if(isDebug) console.log("default.service / getInput / init");

		let target:DefaultComponent = null;

		inputComponentList.forEach(function(inputComponent) {

			if(isDebug) console.log("default.service / getInput / eventKey : ",eventKey);
			if(isDebug) console.log("default.service / getInput / inputComponent.getEventKey() : ",inputComponent.getEventKey());

			if(inputComponent.hasEventKey(eventKey)) {
				if(isDebug) console.log("default.service / getInput / inputComponent : ",inputComponent);
				target = inputComponent;
				return;
			}

		}); // end for-each

		return target;
	}

}
