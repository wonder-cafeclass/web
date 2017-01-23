import '../rxjs-extensions';
import '../rxjs-operators';

import { NgModule }                 	from '@angular/core';
import { CommonModule }             	from '@angular/common';
import { FormsModule }              	from '@angular/forms';

import { NavTabsComponent }         	from './nav-tabs/nav-tabs.component';

import { DefaultComponent }         	from './input/default/default.component';
import { EmailComponent }         		from './input/email/email.component';
import { ProfileImgUploadComponent }	from './input/profile-img-upload/profile-img-upload.component';
import { ImgUploaderComponent }			from './input/img-uploader/img-uploader.component';
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
import { ImportComponent }      		from './payment/import.component';
import { KlassCardComponent }        	from './klass/klass-card.component';
import { KlassNStudentListComponent }	from './klass/klass-n-student-list.component';
import { KlassInfoForTeacherComponent }	from './klass/klass-info-for-teacher.component';

import { DefaultService }         		from './input/default/service/default.service';
import { PaymentService }         		from './payment/service/payment.service';

import { CheckBoxComponent }      		from './checkbox/checkbox.component';
import { PaginationComponent }      	from './pagination/pagination.component';

import { ClockBoardComponent }       	from './clock/clock-board.component';
import { ClockDigitalComponent }     	from './clock/clock-digital.component';
import { ClockComponent }            	from './clock/clock.component';

// import { CalendarComponent }         	from './calendar/calendar.component';
// import { MiniCalendarComponent }     	from './calendar/mini-calendar.component';
// import { PriceTagComponent }         	from './pricetag/pricetag.component';

import { PriceTagHComponent }        	from './pricetag/pricetag-h.component';
import { ButterflyComponent }        	from './butterfly/butterfly.component';
import { ImageGridComponent }        	from './image-grid/image-grid.component';
import { RadioBtnLinearComponent }   	from './radiobtn/radiobtn-linear.component';
import { InputViewComponent }        	from './input-view/input-view.component';
import { InputViewHListComponent }   	from './input-view/input-view-h-list.component';
import { InputViewUpdownComponent }  	from './input-view/input-view-updown.component';
import { InputViewTableComponent }   	from './input-view-table/input-view-table.component';
import { SingleInputViewComponent }  	from './input-view/single-input-view.component';
import { RadioBtnHListComponent }    	from './radiobtn/radiobtn-h-list.component';
import { CheckBoxHListComponent }    	from './checkbox/checkbox-h-list.component';
import { SmartEditorComponent }      	from './smart-editor/smart-editor.component';
import { CommentListComponent }      	from './comment/comment-list.component';

import { CommentService }            from '../widget/comment/service/comment.service';
import { InputRowComponent }         from '../widget/input-row/input-row.component';
import { HiddenUploaderComponent }   from '../widget/input/img-uploader/hidden-uploader.component';


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
		ImportComponent,
		KlassCardComponent,
		KlassNStudentListComponent,
		KlassInfoForTeacherComponent,
		CheckBoxComponent,
		PaginationComponent,
		MyTitleComponent,
		PasswordComponent,
		PasswordSingleComponent,
		PasswordsTripletComponent,
		MobileComponent,
		NameComponent,
		GenderComponent,
		BirthdayComponent,
		NicknameComponent,
		TooltipComponent,
		ClockBoardComponent,
		ClockDigitalComponent,
		ClockComponent,

		// CalendarComponent,
		// MiniCalendarComponent,
		// PriceTagComponent,

		PriceTagHComponent,
		ButterflyComponent,
		ImageGridComponent,
		RadioBtnLinearComponent,
		InputViewComponent,
		InputViewHListComponent,
		InputViewUpdownComponent,
		InputViewTableComponent,
		SingleInputViewComponent,
		RadioBtnHListComponent,
		CheckBoxHListComponent,
		SmartEditorComponent,
		CommentListComponent,
		InputRowComponent,
		HiddenUploaderComponent
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
		ImportComponent,
		KlassCardComponent,
		KlassNStudentListComponent,
		KlassInfoForTeacherComponent,
		CheckBoxComponent,
		PaginationComponent,
		MyTitleComponent,
		PasswordComponent,
		PasswordSingleComponent,
		PasswordsTripletComponent,
		MobileComponent,
		NameComponent,
		GenderComponent,
		BirthdayComponent,
		NicknameComponent,
		TooltipComponent,
		ClockBoardComponent,
		ClockDigitalComponent,
		ClockComponent,

		// CalendarComponent,
		// MiniCalendarComponent,
		// PriceTagComponent,
		
		PriceTagHComponent,
		ButterflyComponent,
		ImageGridComponent,
		RadioBtnLinearComponent,
		InputViewComponent,
		InputViewHListComponent,
		InputViewUpdownComponent,
		InputViewTableComponent,
		SingleInputViewComponent,
		RadioBtnHListComponent,
		CheckBoxHListComponent,
		SmartEditorComponent,
		CommentListComponent,
		InputRowComponent,
		HiddenUploaderComponent
	],
	providers: [
		DefaultService,
		PaymentService,
		CommentService
	]
})
export class WidgetModule {}