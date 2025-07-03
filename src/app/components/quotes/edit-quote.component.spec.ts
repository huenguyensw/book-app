import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditQuoteForm } from './edit-quote.component';
import { QuoteService } from '../../services/quote.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EditQuoteForm', () => {
    let component: EditQuoteForm;
    let fixture: ComponentFixture<EditQuoteForm>;
    let quoteServiceSpy: jasmine.SpyObj<QuoteService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const quoteServiceMock = jasmine.createSpyObj('QuoteService', ['getQuoteById', 'updateQuote']);
        const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl'], { url: '/edit/123456789012345678901234' });

        routerMock.navigateByUrl.and.returnValue(Promise.resolve(true)); 

        await TestBed.configureTestingModule({
            imports: [EditQuoteForm],
            providers: [
                { provide: QuoteService, useValue: quoteServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditQuoteForm);
        component = fixture.componentInstance;
        quoteServiceSpy = TestBed.inject(QuoteService) as jasmine.SpyObj<QuoteService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should extract quoteId from URL and call getQuoteById on init', () => {
        const mockQuote = {
            Id: '123456789012345678901234',
            text: 'Updated quote text',
            author: 'Test Author'
        };

        quoteServiceSpy.getQuoteById.and.returnValue(of(mockQuote));

        component.ngOnInit();

        expect(component.quoteId).toBe('123456789012345678901234');
        expect(quoteServiceSpy.getQuoteById).toHaveBeenCalledWith('123456789012345678901234');
        expect(component.quoteForm.value.text).toBe(mockQuote.text);
    });

    it('should display error if getQuoteById fails', () => {
        quoteServiceSpy.getQuoteById.and.returnValue(throwError(() => ({ error: 'Not found' })));

        component.ngOnInit();

        expect(component.error).toBe('Could not load quote details');
    });

    it('should call updateQuote and navigate on valid form submit', fakeAsync(() => {
        const quoteData = {
            Id: '123456789012345678901234',
            text: 'Updated text',
            author: 'Author'
        };

        component.quoteForm.setValue(quoteData);
        component.quoteId = quoteData.Id;

        quoteServiceSpy.updateQuote.and.returnValue(of({}));

        component.onSubmit();
        tick();

        expect(quoteServiceSpy.updateQuote).toHaveBeenCalledWith(quoteData.Id, quoteData);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/quotes');
    }));

    it('should set error if updateQuote fails', () => {
        const quoteData = {
            Id: '123456789012345678901234',
            text: 'Updated text',
            author: 'Author'
        };

        quoteServiceSpy.getQuoteById.and.returnValue(of({
            _id: quoteData.Id,
            text: 'Old quote',
            author: 'Old Author'
        }));

        component.ngOnInit();

        component.quoteForm.setValue(quoteData);
        component.quoteId = quoteData.Id;

        quoteServiceSpy.updateQuote.and.returnValue(throwError(() => ({ error: 'Failed to update' })));

        component.onSubmit();

        expect(component.error).toBe('Failed to update quote');
    });

    it('should set error if form is invalid on submit', () => {
        component.quoteForm.patchValue({
            text: '',
            author: ''
        });

        component.onSubmit();

        expect(component.error).toBe('Please fill in all required fields');
    });
});
