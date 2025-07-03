import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddQuoteForm } from './add-quote.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuoteService } from '../../services/quote.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AddQuoteForm', () => {
  let component: AddQuoteForm;
  let fixture: ComponentFixture<AddQuoteForm>;
  let quoteServiceSpy: jasmine.SpyObj<QuoteService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const quoteServiceMock = jasmine.createSpyObj('QuoteService', ['addQuote']);
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    routerMock.navigateByUrl.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [AddQuoteForm], // Standalone component
      providers: [
        { provide: QuoteService, useValue: quoteServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddQuoteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();

    quoteServiceSpy = TestBed.inject(QuoteService) as jasmine.SpyObj<QuoteService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    component.quoteForm.patchValue({ text: '', author: '' });
    expect(component.quoteForm.invalid).toBeTrue();
  });

  it('should have valid form when filled correctly', () => {
    component.quoteForm.patchValue({
      text: 'Test quote',
      author: 'Author Name'
    });
    expect(component.quoteForm.valid).toBeTrue();
  });

  it('should call quoteService.addQuote on valid submit', () => {
    const quoteMock = { Id: '64f2b61fe1f2c3d5d3c5d5d5', text: 'Life is short.', author: 'Someone' };
    component.quoteForm.setValue(quoteMock);

    quoteServiceSpy.addQuote.and.returnValue(of({}));

    component.onSubmit();

    expect(quoteServiceSpy.addQuote).toHaveBeenCalledWith(quoteMock);
  });

  it('should navigate to /quotes after successful submission', fakeAsync(() => {
    const quoteMock = { Id: '64f2b61fe1f2c3d5d3c5d5d5', text: 'Life is short.', author: 'Someone' };
    component.quoteForm.setValue(quoteMock);

    quoteServiceSpy.addQuote.and.returnValue(of({}));
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));

    component.onSubmit();
    tick(); // simulate async

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/quotes');
  }));

  it('should set error message on failed submission', () => {
    const errorResponse = { error: 'Something went wrong' };
    component.quoteForm.patchValue({
      text: 'Error quote',
      author: 'Error author'
    });

    quoteServiceSpy.addQuote.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.error).toBe('Failed to add quote');
  });
});
