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
import { ImgUploaderComponent }			from './input/img-uploader/img-uploader.component';
import { HiddenUploaderComponent }		from './input/img-uploader/hidden-uploader.component';
import { PasswordComponent }         	from './input/password/password.component';
import { PasswordSingleComponent }      from './input/password/password-single.component';
import { PasswordsTripletComponent }    from './input/password/passwords-triplet.component';
import { MobileComponent }         		from './input/mobile/mobile.component';
import { NameComponent }         		from './input/name/name.component';
import { GenderComponent }         		from './input/gender/gender.component';
import { BirthdayComponent }         	from './input/birthday/birthday.component';
import { NicknameComponent }         	from './input/nickname/nickname.component';
import { TooltipComponent }         	from './input/tooltip/tooltip.component';
import { MyTitleComponent }      		from './input/title/my-title.component';
import { ImageEntryComponent }         	from './image-grid/image-entry.component';
import { ImageGridV2Component }         from './image-grid/image-grid-v2.component';
import { InputBtnsRowComponent }     	from './input-view/input-btns-row.component';
import { InputsBtnsRowsComponent }      from './input-view/inputs-btns-rows.component';
import { DebugBtnComponent }      		from './debug/debug-btn.component';
import { ImportComponent }      		from './payment/import.component';
import { KlassCardComponent }        	from './klass/klass-card.component';
import { KlassNStudentListComponent }	from './klass/klass-n-student-list.component';
import { PaymentService }         		from './payment/service/payment.service';

import { CheckBoxComponent }      		from './checkbox/checkbox.component';
import { PaginationComponent }      	from './pagination/pagination.component';

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
		ImgUploaderComponent,
		ImageEntryComponent,
		ImageGridV2Component,
		InputBtnsRowComponent,
		InputsBtnsRowsComponent,
		DebugBtnComponent,
		ImportComponent,
		KlassCardComponent,
		KlassNStudentListComponent,
		CheckBoxComponent,
		PaginationComponent,
		MyTitleComponent,
		HiddenUploaderComponent,
		PasswordComponent,
		PasswordSingleComponent,
		PasswordsTripletComponent,
		MobileComponent,
		NameComponent,
		GenderComponent,
		BirthdayComponent,
		NicknameComponent,
		TooltipComponent,
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
		ImgUploaderComponent,
		ImageEntryComponent,
		ImageGridV2Component,
		InputBtnsRowComponent,
		InputsBtnsRowsComponent,
		DebugBtnComponent,
		ImportComponent,
		KlassCardComponent,
		KlassNStudentListComponent,
		CheckBoxComponent,
		PaginationComponent,
		MyTitleComponent,
		HiddenUploaderComponent,
		PasswordComponent,
		PasswordSingleComponent,
		PasswordsTripletComponent,
		MobileComponent,
		NameComponent,
		GenderComponent,
		BirthdayComponent,
		NicknameComponent,
		TooltipComponent,
		FooterComponent,
		SafeHtmlPipe
	],
	providers: [
		DefaultService,
		PaymentService
	]
})
export class WidgetModule {}