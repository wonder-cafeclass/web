import '../rxjs-extensions';
import '../rxjs-operators';

import { NgModule }                 	from '@angular/core';
import { CommonModule }             	from '@angular/common';
import { FormsModule }              	from '@angular/forms';

import { NavTabsComponent }         	from './nav-tabs/nav-tabs.component';

import { EmailComponent }         		from './input/email/email.component';
import { ProfileImgUploadComponent }	from './input/profile-img-upload/profile-img-upload.component';
import { PasswordComponent }         	from './input/password/password.component';
import { MobileComponent }         		from './input/mobile/mobile.component';
import { NameComponent }         		from './input/name/name.component';
import { GenderComponent }         		from './input/gender/gender.component';
import { BirthdayComponent }         	from './input/birthday/birthday.component';
import { NicknameComponent }         	from './input/nickname/nickname.component';

// @ Desc : Shared module.
@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		NavTabsComponent,
		EmailComponent,
		ProfileImgUploadComponent,
		PasswordComponent,
		MobileComponent,
		NameComponent,
		GenderComponent,
		BirthdayComponent,
		NicknameComponent
	],
	exports: [ 
		NavTabsComponent,
		EmailComponent,
		ProfileImgUploadComponent,
		PasswordComponent,
		MobileComponent,
		NameComponent,
		GenderComponent,
		BirthdayComponent,
		NicknameComponent,
		CommonModule, 
		FormsModule 
	]
})
export class WidgetModule {}