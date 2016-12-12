import '../rxjs-extensions';
import '../rxjs-operators';

import { NgModule }                 	from '@angular/core';
import { CommonModule }             	from '@angular/common';
import { FormsModule }              	from '@angular/forms';

import { NavTabsComponent }         	from './nav-tabs/nav-tabs.component';

import { DefaultService }         		from './input/default/service/default.service';

import { DefaultComponent }         	from './input/default/default.component';
import { EmailComponent }         		from './input/email/email.component';
import { ProfileImgUploadComponent }	from './input/profile-img-upload/profile-img-upload.component';
import { PasswordComponent }         	from './input/password/password.component';
import { PasswordSingleComponent }      from './input/password/password-single.component';
import { PasswordsTripletComponent }    from './input/password/passwords-triplet.component';
import { MobileComponent }         		from './input/mobile/mobile.component';
import { NameComponent }         		from './input/name/name.component';
import { GenderComponent }         		from './input/gender/gender.component';
import { BirthdayComponent }         	from './input/birthday/birthday.component';
import { NicknameComponent }         	from './input/nickname/nickname.component';

import { FooterComponent }         		from './footer/footer.component';

import { SafeHtmlPipe }                 from '../util/pipe/safe-html-pipe';

// @ Desc : Shared module.
@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		NavTabsComponent,
		DefaultComponent,
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
		FooterComponent,
		SafeHtmlPipe
	],
	exports: [ 
		CommonModule, 
		FormsModule,
		NavTabsComponent,
		DefaultComponent,
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
		FooterComponent,
		SafeHtmlPipe
	],
	providers: [
		DefaultService
	]
})
export class WidgetModule {}