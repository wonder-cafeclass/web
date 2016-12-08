import '../rxjs-extensions';
import '../rxjs-operators';

import { NgModule }                 	from '@angular/core';
import { CommonModule }             	from '@angular/common';
import { FormsModule }              	from '@angular/forms';

import { NavTabsComponent }         	from './nav-tabs/nav-tabs.component';

import { EmailComponent }         		from './input/email/email.component';
import { ProfileImgUploadComponent }	from './input/profile-img-upload/profile-img-upload.component';
import { PasswordComponent }         	from './input/password/password.component';
import { PasswordSingleComponent }      from './input/password/password-single.component';
import { PasswordsTripletComponent }      from './input/password/passwords-triplet.component';
import { MobileComponent }         		from './input/mobile/mobile.component';
import { NameComponent }         		from './input/name/name.component';
import { GenderComponent }         		from './input/gender/gender.component';
import { BirthdayComponent }         	from './input/birthday/birthday.component';
import { NicknameComponent }         	from './input/nickname/nickname.component';

import { SafeHtmlPipe }                 from '../util/pipe/safe-html-pipe';

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
		PasswordSingleComponent,
		PasswordsTripletComponent,
		MobileComponent,
		NameComponent,
		GenderComponent,
		BirthdayComponent,
		NicknameComponent,
		SafeHtmlPipe
	],
	exports: [ 
		CommonModule, 
		FormsModule,
		NavTabsComponent,
		EmailComponent,
		ProfileImgUploadComponent,
		PasswordComponent,
		PasswordSingleComponent,
		PasswordsTripletComponent,
		MobileComponent,
		NameComponent,
		GenderComponent,
		BirthdayComponent,
		NicknameComponent,
		SafeHtmlPipe
	]
})
export class WidgetModule {}